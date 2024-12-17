import {LitElement, html, render}   from 'lit';
import {query}                      from 'lit/decorators/query.js';
import {customElement, property}    from 'lit/decorators.js';

import './flowy.css'

export interface Block {
    childwidth: number
    parent: number
    id: number
    x: number
    y: number
    width: number
    height: number
}

export interface BlockData {
    id: number
    parent: number
    data: Array<{ name: string | null, value: string }>
    attr: Array<Record<string, any>>
}

export interface Output {
    html: string
    blockarr: Array<Block>
    blocks: Array<any>
}

type ActionType = 'drop' | 'rearrange'

function toInt(value: number | string) {
    if (typeof (value) === 'number')
        return parseInt(`${value}`)
    return parseInt(value)
}

const createOrUpdateArrow = ( id:number|HTMLElement, x:number, y:number, paddingy:number = 80, start_x = 20 ): HTMLElement => {

    let arrow:HTMLElement
    if( typeof(id) === 'number') {
        arrow = document.createElement('div')
        arrow.setAttribute( 'id', `arrow${id}` )
        arrow.classList.add( 'arrowblock')
    }
    else {
        arrow = id
    }

    const content = html`
        <svg preserveaspectratio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M${start_x} 0 L${start_x} ${paddingy/2} L${x} ${paddingy/2} L${x} ${y}" 
                stroke="#C5CCD0" 
                stroke-width="2px"/>
            <path d="M${x - 5} ${y - 5} H${x + 5} L${x} ${y} L${x - 5} ${y - 5} Z" 
                fill="#C5CCD0"/>
        </svg>
        `
    render( content, arrow )

    return arrow
}

function hasParentClass(element: HTMLElement, classname: string): boolean {
    if (element.className) {
        if (element.className.split(' ').indexOf(classname) >= 0) return true;
    }
    return (element.parentNode !== null) && hasParentClass(element.parentNode as HTMLElement, classname);
}

type AddBlockArgs = Omit<Block, 'height'|'width'> & Partial<Block>

/**
 *  events supported by element
 * 
 * @see {@link https://github.com/Microsoft/TypeScript/issues/9604#issuecomment-231659171|issue #9604} 
 * Overriding addEventListener to augment event objects #9604
 */
export interface FlowyDiagram extends HTMLElement {
    /**
     * event raised when start dragging template over diagram 
     * 
     * @param type 'templateGrabbed'
     * @param listener (ev: CustomEvent<HTMLElement>) => void
     * @param capture 
     */
    addEventListener(type: 'templateGrabbed', listener: (ev: CustomEvent<HTMLElement>) => void, capture?: boolean): void
    /**
     * event raised when start dragging template over diagram 
     * 
     * @param type 'templateReleased'
     * @param listener (ev: CustomEvent<HTMLElement>) => void
     * @param capture 
     */
    addEventListener(type: 'templateReleased', listener: (ev: CustomEvent<HTMLElement>) => void, capture?: boolean): void
    /**
     * event raised when a diagram's block is selected 
     * 
     * @param type 'blockSelected'
     * @param listener (ev: CustomEvent<HTMLElement>) => void
     * @param capture 
     */
    addEventListener(type: 'blockSelected', listener: (ev: CustomEvent<HTMLElement>) => void, capture?: boolean): void
    /**
     * event raised when a block's sheet is closeds 
     * 
     * @param type 'sheetClosed'
     * @param listener (ev: CustomEvent<HTMLElement>) => void
     * @param capture 
     */
    addEventListener(type: 'sheetClosed', listener: (ev: CustomEvent<HTMLElement>) => void, capture?: boolean): void
    /**
     * event raised when a block's is dropped.
     *  
     * it is a cancellable event, if call preventDefault() drag is cancelled  
     * 
     * @param type 'snapping'
     * @param listener (ev: CustomEvent<HTMLElement>) => void
     * @param capture 
     */
    addEventListener(type: 'snapping', listener: (ev: CustomEvent<{ target:HTMLElement, parent?: HTMLElement }>) => void, capture?: boolean): void
    /**
     * 
     * it is a cancellable event, if call preventDefault() arranged is cancelled  
     * 
     * @param type 'rearranged'
     * @param listener (ev: CustomEvent<HTMLElement>) => void
     * @param capture 
     */
    addEventListener(type: 'rearranged', listener: (ev: CustomEvent<HTMLElement>) => void, capture?: boolean): void
    
    addEventListener(type: string, listener: EventListener | EventListenerObject, useCapture?: boolean): void
}

@customElement('flowy-diagram')
export class FlowyDiagram extends LitElement {

    // css seems doesn't work without shadow dom
    // static styles = css`
    // p {
    //   color: green;
    // }
    // `

    @query('#canvas')
    _canvas!: HTMLCanvasElement;

    @query('.indicator')
    _indicator!: HTMLElement;

    @property( { type: 'number'} )
    spacing_x = 20

    @property( { type: 'number'} )
    spacing_y = 80

    render() {
        return html`<div id="canvas">`
    }

    load!: () => void
    import!: (output: Output) => void
    output!: () => Output | undefined
    deleteBlocks!: () => void
    beginDrag!: (event: any) => void
    endDrag!: (event: any) => void
    moveBlock!: (event: any) => void
    addBlock!:( block?:AddBlockArgs ) => void

    #dragBlockValue!: () => number

    #blockByValue(value: number | string) {
        return document.getElementById( `block${value}`) as HTMLElement
    }

    #arrowByValue(value: number | string) {
        return document.getElementById( `arrow${value}`) as HTMLElement
    }
  
    /**
     * disable shadow root
     * 
     * @returns 
     * @see [How to create LitElement without Shadow DOM?](https://stackoverflow.com/a/55213037/521197)
     */
    createRenderRoot() {
        return this;
    }

    connectedCallback() {
        super.connectedCallback()
    }

    firstUpdated() {

        let loaded = false;
        this.load = () => {
            if (!loaded)
                loaded = true;
            else
                return;
            let blocks = Array<Block>();
            let blockstemp = Array<Block>();
            let canvas_div = this._canvas;
            let absx = 0;
            let absy = 0;
            if (window.getComputedStyle(canvas_div).position == "absolute" || window.getComputedStyle(canvas_div).position == "fixed") {
                absx = canvas_div.getBoundingClientRect().left;
                absy = canvas_div.getBoundingClientRect().top;
            }
            let active = false;
            let paddingx = this.spacing_x
            let paddingy = this.spacing_y
            let offsetleft = 0
            let rearrange = false;
            let drag: HTMLElement
            let dragx: number
            let dragy: number
            let original: HTMLElement;
            let mouse_x:number, mouse_y:number;
            let dragblock = false;
            let prevblock = 0;
            
            // indicator
            const el = document.createElement("DIV");
            el.classList.add('indicator');
            el.classList.add('invisible');
            canvas_div.appendChild(el);

            this.#dragBlockValue = () => {
                
                const value = /block(\d+)/.exec(drag.id)![1]

                return parseInt(value)
            }

            this.addBlock = ( block?:AddBlockArgs ) => {
            
                const { height, width } = window.getComputedStyle(drag)

                if( block ) {

                    blocks.push({
                        width: parseInt(width),
                        height: parseInt(height),
                        ...block,
                    })

                }
                else {

                    const drag_rect = drag.getBoundingClientRect()
                    const canvas_rect = canvas_div.getBoundingClientRect()

                    blocks.push({
                        parent: -1,
                        childwidth: 0,
                        id: this.#dragBlockValue(),
                        x: (drag_rect.left + window.scrollX) + (parseInt(width) / 2) + canvas_div.scrollLeft - canvas_rect.left,
                        y: (drag_rect.top + window.scrollY) + (parseInt(height) / 2) + canvas_div.scrollTop - canvas_rect.top,
                        width: parseInt(width),
                        height: parseInt(height)
                    })
                }

            }

            this.import = output => {
                canvas_div.innerHTML = output.html;
                for (let a = 0; a < output.blockarr.length; a++) {

                    this.addBlock( output.blockarr[a] )
                }
                if (blocks.length > 1) {
                    rearrangeMe();
                    checkOffset();
                }
            }

            /**
             * output
             */
            this.output = () => {
                let html_ser = canvas_div.innerHTML;
                let json_data: Output = {
                    html: html_ser,
                    blockarr: blocks,
                    blocks: Array<BlockData>()
                };
                if (blocks.length > 0) {
                    for (let i = 0; i < blocks.length; i++) {
                        json_data.blocks.push({
                            id: blocks[i].id,
                            parent: blocks[i].parent,
                            data: [],
                            attr: []
                        });
                        let blockParent = this.#blockByValue(blocks[i].id)
                        blockParent?.querySelectorAll("input").forEach(block => {
                            let json_name = block.getAttribute("name");
                            let json_value = block.value;
                            json_data.blocks[i].data.push({
                                name: json_name,
                                value: json_value
                            });
                        });
                        Array.prototype.slice.call(blockParent?.attributes).forEach(attribute => {
                            let jsonobj: Record<string, any> = {}
                            jsonobj[attribute.name] = attribute.value;
                            json_data.blocks[i].attr.push(jsonobj);
                        });
                    }
                    return json_data;
                }
            }

            /**
             * deleteBlocks
             */
            this.deleteBlocks = () => {
                blocks = [];
                canvas_div.innerHTML = "<div class='indicator invisible'></div>";
            }

            this.beginDrag = (event:UIEvent) => {

                const { position } = window.getComputedStyle(canvas_div)

                if (position == "absolute" || position == "fixed") {

                    const { left, top } =  canvas_div.getBoundingClientRect()
                    absx = left;
                    absy = top;
                }

                if ('targetTouches' in event && event.targetTouches) {

                    const { clientX, clientY } = (<TouchEvent>event).changedTouches[0]
                    mouse_x = clientX
                    mouse_y = clientY
                
                } else {

                    const { clientX, clientY } = event as MouseEvent
                    mouse_x = clientX
                    mouse_y = clientY
                }

                const target = event.target as HTMLElement 

                const item = target.closest(".create-flowy") as HTMLElement

                const is_right_click = ( event instanceof MouseEvent && event.button == 2 /* right click */)

                if ( item && !is_right_click ) {
                    
                    original = item

                    let newNode = item.cloneNode(true) as HTMLElement;

                    item.classList.add("dragnow");
                    newNode.classList.add("block");
                    newNode.classList.remove("create-flowy");

                    if (blocks.length === 0) {

                        newNode.setAttribute( 'id', `block${blocks.length}`)
                        document.body.appendChild(newNode);
                        
                    } else {

                        const max = blocks.reduce((result, a) => Math.max(result, a.id), 0)

                        newNode.setAttribute( 'id', `block${max + 1}`)
                        document.body.appendChild(newNode);
                    }
                    
                    drag = newNode

                    blockGrabbed(item);

                    drag.classList.add("dragging");

                    active = true;

                    const { left , top } = item.getBoundingClientRect()

                    dragx = mouse_x - left
                    dragy = mouse_y - top

                    drag.style.left = mouse_x - dragx + "px";
                    drag.style.top = mouse_y - dragy + "px";
                }
            }

            this.endDrag = (event:UIEvent) => {

                const is_right_click = ( event instanceof MouseEvent && event.button == 2 /* right click */)

                // GUARD
                if( is_right_click ) return
                if( !(active || rearrange) ) return
            
                dragblock = false;

                blockReleased( original );
                
                if (!this._indicator.classList.contains("invisible")) {
                    this._indicator.classList.add("invisible");
                }
                
                // ACTIVE STRATEGY
                if (active) {
                    
                    original.classList.remove("dragnow");
                    drag.classList.remove("dragging");

                    if(blocks.length === 0) {

                        const { top:drag_top, left:drag_left } = drag.getBoundingClientRect()
                        const { top:canvas_top, left:canvas_left } = canvas_div.getBoundingClientRect()

                        if ((drag_top + window.scrollY) > (canvas_top + window.scrollY) && (drag_left + window.scrollX) > (canvas_left + window.scrollX)) {
                            firstBlock('drop')
                        }
                        else {
                            removeSelection() 
                        }
                        return
                    }

                    const blocko = blocks.map(a => a.id)
          
                    for (let i = 0; i < blocks.length; i++) {

                        const value = blocko[i]

                        if (checkAttach(value)) {
                            active = false

                            if (blockSnap(drag, false, this.#blockByValue(value))) {
                                snap(drag, i, blocko)
                            } else {
                                active = false
                                removeSelection()
                            }
                            break;
                        } else if (i == blocks.length - 1) {
                            active = false
                            removeSelection()
                        }
                    }
    
                }
                
                // REARRANGE STRATEGY
                if ( rearrange  ) {

                    if( this.#dragBlockValue() === 0 ) {
                        firstBlock('rearrange')
                        return
                    }

                    const blocko = blocks.map(a => a.id);

                    for (let i = 0; i < blocks.length; i++) {
                        if (checkAttach(blocko[i])) {
                            active = false;
                            snap(drag, i, blocko);
                            break;
                        } 
                        else if (i == blocks.length - 1) {
                    
                            if (beforeDelete(drag, blocks.filter(id => id.id == blocko[i])[0])) {
                                active = false;
                                snap(drag, blocko.indexOf(prevblock), blocko);
                                break;
                            } 
                            else {
                                rearrange = false;
                                blockstemp = [];
                                active = false;
                                removeSelection();
                                break;
                            }
                        }
                    }
                } 
                

                
            }

            function checkAttach(id: number) { 

                const b = blocks.find( a => a.id == id  )!
                console.assert( b!==undefined, `blocks[${id}] not found!`)

                const xpos = (drag.getBoundingClientRect().left + window.scrollX) + (parseInt(window.getComputedStyle(drag).width) / 2) + canvas_div.scrollLeft - canvas_div.getBoundingClientRect().left;
                const ypos = (drag.getBoundingClientRect().top + window.scrollY) + canvas_div.scrollTop - canvas_div.getBoundingClientRect().top;
                
                if (xpos >= b.x - (b.width / 2) - paddingx && xpos <= b.x + (b.width / 2) + paddingx && ypos >=b.y - (b.height / 2) && ypos <= b.y + b.height) {
                    return true;
                } 
                
                return false;
                
            }

            const addDragToCanvas = () => {

                canvas_div.appendChild(drag)

                drag.addEventListener("click", (e) => {

                    // guard 
                    const skip = ( rearrange /* && drag.classList.contains('dragging')*/ )

                    drag.classList.remove('dragging')
                    rearrange = false

                    if( skip ) return

                    const event = new CustomEvent<HTMLElement>('blockSelected', {
                        detail: drag
                    })
                    this.dispatchEvent(event)
            
                })

            }

            const removeSelection = () => {
                canvas_div.appendChild(this._indicator);
                drag.parentNode?.removeChild(drag);
            }

            const firstBlock = (type: ActionType) => {
                if (type == "drop") {

                    blockSnap(drag, true, undefined);
                    active = false;
                    drag.style.top = (drag.getBoundingClientRect().top + window.scrollY) - (absy + window.scrollY) + canvas_div.scrollTop + "px";
                    drag.style.left = (drag.getBoundingClientRect().left + window.scrollX) - (absx + window.scrollX) + canvas_div.scrollLeft + "px";
                    
                    addDragToCanvas()

                    this.addBlock()

                } else if (type == "rearrange") {

                    for (let w = 0; w < blockstemp.length; w++) {
                        if (blockstemp[w].id != this.#dragBlockValue()) {
                            const blockParent = this.#blockByValue(blockstemp[w].id)
                            const arrowParent = this.#arrowByValue(blockstemp[w].id)
                            blockParent.style.left = (blockParent.getBoundingClientRect().left + window.scrollX) - (window.scrollX) + canvas_div.scrollLeft - 1 - absx + "px";
                            blockParent.style.top = (blockParent.getBoundingClientRect().top + window.scrollY) - (window.scrollY) + canvas_div.scrollTop - absy - 1 + "px";
                            arrowParent.style.left = (arrowParent.getBoundingClientRect().left + window.scrollX) - (window.scrollX) + canvas_div.scrollLeft - absx - 1 + "px";
                            arrowParent.style.top = (arrowParent.getBoundingClientRect().top + window.scrollY) + canvas_div.scrollTop - 1 - absy + "px";
                            canvas_div.appendChild(blockParent);
                            canvas_div.appendChild(arrowParent);
                            blockstemp[w].x = (blockParent.getBoundingClientRect().left + window.scrollX) + (toInt(blockParent.offsetWidth) / 2) + canvas_div.scrollLeft - canvas_div.getBoundingClientRect().left - 1;
                            blockstemp[w].y = (blockParent.getBoundingClientRect().top + window.scrollY) + (toInt(blockParent.offsetHeight) / 2) + canvas_div.scrollTop - canvas_div.getBoundingClientRect().top - 1;
                        }
                    }
                    blockstemp.filter(a => a.id == 0)[0].x = (drag.getBoundingClientRect().left + window.scrollX) + (parseInt(window.getComputedStyle(drag).width) / 2) + canvas_div.scrollLeft - canvas_div.getBoundingClientRect().left;
                    blockstemp.filter(a => a.id == 0)[0].y = (drag.getBoundingClientRect().top + window.scrollY) + (parseInt(window.getComputedStyle(drag).height) / 2) + canvas_div.scrollTop - canvas_div.getBoundingClientRect().top;
                    blocks = blocks.concat(blockstemp);
                    blockstemp = [];
                }
            }

            const drawArrow = (arrow: Block, x: number, y: number, id: number) => {

                const _source_block = blocks.find(a => a.id == id)!
                const _target_block_id = this.#dragBlockValue()

                const adjustment = (absx + window.scrollX) - canvas_div.scrollLeft - canvas_div.getBoundingClientRect().left
               
                let el:HTMLElement 
                
                if (x < 0) {

                    el = createOrUpdateArrow(_target_block_id, 5, y, paddingy, _source_block.x - arrow.x + 5 ) 
                    el.setAttribute( "source", `block${_source_block.id}`)
                    el.setAttribute( "target", `block${_target_block_id}`)
                    canvas_div.appendChild(el)
                    el.style.left = `${arrow.x - 5 - adjustment}px`

                } else {

                    el = createOrUpdateArrow(_target_block_id, x, y, paddingy)
                    el.setAttribute( "source", `block${_source_block.id}`)
                    el.setAttribute( "target", `block${_target_block_id}`)
                    canvas_div.appendChild(el)
                    el.style.left = `${_source_block.x - 20 - adjustment}px`

                }

                el.style.top = `${_source_block.y + (_source_block.height / 2) + canvas_div.getBoundingClientRect().top - absy}px`
            }

            const updateArrow = (arrow: Block, x: number, y: number, children: Block) => {

                const _source_block = blocks.find(a => a.id == children.parent)!
                const el = this.#arrowByValue(children.id)

                const adjustment = (absx + window.scrollX) - canvas_div.getBoundingClientRect().left

                if (x < 0) {

                    createOrUpdateArrow( el, 5, y, paddingy, _source_block.x - arrow.x + 5 )
                    el.style.left = `${arrow.x - 5 - adjustment}px`

                } else {

                    createOrUpdateArrow( el, x, y, paddingy )
                    el.style.left = `${_source_block.x - 20 - adjustment}px` 

                }
            }

            const snap = (drag: HTMLElement, i: number, blocko: Array<number>) => {
                if (!rearrange) {
                    addDragToCanvas()
                }
                let totalwidth = 0;
                let totalremove = 0;

                for (let w = 0; w < blocks.filter(id => id.parent == blocko[i]).length; w++) {
                    let children = blocks.filter(id => id.parent == blocko[i])[w];
                    if (children.childwidth > children.width) {
                        totalwidth += children.childwidth + paddingx;
                    } else {
                        totalwidth += children.width + paddingx;
                    }
                }

                totalwidth += parseInt(window.getComputedStyle(drag).width);

                for (let w = 0; w < blocks.filter(id => id.parent == blocko[i]).length; w++) {
                    let children = blocks.filter(id => id.parent == blocko[i])[w];
                    if (children.childwidth > children.width) {
                        this.#blockByValue(children.id).style.left = blocks.filter(a => a.id == blocko[i])[0].x - (totalwidth / 2) + totalremove + (children.childwidth / 2) - (children.width / 2) + "px";
                        children.x = blocks.filter(id => id.parent == blocko[i])[0].x - (totalwidth / 2) + totalremove + (children.childwidth / 2);
                        totalremove += children.childwidth + paddingx;
                    } else {
                        this.#blockByValue(children.id).style.left = blocks.filter(a => a.id == blocko[i])[0].x - (totalwidth / 2) + totalremove + "px";
                        children.x = blocks.filter(id => id.parent == blocko[i])[0].x - (totalwidth / 2) + totalremove + (children.width / 2);
                        totalremove += children.width + paddingx;
                    }
                }
                drag.style.left = blocks.filter(id => id.id == blocko[i])[0].x - (totalwidth / 2) + totalremove - (window.scrollX + absx) + canvas_div.scrollLeft + canvas_div.getBoundingClientRect().left + "px";
                drag.style.top = blocks.filter(id => id.id == blocko[i])[0].y + (blocks.filter(id => id.id == blocko[i])[0].height / 2) + paddingy - (window.scrollY + absy) + canvas_div.getBoundingClientRect().top + "px";
                if (rearrange) {
                    blockstemp.filter(a => a.id == this.#dragBlockValue())[0].x = (drag.getBoundingClientRect().left + window.scrollX) + (parseInt(window.getComputedStyle(drag).width) / 2) + canvas_div.scrollLeft - canvas_div.getBoundingClientRect().left;
                    blockstemp.filter(a => a.id == this.#dragBlockValue())[0].y = (drag.getBoundingClientRect().top + window.scrollY) + (parseInt(window.getComputedStyle(drag).height) / 2) + canvas_div.scrollTop - canvas_div.getBoundingClientRect().top;
                    blockstemp.filter(a => a.id == this.#dragBlockValue())[0].parent = blocko[i];
                    for (let w = 0; w < blockstemp.length; w++) {
                        if (blockstemp[w].id != this.#dragBlockValue()) {
                            const blockParent = this.#blockByValue(blockstemp[w].id)
                            const arrowParent = this.#arrowByValue(blockstemp[w].id)
                            blockParent.style.left = (blockParent.getBoundingClientRect().left + window.scrollX) - (window.scrollX + canvas_div.getBoundingClientRect().left) + canvas_div.scrollLeft + "px";
                            blockParent.style.top = (blockParent.getBoundingClientRect().top + window.scrollY) - (window.scrollY + canvas_div.getBoundingClientRect().top) + canvas_div.scrollTop + "px";
                            arrowParent.style.left = (arrowParent.getBoundingClientRect().left + window.scrollX) - (window.scrollX + canvas_div.getBoundingClientRect().left) + canvas_div.scrollLeft + 20 + "px";
                            arrowParent.style.top = (arrowParent.getBoundingClientRect().top + window.scrollY) - (window.scrollY + canvas_div.getBoundingClientRect().top) + canvas_div.scrollTop + "px";
                            canvas_div.appendChild(blockParent);
                            canvas_div.appendChild(arrowParent);

                            blockstemp[w].x = (blockParent.getBoundingClientRect().left + window.scrollX) + (parseInt(window.getComputedStyle(blockParent).width) / 2) + canvas_div.scrollLeft - canvas_div.getBoundingClientRect().left;
                            blockstemp[w].y = (blockParent.getBoundingClientRect().top + window.scrollY) + (parseInt(window.getComputedStyle(blockParent).height) / 2) + canvas_div.scrollTop - canvas_div.getBoundingClientRect().top;
                        }
                    }
                    blocks = blocks.concat(blockstemp);
                    blockstemp = [];
                } else {
                    this.addBlock({
                        childwidth: 0,
                        parent: blocko[i],
                        id: this.#dragBlockValue(),
                        x: (drag.getBoundingClientRect().left + window.scrollX) + (parseInt(window.getComputedStyle(drag).width) / 2) + canvas_div.scrollLeft - canvas_div.getBoundingClientRect().left,
                        y: (drag.getBoundingClientRect().top + window.scrollY) + (parseInt(window.getComputedStyle(drag).height) / 2) + canvas_div.scrollTop - canvas_div.getBoundingClientRect().top,
                        // width: parseInt(window.getComputedStyle(drag).width),
                        // height: parseInt(window.getComputedStyle(drag).height)
                    })
                }

                let arrowblock = blocks.filter(a => a.id == this.#dragBlockValue())[0];
                let arrowx = arrowblock.x - blocks.filter(a => a.id == blocko[i])[0].x + 20;
                let arrowy = paddingy;
                
                drawArrow(arrowblock, arrowx, arrowy, blocko[i]);

                if (blocks.filter(a => a.id == blocko[i])[0].parent != -1) {
                    let flag = false;
                    let idval = blocko[i];
                    while (!flag) {
                        if (blocks.filter(a => a.id == idval)[0].parent == -1) {
                            flag = true;
                        } else {
                            let zwidth = 0;
                            for (let w = 0; w < blocks.filter(id => id.parent == idval).length; w++) {
                                let children = blocks.filter(id => id.parent == idval)[w];
                                if (children.childwidth > children.width) {
                                    if (w == blocks.filter(id => id.parent == idval).length - 1) {
                                        zwidth += children.childwidth;
                                    } else {
                                        zwidth += children.childwidth + paddingx;
                                    }
                                } else {
                                    if (w == blocks.filter(id => id.parent == idval).length - 1) {
                                        zwidth += children.width;
                                    } else {
                                        zwidth += children.width + paddingx;
                                    }
                                }
                            }
                            blocks.filter(a => a.id == idval)[0].childwidth = zwidth;
                            idval = blocks.filter(a => a.id == idval)[0].parent;
                        }
                    }
                    blocks.filter(id => id.id == idval)[0].childwidth = totalwidth;
                }
                // if (rearrange) {
                //     rearrange = false;
                //     drag.classList.remove("dragging");
                // }
                rearrangeMe();
                checkOffset();
            }

            function touchblock(event: any) {
                dragblock = false;
                if (hasParentClass(event.target, "block")) {
                    let theblock = event.target.closest(".block");
                    if (event.targetTouches) {
                        mouse_x = event.targetTouches[0].clientX;
                        mouse_y = event.targetTouches[0].clientY;
                    } else {
                        mouse_x = event.clientX;
                        mouse_y = event.clientY;
                    }
                    if (event.type !== "mouseup" && hasParentClass(event.target, "block")) {
                        if (event.which != 3) {
                            if (!active && !rearrange) {
                                dragblock = true;
                                drag = theblock;
                                dragx = mouse_x - (drag.getBoundingClientRect().left + window.scrollX);
                                dragy = mouse_y - (drag.getBoundingClientRect().top + window.scrollY);
                            }
                        }
                    }
                }
            }

            this.moveBlock = (event) => {
                if (event.targetTouches) {
                    mouse_x = event.targetTouches[0].clientX;
                    mouse_y = event.targetTouches[0].clientY;
                } else {
                    mouse_x = event.clientX;
                    mouse_y = event.clientY;
                }
                if (dragblock) {

                    rearrange = true;
                    drag.classList.add("dragging");
                    
                    let blockid = this.#dragBlockValue();
                    
                    const _pb = blocks.find(a => a.id == blockid)!
                    console.assert( _pb!==undefined, "prev block not found!" )

                    prevblock = _pb.parent;
                    
                    blockstemp.push(_pb);
                    
                    blocks = blocks.filter(e => e.id != blockid)

                    if (blockid != 0) {
                        this.#arrowByValue(blockid).remove();
                    }

                    let layer = blocks.filter(a => a.parent == blockid);

                    let flag = false;
                    let foundids = Array<number>()
                    let allids = Array<number>()
                    
                    while (!flag) {

                        layer.filter( l => l.id != blockid ).map( l => l.id ).forEach( lid => {
                            const _bb = blocks.find(a => a.id == lid )!
                            console.assert( _bb!==undefined, `block[${lid}] not found!` )

                            blockstemp.push( _bb );
                            const blockParent = this.#blockByValue(lid)
                            const arrowParent = this.#arrowByValue(lid)
                            blockParent.style.left = (blockParent.getBoundingClientRect().left + window.scrollX) - (drag.getBoundingClientRect().left + window.scrollX) + "px";
                            blockParent.style.top = (blockParent.getBoundingClientRect().top + window.scrollY) - (drag.getBoundingClientRect().top + window.scrollY) + "px";
                            arrowParent.style.left = (arrowParent.getBoundingClientRect().left + window.scrollX) - (drag.getBoundingClientRect().left + window.scrollX) + "px";
                            arrowParent.style.top = (arrowParent.getBoundingClientRect().top + window.scrollY) - (drag.getBoundingClientRect().top + window.scrollY) + "px";
                            drag.appendChild(blockParent);
                            drag.appendChild(arrowParent);
                            foundids.push(lid)
                            allids.push(lid)

                        })
                        if (foundids.length == 0) {
                            flag = true;
                        } else {
                            layer = blocks.filter(a => foundids.includes(a.parent));
                            foundids = [];
                        }
                    }


                    for (let i = 0; i < blocks.filter(a => a.parent == blockid).length; i++) {

                        let blocknumber = blocks.filter(a => a.parent == blockid)[i].id;
                        blocks = blocks.filter(e => e.id != blocknumber)
                    }

                    for (let i = 0; i < allids.length; i++) {

                        let blocknumber = allids[i];
                        blocks = blocks.filter(e => e.id != blocknumber)
                    }

                    if (blocks.length > 1) {
                        rearrangeMe();
                    }

                    dragblock = false;
                }

                if (active) {
                    
                    drag.style.left = mouse_x - dragx + "px";
                    drag.style.top = mouse_y - dragy + "px";

                } else if (rearrange) {
                    
                    drag.style.left = mouse_x - dragx - (window.scrollX + absx) + canvas_div.scrollLeft + "px";
                    drag.style.top = mouse_y - dragy - (window.scrollY + absy) + canvas_div.scrollTop + "px";
                    const b = blockstemp.find(a => a.id == this.#dragBlockValue())!
                    b.x = (drag.getBoundingClientRect().left + window.scrollX) + (parseInt(window.getComputedStyle(drag).width) / 2) + canvas_div.scrollLeft;
                    b.y = (drag.getBoundingClientRect().top + window.scrollY) + (parseInt(window.getComputedStyle(drag).height) / 2) + canvas_div.scrollTop;
                }

                if (active || rearrange) {
                    
                    const _rect = canvas_div.getBoundingClientRect()

                    if (mouse_x > _rect.width + _rect.left - 10 && mouse_x < _rect.width + _rect.left + 10) {
                        canvas_div.scrollLeft += 10;
                    } else if (mouse_x < _rect.left + 10 && mouse_x > _rect.left - 10) {
                        canvas_div.scrollLeft -= 10;
                    } else if (mouse_y > _rect.height + _rect.top - 10 && mouse_y < _rect.height + _rect.top + 10) {
                        canvas_div.scrollTop += 10;
                    } else if (mouse_y < _rect.top + 10 && mouse_y > _rect.top - 10) {
                        canvas_div.scrollLeft -= 10;
                    }
                    // let xpos = (drag.getBoundingClientRect().left + window.scrollX) + (parseInt(window.getComputedStyle(drag).width) / 2) + canvas_div.scrollLeft - canvas_div.getBoundingClientRect().left;
                    // let ypos = (drag.getBoundingClientRect().top + window.scrollY) + canvas_div.scrollTop - canvas_div.getBoundingClientRect().top;
                    
                    const blocko = blocks.map(a => a.id);

                    for (let i = 0; i < blocks.length; i++) {

                        if (checkAttach(blocko[i])) {
                        
                            const _b = this.#blockByValue(blocko[i])

                            _b.appendChild(this._indicator);
                            this._indicator.style.left = (_b.offsetWidth / 2) - 5 + "px";
                            this._indicator.style.top = _b.offsetHeight + "px";
                            this._indicator.classList.remove("invisible");
                        
                            break;
                        
                        } else if (i == blocks.length - 1) {
                        
                            if (!this._indicator.classList.contains("invisible")) {
                                this._indicator.classList.add("invisible");
                            }
                        }
                    }
                }
            }

            const checkOffset = () => {
                const offsetleftArr = blocks.map(a => a.x);
                let widths = blocks.map(a => a.width);
                let mathmin = offsetleftArr.map((item, index) =>
                    item - (widths[index] / 2)
                )
                offsetleft = Math.min.apply(Math, mathmin);
                if (offsetleft < (canvas_div.getBoundingClientRect().left + window.scrollX - absx)) {
                    let blocko = blocks.map(a => a.id);
                    for (let w = 0; w < blocks.length; w++) {
                        this.#blockByValue(blocks.filter(a => a.id == blocko[w])[0].id).style.left = blocks.filter(a => a.id == blocko[w])[0].x - (blocks.filter(a => a.id == blocko[w])[0].width / 2) - offsetleft + canvas_div.getBoundingClientRect().left - absx + 20 + "px";
                        if (blocks.filter(a => a.id == blocko[w])[0].parent != -1) {
                            let arrowblock = blocks.filter(a => a.id == blocko[w])[0];
                            let arrowx = arrowblock.x - blocks.filter(a => a.id == blocks.filter(a => a.id == blocko[w])[0].parent)[0].x;
                            if (arrowx < 0) {
                                this.#arrowByValue(blocko[w]).style.left = (arrowblock.x - offsetleft + 20 - 5) + canvas_div.getBoundingClientRect().left - absx + "px";
                            } else {
                                this.#arrowByValue(blocko[w]).style.left = blocks.filter(id => id.id == blocks.filter(a => a.id == blocko[w])[0].parent)[0].x - 20 - offsetleft + canvas_div.getBoundingClientRect().left - absx + 20 + "px";
                            }
                        }
                    }
                    for (let w = 0; w < blocks.length; w++) {
                        blocks[w].x = (this.#blockByValue(blocks[w].id).getBoundingClientRect().left + window.scrollX) + (canvas_div.scrollLeft) + (parseInt(window.getComputedStyle(this.#blockByValue(blocks[w].id)).width) / 2) - 20 - canvas_div.getBoundingClientRect().left;
                    }
                }
            }

            const rearrangeMe = () => {

                let result = blocks.map(a => a.parent);
                for (let z = 0; z < result.length; z++) {
                    if (result[z] == -1) {
                        z++;
                    }
                    let totalwidth = 0;
                    let totalremove = 0;
                    for (let w = 0; w < blocks.filter(id => id.parent == result[z]).length; w++) {
                        let children = blocks.filter(id => id.parent == result[z])[w];
                        if (blocks.filter(id => id.parent == children.id).length == 0) {
                            children.childwidth = 0;
                        }
                        if (children.childwidth > children.width) {
                            if (w == blocks.filter(id => id.parent == result[z]).length - 1) {
                                totalwidth += children.childwidth;
                            } else {
                                totalwidth += children.childwidth + paddingx;
                            }
                        } else {
                            if (w == blocks.filter(id => id.parent == result[z]).length - 1) {
                                totalwidth += children.width;
                            } else {
                                totalwidth += children.width + paddingx;
                            }
                        }
                    }
                    if (result[z] != -1) {
                        blocks.filter(a => a.id == result[z])[0].childwidth = totalwidth;
                    }
                    for (let w = 0; w < blocks.filter(id => id.parent == result[z]).length; w++) {
                        let children = blocks.filter(id => id.parent == result[z])[w];
                        const r_block = this.#blockByValue(children.id)
                        const r_array = blocks.filter(id => id.id == result[z]);
                        // r_block.style.top = r_array.y + paddingy + canvas_div.getBoundingClientRect().top - absy + "px";
                        // r_array.y = r_array.y + paddingy;
                        if (children.childwidth > children.width) {
                            r_block.style.left = r_array[0].x - (totalwidth / 2) + totalremove + (children.childwidth / 2) - (children.width / 2) - (absx + window.scrollX) + canvas_div.getBoundingClientRect().left + "px";
                            children.x = r_array[0].x - (totalwidth / 2) + totalremove + (children.childwidth / 2);
                            totalremove += children.childwidth + paddingx;
                        } else {
                            r_block.style.left = r_array[0].x - (totalwidth / 2) + totalremove - (absx + window.scrollX) + canvas_div.getBoundingClientRect().left + "px";
                            children.x = r_array[0].x - (totalwidth / 2) + totalremove + (children.width / 2);
                            totalremove += children.width + paddingx;
                        }

                        let arrowblock = blocks.filter(a => a.id == children.id)[0];
                        let arrowx = arrowblock.x - blocks.filter(a => a.id == children.parent)[0].x + 20;
                        let arrowy = paddingy;
                        updateArrow(arrowblock, arrowx, arrowy, children);
                    }
                }
            }

            document.addEventListener("mousedown", this.beginDrag);
            document.addEventListener("mousedown", touchblock, false);
            document.addEventListener("touchstart", this.beginDrag);
            document.addEventListener("touchstart", touchblock, false);

            document.addEventListener("mouseup", touchblock, false);
            document.addEventListener("mousemove", this.moveBlock, false);
            document.addEventListener("touchmove", this.moveBlock, false);

            document.addEventListener("mouseup", this.endDrag, false);
            document.addEventListener("touchend", this.endDrag, false);
        }

        const blockGrabbed = (block: HTMLElement) => {
            const event = new CustomEvent<HTMLElement>('templateGrabbed', {
                detail: block
            })
            this.dispatchEvent(event)
        }

        const blockReleased = ( block: HTMLElement ) => {
            const event = new CustomEvent<HTMLElement>('templateReleased', {
                detail: block
            })
            this.dispatchEvent(event)
        }

        const blockSnap = (drag: HTMLElement, first: boolean, parent?: HTMLElement) => {
            const event = new CustomEvent<{target: HTMLElement, parent?: HTMLElement}>('snapping', {
                detail: { target:drag, parent: parent },
                cancelable: true
            })
            return this.dispatchEvent(event)
        }
        
        const beforeDelete = (drag: HTMLElement, parent: Block) => {
            const event = new CustomEvent<HTMLElement>('rearranged', {
                detail: drag,
                cancelable: true
            })
            return !this.dispatchEvent(event)
        }

        this.load();
    }
}
