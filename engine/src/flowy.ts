class FlowyObject {

load: () => void
import!: ( output:Output ) => void 
output!: () => Output | undefined
deleteBlocks!: () => void
beginDrag!: ( event: any ) => void
endDrag!: ( event: any ) => void
moveBlock!: ( event: any ) => void

_blockidValue!: () => { value: string, toInt: () => number }

#queryBlockidByValue( value: number | string  ) {
    return document.querySelector(`.blockid[value='${value}']`)?.parentNode as HTMLElement
}

#queryArrowidByValue( value: number | string  ) {
    return document.querySelector(`.arrowid[value='${value}']`)?.parentNode as HTMLElement
}


#QS<T extends Element>( selector: string ): T | null {
    const n = document.querySelector( selector ) as T
    if(!n) console.warn( `element not found for ${selector}`)
    return n
}

#QSP<T extends Element>( selector: string ): T | null {
    const n = this.#QS( selector )

    const parent = n?.parentNode as T

    if(!parent) console.warn( `parent not found for ${selector}`)
    return parent
}

get #indicator(): HTMLElement  {
    return document.querySelector(".indicator") as HTMLElement
}

constructor( canvas:HTMLCanvasElement, 
                        grab: GrabHandler, 
                        release: ReleaseHandler, 
                        snapping: SnappingHandler, 
                        rearrange: RearrangegHandler, 
                        spacing_x:number, 
                        spacing_y:number)
{
    if (!grab) {
        grab = () => {};
    }
    if (!release) {
        release = () => {};
    }
    if (!snapping) {
        snapping = () => true
    }
    if (!rearrange) {
        rearrange = () => false
    }
    if (!spacing_x) {
        spacing_x = 20;
    }
    if (!spacing_y) {
        spacing_y = 80;
    }
    // if (!Element.prototype.matches) {
    //     Element.prototype.matches = Element.prototype.msMatchesSelector ||
    //         Element.prototype.webkitMatchesSelector;
    // }

    // if (!Element.prototype.closest) {
    //     Element.prototype.closest = function(s) {
    //         let el = this;
    //         do {
    //             if (Element.prototype.matches.call(el, s)) return el;
    //             el = el.parentElement || el.parentNode;
    //         } while (el !== null && el.nodeType === 1);
    //         return null;
    //     };
    // }    
    
    let loaded = false;
    this.load = () => {
        if (!loaded)
            loaded = true;
        else
            return;
        let blocks = Array<Block>();
        let blockstemp = [];
        let canvas_div = canvas;
        let absx = 0;
        let absy = 0;
        if (window.getComputedStyle(canvas_div).position == "absolute" || window.getComputedStyle(canvas_div).position == "fixed") {
            absx = canvas_div.getBoundingClientRect().left;
            absy = canvas_div.getBoundingClientRect().top;
        }
        let active = false;
        let paddingx = spacing_x;
        let paddingy = spacing_y;
        let offsetleft = 0;
        let rearrange = false;
        let drag:HTMLElement
        let dragx:number
        let dragy:number 
        let original:HTMLElement;
        let mouse_x, mouse_y;
        let dragblock = false;
        let prevblock = 0;
        let el = document.createElement("DIV");
        el.classList.add('indicator');
        el.classList.add('invisible');
        canvas_div.appendChild(el);

        this._blockidValue = () => {
            const e = drag.querySelector(".blockid") as HTMLDataElement

            return {
                value: e.value,
                toInt: () => parseInt( `${e.value}`)
            }
        }

        this.import = output => {
            canvas_div.innerHTML = output.html;
            for (let a = 0; a < output.blockarr.length; a++) {
                blocks.push({
                    childwidth: parseFloat(output.blockarr[a].childwidth.toString()),
                    parent: parseFloat(output.blockarr[a].parent.toString()),
                    id: parseFloat(output.blockarr[a].id.toString()),
                    x: parseFloat(output.blockarr[a].x.toString()),
                    y: parseFloat(output.blockarr[a].y.toString()),
                    width: parseFloat(output.blockarr[a].width.toString()),
                    height: parseFloat(output.blockarr[a].height.toString())
                })
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
            let json_data:Output = {
                html: html_ser,
                blockarr: blocks,
                blocks: []
            };
            if (blocks.length > 0) {
                for (let i = 0; i < blocks.length; i++) {
                    json_data.blocks.push({
                        id: blocks[i].id,
                        parent: blocks[i].parent,
                        data: [],
                        attr: []
                    });
                    let blockParent = this.#QSP(".blockid[value='" + blocks[i].id + "']")
                    blockParent?.querySelectorAll("input").forEach( block => {
                        let json_name = block.getAttribute("name");
                        let json_value = block.value;
                        json_data.blocks[i].data.push({
                            name: json_name,
                            value: json_value
                        });
                    });
                    Array.prototype.slice.call(blockParent?.attributes).forEach( attribute => {
                        let jsonobj:Record<string,any> = {}
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

        this.beginDrag = event => {
            if (window.getComputedStyle(canvas_div).position == "absolute" || window.getComputedStyle(canvas_div).position == "fixed") {
                absx = canvas_div.getBoundingClientRect().left;
                absy = canvas_div.getBoundingClientRect().top;
            }
            if (event.targetTouches) {
                mouse_x = event.changedTouches[0].clientX;
                mouse_y = event.changedTouches[0].clientY;
            } else {
                mouse_x = event.clientX;
                mouse_y = event.clientY;
            }
            if (event.which != 3 && event.target.closest(".create-flowy")) {
                original = event.target.closest(".create-flowy");
                let newNode = event.target.closest(".create-flowy").cloneNode(true);
                event.target.closest(".create-flowy").classList.add("dragnow");
                newNode.classList.add("block");
                newNode.classList.remove("create-flowy");
                if (blocks.length === 0) {
                    newNode.innerHTML += "<input type='hidden' name='blockid' class='blockid' value='" + blocks.length + "'>";
                    document.body.appendChild(newNode);
                    drag = this.#QSP(".blockid[value='" + blocks.length + "']")!
                } else {
                    newNode.innerHTML += "<input type='hidden' name='blockid' class='blockid' value='" + (Math.max.apply(Math, blocks.map(a => a.id)) + 1) + "'>";
                    document.body.appendChild(newNode);
                    drag = this.#QSP(".blockid[value='" + (parseInt(Math.max.apply(Math, blocks.map(a => a.id))) + 1) + "']")!
                }
                blockGrabbed(event.target.closest(".create-flowy"));
                drag.classList.add("dragging");
                active = true;
                dragx = mouse_x - (event.target.closest(".create-flowy").getBoundingClientRect().left);
                dragy = mouse_y - (event.target.closest(".create-flowy").getBoundingClientRect().top);
                drag.style.left = mouse_x - dragx + "px";
                drag.style.top = mouse_y - dragy + "px";
            }
        }

        this.endDrag = event => {
            if (event.which != 3 && (active || rearrange)) {
                dragblock = false;
                blockReleased();
                if (!this.#indicator.classList.contains("invisible")) {
                    this.#indicator.classList.add("invisible");
                }
                if (active) {
                    original.classList.remove("dragnow");
                    drag.classList.remove("dragging");
                }
                if (this._blockidValue().toInt() === 0 && rearrange) {
                    firstBlock("rearrange")    
                } else if (active && blocks.length == 0 && (drag.getBoundingClientRect().top + window.scrollY) > (canvas_div.getBoundingClientRect().top + window.scrollY) && (drag.getBoundingClientRect().left + window.scrollX) > (canvas_div.getBoundingClientRect().left + window.scrollX)) {
                    firstBlock("drop");
                } else if (active && blocks.length == 0) {
                    removeSelection();
                } else if (active) {
                    let blocko = blocks.map(a => a.id);
                    for (let i = 0; i < blocks.length; i++) {
                        if (checkAttach(blocko[i])) {
                            active = false;
                            if (blockSnap(drag, false, this.#queryBlockidByValue(blocko[i]))) {
                                snap(drag, i, blocko);
                            } else {
                                active = false;
                                removeSelection();
                            }
                            break;
                        } else if (i == blocks.length - 1) {
                            active = false;
                            removeSelection();
                        }
                    }
                } else if (rearrange) {
                    let blocko = blocks.map(a => a.id);
                    for (let i = 0; i < blocks.length; i++) {
                        if (checkAttach(blocko[i])) {
                            active = false;
                            drag.classList.remove("dragging");
                            snap(drag, i, blocko);
                            break;
                        } else if (i == blocks.length - 1) {
                            if (beforeDelete(drag, blocks.filter(id => id.id == blocko[i])[0])) {
                                active = false;
                                drag.classList.remove("dragging");
                                snap(drag, blocko.indexOf(prevblock), blocko);
                                break;
                            } else {
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
        }
        
        function checkAttach(id) {
            const xpos = (drag.getBoundingClientRect().left + window.scrollX) + (parseInt(window.getComputedStyle(drag).width) / 2) + canvas_div.scrollLeft - canvas_div.getBoundingClientRect().left;
            const ypos = (drag.getBoundingClientRect().top + window.scrollY) + canvas_div.scrollTop - canvas_div.getBoundingClientRect().top;
            if (xpos >= blocks.filter(a => a.id == id)[0].x - (blocks.filter(a => a.id == id)[0].width / 2) - paddingx && xpos <= blocks.filter(a => a.id == id)[0].x + (blocks.filter(a => a.id == id)[0].width / 2) + paddingx && ypos >= blocks.filter(a => a.id == id)[0].y - (blocks.filter(a => a.id == id)[0].height / 2) && ypos <= blocks.filter(a => a.id == id)[0].y + blocks.filter(a => a.id == id)[0].height) {
                return true;   
            } else {
                return false;
            }
        }
        
        const removeSelection = () => {
            canvas_div.appendChild(this.#indicator);
            drag.parentNode?.removeChild(drag);
        }
        
        const  firstBlock = (type) => {
            if (type == "drop") {
                blockSnap(drag, true, undefined);
                active = false;
                drag.style.top = (drag.getBoundingClientRect().top + window.scrollY) - (absy + window.scrollY) + canvas_div.scrollTop + "px";
                drag.style.left = (drag.getBoundingClientRect().left + window.scrollX) - (absx + window.scrollX) + canvas_div.scrollLeft + "px";
                canvas_div.appendChild(drag);
                blocks.push({
                    parent: -1,
                    childwidth: 0,
                    id: this._blockidValue().toInt(),
                    x: (drag.getBoundingClientRect().left + window.scrollX) + (parseInt(window.getComputedStyle(drag).width) / 2) + canvas_div.scrollLeft - canvas_div.getBoundingClientRect().left,
                    y: (drag.getBoundingClientRect().top + window.scrollY) + (parseInt(window.getComputedStyle(drag).height) / 2) + canvas_div.scrollTop - canvas_div.getBoundingClientRect().top,
                    width: parseInt(window.getComputedStyle(drag).width),
                    height: parseInt(window.getComputedStyle(drag).height)
                });
            } else if (type == "rearrange") {
                drag.classList.remove("dragging");
                rearrange = false;
                for (let w = 0; w < blockstemp.length; w++) {
                    if (blockstemp[w].id != this._blockidValue().toInt()) {
                        const blockParent = this.#queryBlockidByValue(blockstemp[w].id)
                        const arrowParent = this.#queryArrowidByValue(blockstemp[w].id)
                        blockParent.style.left = (blockParent.getBoundingClientRect().left + window.scrollX) - (window.scrollX) + canvas_div.scrollLeft - 1 - absx + "px";
                        blockParent.style.top = (blockParent.getBoundingClientRect().top + window.scrollY) - (window.scrollY) + canvas_div.scrollTop - absy - 1 + "px";
                        arrowParent.style.left = (arrowParent.getBoundingClientRect().left + window.scrollX) - (window.scrollX) + canvas_div.scrollLeft - absx - 1 + "px";
                        arrowParent.style.top = (arrowParent.getBoundingClientRect().top + window.scrollY) + canvas_div.scrollTop - 1 - absy + "px";
                        canvas_div.appendChild(blockParent);
                        canvas_div.appendChild(arrowParent);
                        blockstemp[w].x = (blockParent.getBoundingClientRect().left + window.scrollX) + (parseInt(blockParent.offsetWidth) / 2) + canvas_div.scrollLeft - canvas_div.getBoundingClientRect().left - 1;
                        blockstemp[w].y = (blockParent.getBoundingClientRect().top + window.scrollY) + (parseInt(blockParent.offsetHeight) / 2) + canvas_div.scrollTop - canvas_div.getBoundingClientRect().top - 1;
                    }
                }
                blockstemp.filter(a => a.id == 0)[0].x = (drag.getBoundingClientRect().left + window.scrollX) + (parseInt(window.getComputedStyle(drag).width) / 2) + canvas_div.scrollLeft - canvas_div.getBoundingClientRect().left;
                blockstemp.filter(a => a.id == 0)[0].y = (drag.getBoundingClientRect().top + window.scrollY) + (parseInt(window.getComputedStyle(drag).height) / 2) + canvas_div.scrollTop - canvas_div.getBoundingClientRect().top;
                blocks = blocks.concat(blockstemp);
                blockstemp = [];
            }
        }
        
        const drawArrow = (arrow, x, y, id) => {
            if (x < 0) {
                canvas_div.innerHTML += '<div class="arrowblock"><input type="hidden" class="arrowid" value="' + this._blockidValue().value + '"><svg preserveaspectratio="none" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M' + (blocks.filter(a => a.id == id)[0].x - arrow.x + 5) + ' 0L' + (blocks.filter(a => a.id == id)[0].x - arrow.x + 5) + ' ' + (paddingy / 2) + 'L5 ' + (paddingy / 2) + 'L5 ' + y + '" stroke="#C5CCD0" stroke-width="2px"/><path d="M0 ' + (y - 5) + 'H10L5 ' + y + 'L0 ' + (y - 5) + 'Z" fill="#C5CCD0"/></svg></div>';
                this.#queryArrowidByValue(this._blockidValue().value).style.left = (arrow.x - 5) - (absx + window.scrollX) + canvas_div.scrollLeft + canvas_div.getBoundingClientRect().left + "px";
            } else {
                canvas_div.innerHTML += '<div class="arrowblock"><input type="hidden" class="arrowid" value="' + this._blockidValue().value + '"><svg preserveaspectratio="none" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 0L20 ' + (paddingy / 2) + 'L' + (x) + ' ' + (paddingy / 2) + 'L' + x + ' ' + y + '" stroke="#C5CCD0" stroke-width="2px"/><path d="M' + (x - 5) + ' ' + (y - 5) + 'H' + (x + 5) + 'L' + x + ' ' + y + 'L' + (x - 5) + ' ' + (y - 5) + 'Z" fill="#C5CCD0"/></svg></div>';
                this.#queryArrowidByValue(this._blockidValue().toInt()).style.left = blocks.filter(a => a.id == id)[0].x - 20 - (absx + window.scrollX) + canvas_div.scrollLeft + canvas_div.getBoundingClientRect().left + "px";
            }
            this.#queryArrowidByValue(this._blockidValue().toInt()).style.top = blocks.filter(a => a.id == id)[0].y + (blocks.filter(a => a.id == id)[0].height / 2) + canvas_div.getBoundingClientRect().top - absy + "px";
        }
        
        const updateArrow = (arrow, x, y, children) => { 
            if (x < 0) {
                this.#queryArrowidByValue(children.id).style.left = (arrow.x - 5) - (absx + window.scrollX) + canvas_div.getBoundingClientRect().left + "px";
                this.#queryArrowidByValue(children.id).innerHTML = '<input type="hidden" class="arrowid" value="' + children.id + '"><svg preserveaspectratio="none" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M' + (blocks.filter(id => id.id == children.parent)[0].x - arrow.x + 5) + ' 0L' + (blocks.filter(id => id.id == children.parent)[0].x - arrow.x + 5) + ' ' + (paddingy / 2) + 'L5 ' + (paddingy / 2) + 'L5 ' + y + '" stroke="#C5CCD0" stroke-width="2px"/><path d="M0 ' + (y - 5) + 'H10L5 ' + y + 'L0 ' + (y - 5) + 'Z" fill="#C5CCD0"/></svg>';
            } else {
                this.#queryArrowidByValue(children.id).style.left = blocks.filter(id => id.id == children.parent)[0].x - 20 - (absx + window.scrollX) + canvas_div.getBoundingClientRect().left + "px";
                this.#queryArrowidByValue(children.id).innerHTML = '<input type="hidden" class="arrowid" value="' + children.id + '"><svg preserveaspectratio="none" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 0L20 ' + (paddingy / 2) + 'L' + (x) + ' ' + (paddingy / 2) + 'L' + x + ' ' + y + '" stroke="#C5CCD0" stroke-width="2px"/><path d="M' + (x - 5) + ' ' + (y - 5) + 'H' + (x + 5) + 'L' + x + ' ' + y + 'L' + (x - 5) + ' ' + (y - 5) + 'Z" fill="#C5CCD0"/></svg>';
            }
        }

        const  snap = (drag, i, blocko) => {
            if (!rearrange) {
                canvas_div.appendChild(drag);
            }
            let totalwidth = 0;
            let totalremove = 0;
            let maxheight = 0;
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
                    this.#queryBlockidByValue(children.id).style.left = blocks.filter(a => a.id == blocko[i])[0].x - (totalwidth / 2) + totalremove + (children.childwidth / 2) - (children.width / 2) + "px";
                    children.x = blocks.filter(id => id.parent == blocko[i])[0].x - (totalwidth / 2) + totalremove + (children.childwidth / 2);
                    totalremove += children.childwidth + paddingx;
                } else {
                    this.#queryBlockidByValue(children.id).style.left = blocks.filter(a => a.id == blocko[i])[0].x - (totalwidth / 2) + totalremove + "px";
                    children.x = blocks.filter(id => id.parent == blocko[i])[0].x - (totalwidth / 2) + totalremove + (children.width / 2);
                    totalremove += children.width + paddingx;
                }
            }
            drag.style.left = blocks.filter(id => id.id == blocko[i])[0].x - (totalwidth / 2) + totalremove - (window.scrollX + absx) + canvas_div.scrollLeft + canvas_div.getBoundingClientRect().left + "px";
            drag.style.top = blocks.filter(id => id.id == blocko[i])[0].y + (blocks.filter(id => id.id == blocko[i])[0].height / 2) + paddingy - (window.scrollY + absy) + canvas_div.getBoundingClientRect().top + "px";
            if (rearrange) {
                blockstemp.filter(a => a.id == this._blockidValue().toInt())[0].x = (drag.getBoundingClientRect().left + window.scrollX) + (parseInt(window.getComputedStyle(drag).width) / 2) + canvas_div.scrollLeft - canvas_div.getBoundingClientRect().left;
                blockstemp.filter(a => a.id == this._blockidValue().toInt())[0].y = (drag.getBoundingClientRect().top + window.scrollY) + (parseInt(window.getComputedStyle(drag).height) / 2) + canvas_div.scrollTop - canvas_div.getBoundingClientRect().top;
                blockstemp.filter(a => a.id == this._blockidValue().value)[0].parent = blocko[i];
                for (let w = 0; w < blockstemp.length; w++) {
                    if (blockstemp[w].id != this._blockidValue().toInt()) {
                        const blockParent = this.#queryBlockidByValue(blockstemp[w].id)
                        const arrowParent = this.#queryArrowidByValue(blockstemp[w].id)
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
                blocks.push({
                    childwidth: 0,
                    parent: blocko[i],
                    id: this._blockidValue().toInt(),
                    x: (drag.getBoundingClientRect().left + window.scrollX) + (parseInt(window.getComputedStyle(drag).width) / 2) + canvas_div.scrollLeft - canvas_div.getBoundingClientRect().left,
                    y: (drag.getBoundingClientRect().top + window.scrollY) + (parseInt(window.getComputedStyle(drag).height) / 2) + canvas_div.scrollTop - canvas_div.getBoundingClientRect().top,
                    width: parseInt(window.getComputedStyle(drag).width),
                    height: parseInt(window.getComputedStyle(drag).height)
                });
            }
            
            let arrowblock = blocks.filter(a => a.id == this._blockidValue().toInt())[0];
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
            if (rearrange) {
                rearrange = false;
                drag.classList.remove("dragging");
            }
            rearrangeMe();
            checkOffset();
        }

        function touchblock(event) {
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

        function hasParentClass(element, classname) {
            if (element.className) {
                if (element.className.split(' ').indexOf(classname) >= 0) return true;
            }
            return element.parentNode && hasParentClass(element.parentNode, classname);
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
                let blockid = this._blockidValue().toInt();
                prevblock = blocks.filter(a => a.id == blockid)[0].parent;
                blockstemp.push(blocks.filter(a => a.id == blockid)[0]);
                blocks = blocks.filter(function(e) {
                    return e.id != blockid
                });
                if (blockid != 0) {
                    this.#queryArrowidByValue(blockid).remove();
                }
                let layer = blocks.filter(a => a.parent == blockid);
                let flag = false;
                let foundids = [];
                let allids = [];
                while (!flag) {
                    for (let i = 0; i < layer.length; i++) {
                        if (layer[i] != blockid) {
                            blockstemp.push(blocks.filter(a => a.id == layer[i].id)[0]);
                            const blockParent = this.#queryBlockidByValue(layer[i].id)
                            const arrowParent = this.#queryArrowidByValue(layer[i].id)
                            blockParent.style.left = (blockParent.getBoundingClientRect().left + window.scrollX) - (drag.getBoundingClientRect().left + window.scrollX) + "px";
                            blockParent.style.top = (blockParent.getBoundingClientRect().top + window.scrollY) - (drag.getBoundingClientRect().top + window.scrollY) + "px";
                            arrowParent.style.left = (arrowParent.getBoundingClientRect().left + window.scrollX) - (drag.getBoundingClientRect().left + window.scrollX) + "px";
                            arrowParent.style.top = (arrowParent.getBoundingClientRect().top + window.scrollY) - (drag.getBoundingClientRect().top + window.scrollY) + "px";
                            drag.appendChild(blockParent);
                            drag.appendChild(arrowParent);
                            foundids.push(layer[i].id);
                            allids.push(layer[i].id);
                        }
                    }
                    if (foundids.length == 0) {
                        flag = true;
                    } else {
                        layer = blocks.filter(a => foundids.includes(a.parent));
                        foundids = [];
                    }
                }
                for (let i = 0; i < blocks.filter(a => a.parent == blockid).length; i++) {
                    let blocknumber = blocks.filter(a => a.parent == blockid)[i];
                    blocks = blocks.filter(function(e) {
                        return e.id != blocknumber
                    });
                }
                for (let i = 0; i < allids.length; i++) {
                    let blocknumber = allids[i];
                    blocks = blocks.filter(function(e) {
                        return e.id != blocknumber
                    });
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
                blockstemp.filter(a => a.id == this._blockidValue().toInt()).x = (drag.getBoundingClientRect().left + window.scrollX) + (parseInt(window.getComputedStyle(drag).width) / 2) + canvas_div.scrollLeft;
                blockstemp.filter(a => a.id == this._blockidValue().toInt()).y = (drag.getBoundingClientRect().top + window.scrollY) + (parseInt(window.getComputedStyle(drag).height) / 2) + canvas_div.scrollTop;
            }
            if (active || rearrange) {
                if (mouse_x > canvas_div.getBoundingClientRect().width + canvas_div.getBoundingClientRect().left - 10 && mouse_x < canvas_div.getBoundingClientRect().width + canvas_div.getBoundingClientRect().left + 10) {
                    canvas_div.scrollLeft += 10;
                } else if (mouse_x < canvas_div.getBoundingClientRect().left + 10 && mouse_x > canvas_div.getBoundingClientRect().left - 10) {
                    canvas_div.scrollLeft -= 10;
                } else if (mouse_y > canvas_div.getBoundingClientRect().height + canvas_div.getBoundingClientRect().top - 10 && mouse_y < canvas_div.getBoundingClientRect().height + canvas_div.getBoundingClientRect().top + 10) {
                    canvas_div.scrollTop += 10;
                } else if (mouse_y < canvas_div.getBoundingClientRect().top + 10 && mouse_y > canvas_div.getBoundingClientRect().top - 10) {
                    canvas_div.scrollLeft -= 10;
                }
                let xpos = (drag.getBoundingClientRect().left + window.scrollX) + (parseInt(window.getComputedStyle(drag).width) / 2) + canvas_div.scrollLeft - canvas_div.getBoundingClientRect().left;
                let ypos = (drag.getBoundingClientRect().top + window.scrollY) + canvas_div.scrollTop - canvas_div.getBoundingClientRect().top;
                let blocko = blocks.map(a => a.id);
                for (let i = 0; i < blocks.length; i++) {
                    if (checkAttach(blocko[i])) {
                        this.#queryBlockidByValue(blocko[i]).appendChild(this.#indicator);
                        this.#indicator.style.left = (this.#queryBlockidByValue(blocko[i]).offsetWidth / 2) - 5 + "px";
                        this.#indicator.style.top = this.#queryBlockidByValue(blocko[i]).offsetHeight + "px";
                        this.#indicator.classList.remove("invisible");
                        break;
                    } else if (i == blocks.length - 1) {
                        if (!this.#indicator.classList.contains("invisible")) {
                            this.#indicator.classList.add("invisible");
                        }
                    }
                }
            }
        }

        const checkOffset = () => {
            offsetleft = blocks.map(a => a.x);
            let widths = blocks.map(a => a.width);
            let mathmin = offsetleft.map(function(item, index) {
                return item - (widths[index] / 2);
            })
            offsetleft = Math.min.apply(Math, mathmin);
            if (offsetleft < (canvas_div.getBoundingClientRect().left + window.scrollX - absx)) {
                let blocko = blocks.map(a => a.id);
                for (let w = 0; w < blocks.length; w++) {
                    this.#queryBlockidByValue(blocks.filter(a => a.id == blocko[w])[0].id).style.left = blocks.filter(a => a.id == blocko[w])[0].x - (blocks.filter(a => a.id == blocko[w])[0].width / 2) - offsetleft + canvas_div.getBoundingClientRect().left - absx + 20 + "px";
                    if (blocks.filter(a => a.id == blocko[w])[0].parent != -1) {
                        let arrowblock = blocks.filter(a => a.id == blocko[w])[0];
                        let arrowx = arrowblock.x - blocks.filter(a => a.id == blocks.filter(a => a.id == blocko[w])[0].parent)[0].x;
                        if (arrowx < 0) {
                            this.#queryArrowidByValue(blocko[w]).style.left = (arrowblock.x - offsetleft + 20 - 5) + canvas_div.getBoundingClientRect().left - absx + "px";
                        } else {
                            this.#queryArrowidByValue(blocko[w]).style.left = blocks.filter(id => id.id == blocks.filter(a => a.id == blocko[w])[0].parent)[0].x - 20 - offsetleft + canvas_div.getBoundingClientRect().left - absx + 20 + "px";
                        }
                    }
                }
                for (let w = 0; w < blocks.length; w++) {
                    blocks[w].x = (this.#queryBlockidByValue(blocks[w].id).getBoundingClientRect().left + window.scrollX) + (canvas_div.scrollLeft) + (parseInt(window.getComputedStyle(this.#queryBlockidByValue(blocks[w].id)).width) / 2) - 20 - canvas_div.getBoundingClientRect().left;
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
                let maxheight = 0;
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
                    const r_block = this.#queryBlockidByValue(children.id)
                    const r_array = blocks.filter(id => id.id == result[z]);
                    r_block.style.top = r_array.y + paddingy + canvas_div.getBoundingClientRect().top - absy + "px";
                    r_array.y = r_array.y + paddingy;
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

    function blockGrabbed(block) {
        grab(block);
    }

    function blockReleased() {
        release();
    }

    function blockSnap(drag, first, parent) {
        return snapping(drag, first, parent);
    }

    function beforeDelete(drag, parent) {
        return rearrange(drag, parent);
    }

    function addEventListenerMulti(type, listener, capture, selector) {
        let nodes = document.querySelectorAll(selector);
        for (let i = 0; i < nodes.length; i++) {
            nodes[i].addEventListener(type, listener, capture);
        }
    }

    function removeEventListenerMulti(type, listener, capture, selector) {
        let nodes = document.querySelectorAll(selector);
        for (let i = 0; i < nodes.length; i++) {
            nodes[i].removeEventListener(type, listener, capture);
        }
    }
    
    this.load();
}
}


var flowy = function(
    canvas:HTMLCanvasElement, 
    grab: GrabHandler, 
    release: ReleaseHandler, 
    snapping: SnappingHandler, 
    rearrange: RearrangegHandler, 
    spacing_x:number, 
    spacing_y:number) {
    return new FlowyObject( canvas, grab, release, snapping, rearrange, spacing_x, spacing_y )
}