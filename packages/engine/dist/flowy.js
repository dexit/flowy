import "./flowy.css";
import {html as $fe6qx$html, render as $fe6qx$render, LitElement as $fe6qx$LitElement} from "lit";
import {query as $fe6qx$query} from "lit/decorators/query.js";
import {property as $fe6qx$property, customElement as $fe6qx$customElement} from "lit/decorators.js";

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}
var $7712d7abb20ba789$exports = {};

$parcel$export($7712d7abb20ba789$exports, "createOrUpdateArrow", function () { return $7712d7abb20ba789$export$132f54fcf658b73a; }, function (v) { return $7712d7abb20ba789$export$132f54fcf658b73a = v; });
$parcel$export($7712d7abb20ba789$exports, "FlowyDiagram", function () { return $7712d7abb20ba789$export$ed9fc9039e390ef3; }, function (v) { return $7712d7abb20ba789$export$ed9fc9039e390ef3 = v; });




var $7712d7abb20ba789$var$__decorate = undefined && undefined.__decorate || function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var $7712d7abb20ba789$var$__classPrivateFieldSet = undefined && undefined.__classPrivateFieldSet || function(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
};
var $7712d7abb20ba789$var$__classPrivateFieldGet = undefined && undefined.__classPrivateFieldGet || function(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var $7712d7abb20ba789$var$_FlowyDiagram_instances, $7712d7abb20ba789$var$_FlowyDiagram_snapping, $7712d7abb20ba789$var$_FlowyDiagram_rearrange, $7712d7abb20ba789$var$_FlowyDiagram_dragBlockValue, $7712d7abb20ba789$var$_FlowyDiagram_blockByValue, $7712d7abb20ba789$var$_FlowyDiagram_arrowByValue;
function $7712d7abb20ba789$var$toInt(value) {
    if (typeof value === "number") return parseInt(`${value}`);
    else return parseInt(value);
}
const $7712d7abb20ba789$export$132f54fcf658b73a = (id, x, y, paddingy = 80, start_x = 20)=>{
    let arrow;
    if (typeof id === "string") {
        arrow = document.createElement("div");
        arrow.setAttribute("id", `arrow${id}`);
        arrow.classList.add("arrowblock");
    } else arrow = id;
    const content = (0, $fe6qx$html)`
        <svg preserveaspectratio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M${start_x} 0 L${start_x} ${paddingy / 2} L${x} ${paddingy / 2} L${x} ${y}" 
                stroke="#C5CCD0" 
                stroke-width="2px"/>
            <path d="M${x - 5} ${y - 5} H${x + 5} L${x} ${y} L${x - 5} ${y - 5} Z" 
                fill="#C5CCD0"/>
        </svg>
        `;
    (0, $fe6qx$render)(content, arrow);
    return arrow;
};
function $7712d7abb20ba789$var$hasParentClass(element, classname) {
    if (element.className) {
        if (element.className.split(" ").indexOf(classname) >= 0) return true;
    }
    return element.parentNode !== null && $7712d7abb20ba789$var$hasParentClass(element.parentNode, classname);
}
let $7712d7abb20ba789$export$ed9fc9039e390ef3 = class FlowyDiagram extends (0, $fe6qx$LitElement) {
    constructor(){
        // css seems doesn't work without shadow dom
        // static styles = css`
        // p {
        //   color: green;
        // }
        // `
        super(...arguments);
        $7712d7abb20ba789$var$_FlowyDiagram_instances.add(this);
        this.spacing_x = 20;
        this.spacing_y = 80;
        $7712d7abb20ba789$var$_FlowyDiagram_snapping.set(this, ()=>true);
        $7712d7abb20ba789$var$_FlowyDiagram_rearrange.set(this, ()=>false);
        $7712d7abb20ba789$var$_FlowyDiagram_dragBlockValue.set(this, void 0);
    }
    registerSnapping(handler) {
        $7712d7abb20ba789$var$__classPrivateFieldSet(this, $7712d7abb20ba789$var$_FlowyDiagram_snapping, handler, "f");
    }
    registerRearrange(handler) {
        $7712d7abb20ba789$var$__classPrivateFieldSet(this, $7712d7abb20ba789$var$_FlowyDiagram_rearrange, handler, "f");
    }
    render() {
        return (0, $fe6qx$html)`<div id="canvas">`;
    }
    /**
     * disable shadow root
     *
     * @returns
     * @see [How to create LitElement without Shadow DOM?](https://stackoverflow.com/a/55213037/521197)
     */ createRenderRoot() {
        return this;
    }
    connectedCallback() {
        super.connectedCallback();
    }
    firstUpdated() {
        let loaded = false;
        this.load = ()=>{
            if (!loaded) loaded = true;
            else return;
            let blocks = Array();
            let blockstemp = Array();
            let canvas_div = this._canvas;
            let absx = 0;
            let absy = 0;
            if (window.getComputedStyle(canvas_div).position == "absolute" || window.getComputedStyle(canvas_div).position == "fixed") {
                absx = canvas_div.getBoundingClientRect().left;
                absy = canvas_div.getBoundingClientRect().top;
            }
            let active = false;
            let paddingx = this.spacing_x;
            let paddingy = this.spacing_y;
            let offsetleft = 0;
            let rearrange = false;
            let drag;
            let dragx;
            let dragy;
            let original;
            let mouse_x, mouse_y;
            let dragblock = false;
            let prevblock = 0;
            let el = document.createElement("DIV");
            el.classList.add("indicator");
            el.classList.add("invisible");
            canvas_div.appendChild(el);
            $7712d7abb20ba789$var$__classPrivateFieldSet(this, $7712d7abb20ba789$var$_FlowyDiagram_dragBlockValue, ()=>{
                const value = /block(\d+)/.exec(drag.id)[1];
                return {
                    value: value,
                    toInt: ()=>parseInt(value)
                };
            }, "f");
            this.import = (output)=>{
                canvas_div.innerHTML = output.html;
                for(let a = 0; a < output.blockarr.length; a++)blocks.push({
                    childwidth: parseFloat(output.blockarr[a].childwidth.toString()),
                    parent: parseFloat(output.blockarr[a].parent.toString()),
                    id: parseFloat(output.blockarr[a].id.toString()),
                    x: parseFloat(output.blockarr[a].x.toString()),
                    y: parseFloat(output.blockarr[a].y.toString()),
                    width: parseFloat(output.blockarr[a].width.toString()),
                    height: parseFloat(output.blockarr[a].height.toString())
                });
                if (blocks.length > 1) {
                    rearrangeMe();
                    checkOffset();
                }
            };
            /**
             * output
             */ this.output = ()=>{
                let html_ser = canvas_div.innerHTML;
                let json_data = {
                    html: html_ser,
                    blockarr: blocks,
                    blocks: Array()
                };
                if (blocks.length > 0) {
                    for(let i = 0; i < blocks.length; i++){
                        json_data.blocks.push({
                            id: blocks[i].id,
                            parent: blocks[i].parent,
                            data: [],
                            attr: []
                        });
                        let blockParent = $7712d7abb20ba789$var$__classPrivateFieldGet(this, $7712d7abb20ba789$var$_FlowyDiagram_instances, "m", $7712d7abb20ba789$var$_FlowyDiagram_blockByValue).call(this, blocks[i].id);
                        blockParent === null || blockParent === void 0 || blockParent.querySelectorAll("input").forEach((block)=>{
                            let json_name = block.getAttribute("name");
                            let json_value = block.value;
                            json_data.blocks[i].data.push({
                                name: json_name,
                                value: json_value
                            });
                        });
                        Array.prototype.slice.call(blockParent === null || blockParent === void 0 ? void 0 : blockParent.attributes).forEach((attribute)=>{
                            let jsonobj = {};
                            jsonobj[attribute.name] = attribute.value;
                            json_data.blocks[i].attr.push(jsonobj);
                        });
                    }
                    return json_data;
                }
            };
            /**
             * deleteBlocks
             */ this.deleteBlocks = ()=>{
                blocks = [];
                canvas_div.innerHTML = "<div class='indicator invisible'></div>";
            };
            this.beginDrag = (event)=>{
                const target = event.target;
                const { position: position  } = window.getComputedStyle(canvas_div);
                if (position == "absolute" || position == "fixed") {
                    const { left: left , top: top  } = canvas_div.getBoundingClientRect();
                    absx = left;
                    absy = top;
                }
                if (event.targetTouches) {
                    const { clientX: clientX , clientY: clientY  } = event.changedTouches[0];
                    mouse_x = clientX;
                    mouse_y = clientY;
                } else {
                    const { clientX: clientX , clientY: clientY  } = event;
                    mouse_x = clientX;
                    mouse_y = clientY;
                }
                const item = target.closest(".create-flowy");
                if (event.which != 3 && item) {
                    original = item;
                    let newNode = item.cloneNode(true);
                    item.classList.add("dragnow");
                    newNode.classList.add("block");
                    newNode.classList.remove("create-flowy");
                    if (blocks.length === 0) {
                        newNode.setAttribute("id", `block${blocks.length}`);
                        document.body.appendChild(newNode);
                    } else {
                        const max = blocks.reduce((result, a)=>Math.max(result, a.id), 0);
                        newNode.setAttribute("id", `block${max + 1}`);
                        document.body.appendChild(newNode);
                    }
                    drag = newNode;
                    blockGrabbed(item);
                    drag.classList.add("dragging");
                    active = true;
                    const { left: left , top: top  } = item.getBoundingClientRect();
                    dragx = mouse_x - left;
                    dragy = mouse_y - top;
                    drag.style.left = mouse_x - dragx + "px";
                    drag.style.top = mouse_y - dragy + "px";
                }
            };
            this.endDrag = (event)=>{
                if (event.which != 3 && (active || rearrange)) {
                    dragblock = false;
                    blockReleased();
                    if (!this._indicator.classList.contains("invisible")) this._indicator.classList.add("invisible");
                    if (active) {
                        original.classList.remove("dragnow");
                        drag.classList.remove("dragging");
                    }
                    if ($7712d7abb20ba789$var$__classPrivateFieldGet(this, $7712d7abb20ba789$var$_FlowyDiagram_dragBlockValue, "f").call(this).toInt() === 0 && rearrange) firstBlock("rearrange");
                    else if (active && blocks.length == 0 && drag.getBoundingClientRect().top + window.scrollY > canvas_div.getBoundingClientRect().top + window.scrollY && drag.getBoundingClientRect().left + window.scrollX > canvas_div.getBoundingClientRect().left + window.scrollX) firstBlock("drop");
                    else if (active && blocks.length == 0) removeSelection();
                    else if (active) {
                        let blocko = blocks.map((a)=>a.id);
                        for(let i = 0; i < blocks.length; i++){
                            if (checkAttach(blocko[i])) {
                                active = false;
                                if (blockSnap(drag, false, $7712d7abb20ba789$var$__classPrivateFieldGet(this, $7712d7abb20ba789$var$_FlowyDiagram_instances, "m", $7712d7abb20ba789$var$_FlowyDiagram_blockByValue).call(this, blocko[i]))) snap(drag, i, blocko);
                                else {
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
                        let blocko = blocks.map((a)=>a.id);
                        for(let i = 0; i < blocks.length; i++){
                            if (checkAttach(blocko[i])) {
                                active = false;
                                drag.classList.remove("dragging");
                                snap(drag, i, blocko);
                                break;
                            } else if (i == blocks.length - 1) {
                                if (beforeDelete(drag, blocks.filter((id)=>id.id == blocko[i])[0])) {
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
            };
            function checkAttach(id) {
                const b = blocks.find((a)=>a.id == id);
                console.assert(b !== undefined, `blocks[${id}] not found!`);
                const xpos = drag.getBoundingClientRect().left + window.scrollX + parseInt(window.getComputedStyle(drag).width) / 2 + canvas_div.scrollLeft - canvas_div.getBoundingClientRect().left;
                const ypos = drag.getBoundingClientRect().top + window.scrollY + canvas_div.scrollTop - canvas_div.getBoundingClientRect().top;
                if (xpos >= b.x - b.width / 2 - paddingx && xpos <= b.x + b.width / 2 + paddingx && ypos >= b.y - b.height / 2 && ypos <= b.y + b.height) return true;
                return false;
            }
            const removeSelection = ()=>{
                var _a;
                canvas_div.appendChild(this._indicator);
                (_a = drag.parentNode) === null || _a === void 0 || _a.removeChild(drag);
            };
            const firstBlock = (type)=>{
                if (type == "drop") {
                    blockSnap(drag, true, undefined);
                    active = false;
                    drag.style.top = drag.getBoundingClientRect().top + window.scrollY - (absy + window.scrollY) + canvas_div.scrollTop + "px";
                    drag.style.left = drag.getBoundingClientRect().left + window.scrollX - (absx + window.scrollX) + canvas_div.scrollLeft + "px";
                    canvas_div.appendChild(drag);
                    blocks.push({
                        parent: -1,
                        childwidth: 0,
                        id: $7712d7abb20ba789$var$__classPrivateFieldGet(this, $7712d7abb20ba789$var$_FlowyDiagram_dragBlockValue, "f").call(this).toInt(),
                        x: drag.getBoundingClientRect().left + window.scrollX + parseInt(window.getComputedStyle(drag).width) / 2 + canvas_div.scrollLeft - canvas_div.getBoundingClientRect().left,
                        y: drag.getBoundingClientRect().top + window.scrollY + parseInt(window.getComputedStyle(drag).height) / 2 + canvas_div.scrollTop - canvas_div.getBoundingClientRect().top,
                        width: parseInt(window.getComputedStyle(drag).width),
                        height: parseInt(window.getComputedStyle(drag).height)
                    });
                } else if (type == "rearrange") {
                    drag.classList.remove("dragging");
                    rearrange = false;
                    for(let w = 0; w < blockstemp.length; w++)if (blockstemp[w].id != $7712d7abb20ba789$var$__classPrivateFieldGet(this, $7712d7abb20ba789$var$_FlowyDiagram_dragBlockValue, "f").call(this).toInt()) {
                        const blockParent = $7712d7abb20ba789$var$__classPrivateFieldGet(this, $7712d7abb20ba789$var$_FlowyDiagram_instances, "m", $7712d7abb20ba789$var$_FlowyDiagram_blockByValue).call(this, blockstemp[w].id);
                        const arrowParent = $7712d7abb20ba789$var$__classPrivateFieldGet(this, $7712d7abb20ba789$var$_FlowyDiagram_instances, "m", $7712d7abb20ba789$var$_FlowyDiagram_arrowByValue).call(this, blockstemp[w].id);
                        blockParent.style.left = blockParent.getBoundingClientRect().left + window.scrollX - window.scrollX + canvas_div.scrollLeft - 1 - absx + "px";
                        blockParent.style.top = blockParent.getBoundingClientRect().top + window.scrollY - window.scrollY + canvas_div.scrollTop - absy - 1 + "px";
                        arrowParent.style.left = arrowParent.getBoundingClientRect().left + window.scrollX - window.scrollX + canvas_div.scrollLeft - absx - 1 + "px";
                        arrowParent.style.top = arrowParent.getBoundingClientRect().top + window.scrollY + canvas_div.scrollTop - 1 - absy + "px";
                        canvas_div.appendChild(blockParent);
                        canvas_div.appendChild(arrowParent);
                        blockstemp[w].x = blockParent.getBoundingClientRect().left + window.scrollX + $7712d7abb20ba789$var$toInt(blockParent.offsetWidth) / 2 + canvas_div.scrollLeft - canvas_div.getBoundingClientRect().left - 1;
                        blockstemp[w].y = blockParent.getBoundingClientRect().top + window.scrollY + $7712d7abb20ba789$var$toInt(blockParent.offsetHeight) / 2 + canvas_div.scrollTop - canvas_div.getBoundingClientRect().top - 1;
                    }
                    blockstemp.filter((a)=>a.id == 0)[0].x = drag.getBoundingClientRect().left + window.scrollX + parseInt(window.getComputedStyle(drag).width) / 2 + canvas_div.scrollLeft - canvas_div.getBoundingClientRect().left;
                    blockstemp.filter((a)=>a.id == 0)[0].y = drag.getBoundingClientRect().top + window.scrollY + parseInt(window.getComputedStyle(drag).height) / 2 + canvas_div.scrollTop - canvas_div.getBoundingClientRect().top;
                    blocks = blocks.concat(blockstemp);
                    blockstemp = [];
                }
            };
            const drawArrow = (arrow, x, y, id)=>{
                const _blk = blocks.find((a)=>a.id == id);
                const _bid_val = $7712d7abb20ba789$var$__classPrivateFieldGet(this, $7712d7abb20ba789$var$_FlowyDiagram_dragBlockValue, "f").call(this).value;
                const adjustment = absx + window.scrollX - canvas_div.scrollLeft - canvas_div.getBoundingClientRect().left;
                let el;
                if (x < 0) {
                    el = $7712d7abb20ba789$export$132f54fcf658b73a(_bid_val, 5, y, paddingy, _blk.x - arrow.x + 5);
                    canvas_div.appendChild(el);
                    el.style.left = `${arrow.x - 5 - adjustment}px`;
                } else {
                    el = $7712d7abb20ba789$export$132f54fcf658b73a(_bid_val, x, y, paddingy);
                    canvas_div.appendChild(el);
                    el.style.left = `${_blk.x - 20 - adjustment}px`;
                }
                el.style.top = `${_blk.y + _blk.height / 2 + canvas_div.getBoundingClientRect().top - absy}px`;
            };
            const updateArrow = (arrow, x, y, children)=>{
                const _blk = blocks.find((a)=>a.id == children.parent);
                const el = $7712d7abb20ba789$var$__classPrivateFieldGet(this, $7712d7abb20ba789$var$_FlowyDiagram_instances, "m", $7712d7abb20ba789$var$_FlowyDiagram_arrowByValue).call(this, children.id);
                const adjustment = absx + window.scrollX - canvas_div.getBoundingClientRect().left;
                if (x < 0) {
                    $7712d7abb20ba789$export$132f54fcf658b73a(el, 5, y, paddingy, _blk.x - arrow.x + 5);
                    el.style.left = `${arrow.x - 5 - adjustment}px`;
                } else {
                    $7712d7abb20ba789$export$132f54fcf658b73a(el, x, y, paddingy);
                    el.style.left = `${_blk.x - 20 - adjustment}px`;
                }
            };
            const snap = (drag, i, blocko)=>{
                if (!rearrange) canvas_div.appendChild(drag);
                let totalwidth = 0;
                let totalremove = 0;
                let maxheight = 0;
                for(let w = 0; w < blocks.filter((id)=>id.parent == blocko[i]).length; w++){
                    let children = blocks.filter((id)=>id.parent == blocko[i])[w];
                    if (children.childwidth > children.width) totalwidth += children.childwidth + paddingx;
                    else totalwidth += children.width + paddingx;
                }
                totalwidth += parseInt(window.getComputedStyle(drag).width);
                for(let w = 0; w < blocks.filter((id)=>id.parent == blocko[i]).length; w++){
                    let children = blocks.filter((id)=>id.parent == blocko[i])[w];
                    if (children.childwidth > children.width) {
                        $7712d7abb20ba789$var$__classPrivateFieldGet(this, $7712d7abb20ba789$var$_FlowyDiagram_instances, "m", $7712d7abb20ba789$var$_FlowyDiagram_blockByValue).call(this, children.id).style.left = blocks.filter((a)=>a.id == blocko[i])[0].x - totalwidth / 2 + totalremove + children.childwidth / 2 - children.width / 2 + "px";
                        children.x = blocks.filter((id)=>id.parent == blocko[i])[0].x - totalwidth / 2 + totalremove + children.childwidth / 2;
                        totalremove += children.childwidth + paddingx;
                    } else {
                        $7712d7abb20ba789$var$__classPrivateFieldGet(this, $7712d7abb20ba789$var$_FlowyDiagram_instances, "m", $7712d7abb20ba789$var$_FlowyDiagram_blockByValue).call(this, children.id).style.left = blocks.filter((a)=>a.id == blocko[i])[0].x - totalwidth / 2 + totalremove + "px";
                        children.x = blocks.filter((id)=>id.parent == blocko[i])[0].x - totalwidth / 2 + totalremove + children.width / 2;
                        totalremove += children.width + paddingx;
                    }
                }
                drag.style.left = blocks.filter((id)=>id.id == blocko[i])[0].x - totalwidth / 2 + totalremove - (window.scrollX + absx) + canvas_div.scrollLeft + canvas_div.getBoundingClientRect().left + "px";
                drag.style.top = blocks.filter((id)=>id.id == blocko[i])[0].y + blocks.filter((id)=>id.id == blocko[i])[0].height / 2 + paddingy - (window.scrollY + absy) + canvas_div.getBoundingClientRect().top + "px";
                if (rearrange) {
                    blockstemp.filter((a)=>a.id == $7712d7abb20ba789$var$__classPrivateFieldGet(this, $7712d7abb20ba789$var$_FlowyDiagram_dragBlockValue, "f").call(this).toInt())[0].x = drag.getBoundingClientRect().left + window.scrollX + parseInt(window.getComputedStyle(drag).width) / 2 + canvas_div.scrollLeft - canvas_div.getBoundingClientRect().left;
                    blockstemp.filter((a)=>a.id == $7712d7abb20ba789$var$__classPrivateFieldGet(this, $7712d7abb20ba789$var$_FlowyDiagram_dragBlockValue, "f").call(this).toInt())[0].y = drag.getBoundingClientRect().top + window.scrollY + parseInt(window.getComputedStyle(drag).height) / 2 + canvas_div.scrollTop - canvas_div.getBoundingClientRect().top;
                    blockstemp.filter((a)=>a.id == $7712d7abb20ba789$var$__classPrivateFieldGet(this, $7712d7abb20ba789$var$_FlowyDiagram_dragBlockValue, "f").call(this).toInt())[0].parent = blocko[i];
                    for(let w = 0; w < blockstemp.length; w++)if (blockstemp[w].id != $7712d7abb20ba789$var$__classPrivateFieldGet(this, $7712d7abb20ba789$var$_FlowyDiagram_dragBlockValue, "f").call(this).toInt()) {
                        const blockParent = $7712d7abb20ba789$var$__classPrivateFieldGet(this, $7712d7abb20ba789$var$_FlowyDiagram_instances, "m", $7712d7abb20ba789$var$_FlowyDiagram_blockByValue).call(this, blockstemp[w].id);
                        const arrowParent = $7712d7abb20ba789$var$__classPrivateFieldGet(this, $7712d7abb20ba789$var$_FlowyDiagram_instances, "m", $7712d7abb20ba789$var$_FlowyDiagram_arrowByValue).call(this, blockstemp[w].id);
                        blockParent.style.left = blockParent.getBoundingClientRect().left + window.scrollX - (window.scrollX + canvas_div.getBoundingClientRect().left) + canvas_div.scrollLeft + "px";
                        blockParent.style.top = blockParent.getBoundingClientRect().top + window.scrollY - (window.scrollY + canvas_div.getBoundingClientRect().top) + canvas_div.scrollTop + "px";
                        arrowParent.style.left = arrowParent.getBoundingClientRect().left + window.scrollX - (window.scrollX + canvas_div.getBoundingClientRect().left) + canvas_div.scrollLeft + 20 + "px";
                        arrowParent.style.top = arrowParent.getBoundingClientRect().top + window.scrollY - (window.scrollY + canvas_div.getBoundingClientRect().top) + canvas_div.scrollTop + "px";
                        canvas_div.appendChild(blockParent);
                        canvas_div.appendChild(arrowParent);
                        blockstemp[w].x = blockParent.getBoundingClientRect().left + window.scrollX + parseInt(window.getComputedStyle(blockParent).width) / 2 + canvas_div.scrollLeft - canvas_div.getBoundingClientRect().left;
                        blockstemp[w].y = blockParent.getBoundingClientRect().top + window.scrollY + parseInt(window.getComputedStyle(blockParent).height) / 2 + canvas_div.scrollTop - canvas_div.getBoundingClientRect().top;
                    }
                    blocks = blocks.concat(blockstemp);
                    blockstemp = [];
                } else blocks.push({
                    childwidth: 0,
                    parent: blocko[i],
                    id: $7712d7abb20ba789$var$__classPrivateFieldGet(this, $7712d7abb20ba789$var$_FlowyDiagram_dragBlockValue, "f").call(this).toInt(),
                    x: drag.getBoundingClientRect().left + window.scrollX + parseInt(window.getComputedStyle(drag).width) / 2 + canvas_div.scrollLeft - canvas_div.getBoundingClientRect().left,
                    y: drag.getBoundingClientRect().top + window.scrollY + parseInt(window.getComputedStyle(drag).height) / 2 + canvas_div.scrollTop - canvas_div.getBoundingClientRect().top,
                    width: parseInt(window.getComputedStyle(drag).width),
                    height: parseInt(window.getComputedStyle(drag).height)
                });
                let arrowblock = blocks.filter((a)=>a.id == $7712d7abb20ba789$var$__classPrivateFieldGet(this, $7712d7abb20ba789$var$_FlowyDiagram_dragBlockValue, "f").call(this).toInt())[0];
                let arrowx = arrowblock.x - blocks.filter((a)=>a.id == blocko[i])[0].x + 20;
                let arrowy = paddingy;
                drawArrow(arrowblock, arrowx, arrowy, blocko[i]);
                if (blocks.filter((a)=>a.id == blocko[i])[0].parent != -1) {
                    let flag = false;
                    let idval = blocko[i];
                    while(!flag)if (blocks.filter((a)=>a.id == idval)[0].parent == -1) flag = true;
                    else {
                        let zwidth = 0;
                        for(let w = 0; w < blocks.filter((id)=>id.parent == idval).length; w++){
                            let children = blocks.filter((id)=>id.parent == idval)[w];
                            if (children.childwidth > children.width) {
                                if (w == blocks.filter((id)=>id.parent == idval).length - 1) zwidth += children.childwidth;
                                else zwidth += children.childwidth + paddingx;
                            } else if (w == blocks.filter((id)=>id.parent == idval).length - 1) zwidth += children.width;
                            else zwidth += children.width + paddingx;
                        }
                        blocks.filter((a)=>a.id == idval)[0].childwidth = zwidth;
                        idval = blocks.filter((a)=>a.id == idval)[0].parent;
                    }
                    blocks.filter((id)=>id.id == idval)[0].childwidth = totalwidth;
                }
                if (rearrange) {
                    rearrange = false;
                    drag.classList.remove("dragging");
                }
                rearrangeMe();
                checkOffset();
            };
            function touchblock(event) {
                dragblock = false;
                if ($7712d7abb20ba789$var$hasParentClass(event.target, "block")) {
                    let theblock = event.target.closest(".block");
                    if (event.targetTouches) {
                        mouse_x = event.targetTouches[0].clientX;
                        mouse_y = event.targetTouches[0].clientY;
                    } else {
                        mouse_x = event.clientX;
                        mouse_y = event.clientY;
                    }
                    if (event.type !== "mouseup" && $7712d7abb20ba789$var$hasParentClass(event.target, "block")) {
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
            this.moveBlock = (event)=>{
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
                    let blockid = $7712d7abb20ba789$var$__classPrivateFieldGet(this, $7712d7abb20ba789$var$_FlowyDiagram_dragBlockValue, "f").call(this).toInt();
                    const _pb = blocks.find((a)=>a.id == blockid);
                    console.assert(_pb !== undefined, "prev block not found!");
                    prevblock = _pb.parent;
                    blockstemp.push(_pb);
                    blocks = blocks.filter((e)=>e.id != blockid);
                    if (blockid != 0) $7712d7abb20ba789$var$__classPrivateFieldGet(this, $7712d7abb20ba789$var$_FlowyDiagram_instances, "m", $7712d7abb20ba789$var$_FlowyDiagram_arrowByValue).call(this, blockid).remove();
                    let layer = blocks.filter((a)=>a.parent == blockid);
                    let flag = false;
                    let foundids = Array();
                    let allids = Array();
                    while(!flag){
                        layer.filter((l)=>l.id != blockid).map((l)=>l.id).forEach((lid)=>{
                            const _bb = blocks.find((a)=>a.id == lid);
                            console.assert(_bb !== undefined, `block[${lid}] not found!`);
                            blockstemp.push(_bb);
                            const blockParent = $7712d7abb20ba789$var$__classPrivateFieldGet(this, $7712d7abb20ba789$var$_FlowyDiagram_instances, "m", $7712d7abb20ba789$var$_FlowyDiagram_blockByValue).call(this, lid);
                            const arrowParent = $7712d7abb20ba789$var$__classPrivateFieldGet(this, $7712d7abb20ba789$var$_FlowyDiagram_instances, "m", $7712d7abb20ba789$var$_FlowyDiagram_arrowByValue).call(this, lid);
                            blockParent.style.left = blockParent.getBoundingClientRect().left + window.scrollX - (drag.getBoundingClientRect().left + window.scrollX) + "px";
                            blockParent.style.top = blockParent.getBoundingClientRect().top + window.scrollY - (drag.getBoundingClientRect().top + window.scrollY) + "px";
                            arrowParent.style.left = arrowParent.getBoundingClientRect().left + window.scrollX - (drag.getBoundingClientRect().left + window.scrollX) + "px";
                            arrowParent.style.top = arrowParent.getBoundingClientRect().top + window.scrollY - (drag.getBoundingClientRect().top + window.scrollY) + "px";
                            drag.appendChild(blockParent);
                            drag.appendChild(arrowParent);
                            foundids.push(lid);
                            allids.push(lid);
                        });
                        if (foundids.length == 0) flag = true;
                        else {
                            layer = blocks.filter((a)=>foundids.includes(a.parent));
                            foundids = [];
                        }
                    }
                    for(let i = 0; i < blocks.filter((a)=>a.parent == blockid).length; i++){
                        let blocknumber = blocks.filter((a)=>a.parent == blockid)[i].id;
                        blocks = blocks.filter((e)=>e.id != blocknumber);
                    }
                    for(let i = 0; i < allids.length; i++){
                        let blocknumber = allids[i];
                        blocks = blocks.filter((e)=>e.id != blocknumber);
                    }
                    if (blocks.length > 1) rearrangeMe();
                    dragblock = false;
                }
                if (active) {
                    drag.style.left = mouse_x - dragx + "px";
                    drag.style.top = mouse_y - dragy + "px";
                } else if (rearrange) {
                    drag.style.left = mouse_x - dragx - (window.scrollX + absx) + canvas_div.scrollLeft + "px";
                    drag.style.top = mouse_y - dragy - (window.scrollY + absy) + canvas_div.scrollTop + "px";
                    const b = blockstemp.find((a)=>a.id == $7712d7abb20ba789$var$__classPrivateFieldGet(this, $7712d7abb20ba789$var$_FlowyDiagram_dragBlockValue, "f").call(this).toInt());
                    b.x = drag.getBoundingClientRect().left + window.scrollX + parseInt(window.getComputedStyle(drag).width) / 2 + canvas_div.scrollLeft;
                    b.y = drag.getBoundingClientRect().top + window.scrollY + parseInt(window.getComputedStyle(drag).height) / 2 + canvas_div.scrollTop;
                }
                if (active || rearrange) {
                    const _rect = canvas_div.getBoundingClientRect();
                    if (mouse_x > _rect.width + _rect.left - 10 && mouse_x < _rect.width + _rect.left + 10) canvas_div.scrollLeft += 10;
                    else if (mouse_x < _rect.left + 10 && mouse_x > _rect.left - 10) canvas_div.scrollLeft -= 10;
                    else if (mouse_y > _rect.height + _rect.top - 10 && mouse_y < _rect.height + _rect.top + 10) canvas_div.scrollTop += 10;
                    else if (mouse_y < _rect.top + 10 && mouse_y > _rect.top - 10) canvas_div.scrollLeft -= 10;
                    // let xpos = (drag.getBoundingClientRect().left + window.scrollX) + (parseInt(window.getComputedStyle(drag).width) / 2) + canvas_div.scrollLeft - canvas_div.getBoundingClientRect().left;
                    // let ypos = (drag.getBoundingClientRect().top + window.scrollY) + canvas_div.scrollTop - canvas_div.getBoundingClientRect().top;
                    const blocko = blocks.map((a)=>a.id);
                    for(let i = 0; i < blocks.length; i++){
                        if (checkAttach(blocko[i])) {
                            const _b = $7712d7abb20ba789$var$__classPrivateFieldGet(this, $7712d7abb20ba789$var$_FlowyDiagram_instances, "m", $7712d7abb20ba789$var$_FlowyDiagram_blockByValue).call(this, blocko[i]);
                            _b.appendChild(this._indicator);
                            this._indicator.style.left = _b.offsetWidth / 2 - 5 + "px";
                            this._indicator.style.top = _b.offsetHeight + "px";
                            this._indicator.classList.remove("invisible");
                            break;
                        } else if (i == blocks.length - 1) {
                            if (!this._indicator.classList.contains("invisible")) this._indicator.classList.add("invisible");
                        }
                    }
                }
            };
            const checkOffset = ()=>{
                const offsetleftArr = blocks.map((a)=>a.x);
                let widths = blocks.map((a)=>a.width);
                let mathmin = offsetleftArr.map((item, index)=>item - widths[index] / 2);
                offsetleft = Math.min.apply(Math, mathmin);
                if (offsetleft < canvas_div.getBoundingClientRect().left + window.scrollX - absx) {
                    let blocko = blocks.map((a)=>a.id);
                    for(let w = 0; w < blocks.length; w++){
                        $7712d7abb20ba789$var$__classPrivateFieldGet(this, $7712d7abb20ba789$var$_FlowyDiagram_instances, "m", $7712d7abb20ba789$var$_FlowyDiagram_blockByValue).call(this, blocks.filter((a)=>a.id == blocko[w])[0].id).style.left = blocks.filter((a)=>a.id == blocko[w])[0].x - blocks.filter((a)=>a.id == blocko[w])[0].width / 2 - offsetleft + canvas_div.getBoundingClientRect().left - absx + 20 + "px";
                        if (blocks.filter((a)=>a.id == blocko[w])[0].parent != -1) {
                            let arrowblock = blocks.filter((a)=>a.id == blocko[w])[0];
                            let arrowx = arrowblock.x - blocks.filter((a)=>a.id == blocks.filter((a)=>a.id == blocko[w])[0].parent)[0].x;
                            if (arrowx < 0) $7712d7abb20ba789$var$__classPrivateFieldGet(this, $7712d7abb20ba789$var$_FlowyDiagram_instances, "m", $7712d7abb20ba789$var$_FlowyDiagram_arrowByValue).call(this, blocko[w]).style.left = arrowblock.x - offsetleft + 20 - 5 + canvas_div.getBoundingClientRect().left - absx + "px";
                            else $7712d7abb20ba789$var$__classPrivateFieldGet(this, $7712d7abb20ba789$var$_FlowyDiagram_instances, "m", $7712d7abb20ba789$var$_FlowyDiagram_arrowByValue).call(this, blocko[w]).style.left = blocks.filter((id)=>id.id == blocks.filter((a)=>a.id == blocko[w])[0].parent)[0].x - 20 - offsetleft + canvas_div.getBoundingClientRect().left - absx + 20 + "px";
                        }
                    }
                    for(let w = 0; w < blocks.length; w++)blocks[w].x = $7712d7abb20ba789$var$__classPrivateFieldGet(this, $7712d7abb20ba789$var$_FlowyDiagram_instances, "m", $7712d7abb20ba789$var$_FlowyDiagram_blockByValue).call(this, blocks[w].id).getBoundingClientRect().left + window.scrollX + canvas_div.scrollLeft + parseInt(window.getComputedStyle($7712d7abb20ba789$var$__classPrivateFieldGet(this, $7712d7abb20ba789$var$_FlowyDiagram_instances, "m", $7712d7abb20ba789$var$_FlowyDiagram_blockByValue).call(this, blocks[w].id)).width) / 2 - 20 - canvas_div.getBoundingClientRect().left;
                }
            };
            const rearrangeMe = ()=>{
                let result = blocks.map((a)=>a.parent);
                for(let z = 0; z < result.length; z++){
                    if (result[z] == -1) z++;
                    let totalwidth = 0;
                    let totalremove = 0;
                    let maxheight = 0;
                    for(let w = 0; w < blocks.filter((id)=>id.parent == result[z]).length; w++){
                        let children = blocks.filter((id)=>id.parent == result[z])[w];
                        if (blocks.filter((id)=>id.parent == children.id).length == 0) children.childwidth = 0;
                        if (children.childwidth > children.width) {
                            if (w == blocks.filter((id)=>id.parent == result[z]).length - 1) totalwidth += children.childwidth;
                            else totalwidth += children.childwidth + paddingx;
                        } else if (w == blocks.filter((id)=>id.parent == result[z]).length - 1) totalwidth += children.width;
                        else totalwidth += children.width + paddingx;
                    }
                    if (result[z] != -1) blocks.filter((a)=>a.id == result[z])[0].childwidth = totalwidth;
                    for(let w = 0; w < blocks.filter((id)=>id.parent == result[z]).length; w++){
                        let children = blocks.filter((id)=>id.parent == result[z])[w];
                        const r_block = $7712d7abb20ba789$var$__classPrivateFieldGet(this, $7712d7abb20ba789$var$_FlowyDiagram_instances, "m", $7712d7abb20ba789$var$_FlowyDiagram_blockByValue).call(this, children.id);
                        const r_array = blocks.filter((id)=>id.id == result[z]);
                        // r_block.style.top = r_array.y + paddingy + canvas_div.getBoundingClientRect().top - absy + "px";
                        // r_array.y = r_array.y + paddingy;
                        if (children.childwidth > children.width) {
                            r_block.style.left = r_array[0].x - totalwidth / 2 + totalremove + children.childwidth / 2 - children.width / 2 - (absx + window.scrollX) + canvas_div.getBoundingClientRect().left + "px";
                            children.x = r_array[0].x - totalwidth / 2 + totalremove + children.childwidth / 2;
                            totalremove += children.childwidth + paddingx;
                        } else {
                            r_block.style.left = r_array[0].x - totalwidth / 2 + totalremove - (absx + window.scrollX) + canvas_div.getBoundingClientRect().left + "px";
                            children.x = r_array[0].x - totalwidth / 2 + totalremove + children.width / 2;
                            totalremove += children.width + paddingx;
                        }
                        let arrowblock = blocks.filter((a)=>a.id == children.id)[0];
                        let arrowx = arrowblock.x - blocks.filter((a)=>a.id == children.parent)[0].x + 20;
                        let arrowy = paddingy;
                        updateArrow(arrowblock, arrowx, arrowy, children);
                    }
                }
            };
            document.addEventListener("mousedown", this.beginDrag);
            document.addEventListener("mousedown", touchblock, false);
            document.addEventListener("touchstart", this.beginDrag);
            document.addEventListener("touchstart", touchblock, false);
            document.addEventListener("mouseup", touchblock, false);
            document.addEventListener("mousemove", this.moveBlock, false);
            document.addEventListener("touchmove", this.moveBlock, false);
            document.addEventListener("mouseup", this.endDrag, false);
            document.addEventListener("touchend", this.endDrag, false);
        };
        const blockGrabbed = (block)=>{
            const event = new CustomEvent("grab", {
                detail: block
            });
            this.dispatchEvent(event);
        };
        const blockReleased = ()=>{
            const event = new CustomEvent("release");
            this.dispatchEvent(event);
        };
        const blockSnap = (drag, first, parent)=>$7712d7abb20ba789$var$__classPrivateFieldGet(this, $7712d7abb20ba789$var$_FlowyDiagram_snapping, "f").call(this, drag, first, parent);
        const beforeDelete = (drag, parent)=>$7712d7abb20ba789$var$__classPrivateFieldGet(this, $7712d7abb20ba789$var$_FlowyDiagram_rearrange, "f").call(this, drag, parent);
        // function addEventListenerMulti(type: string, listener: any, capture: boolean, selector: string) {
        //     let nodes = document.querySelectorAll(selector);
        //     for (let i = 0; i < nodes.length; i++) {
        //         nodes[i].addEventListener(type, listener, capture);
        //     }
        // }
        // function removeEventListenerMulti(type: string, listener: any, capture: boolean, selector: string) {
        //     let nodes = document.querySelectorAll(selector);
        //     for (let i = 0; i < nodes.length; i++) {
        //         nodes[i].removeEventListener(type, listener, capture);
        //     }
        // }
        this.load();
    }
};
$7712d7abb20ba789$var$_FlowyDiagram_snapping = new WeakMap(), $7712d7abb20ba789$var$_FlowyDiagram_rearrange = new WeakMap(), $7712d7abb20ba789$var$_FlowyDiagram_dragBlockValue = new WeakMap(), $7712d7abb20ba789$var$_FlowyDiagram_instances = new WeakSet(), $7712d7abb20ba789$var$_FlowyDiagram_blockByValue = function _FlowyDiagram_blockByValue(value) {
    return document.getElementById(`block${value}`);
}, $7712d7abb20ba789$var$_FlowyDiagram_arrowByValue = function _FlowyDiagram_arrowByValue(value) {
    return document.getElementById(`arrow${value}`);
};
$7712d7abb20ba789$var$__decorate([
    (0, $fe6qx$query)("#canvas")
], $7712d7abb20ba789$export$ed9fc9039e390ef3.prototype, "_canvas", void 0);
$7712d7abb20ba789$var$__decorate([
    (0, $fe6qx$query)(".indicator")
], $7712d7abb20ba789$export$ed9fc9039e390ef3.prototype, "_indicator", void 0);
$7712d7abb20ba789$var$__decorate([
    (0, $fe6qx$property)({
        type: "number"
    })
], $7712d7abb20ba789$export$ed9fc9039e390ef3.prototype, "spacing_x", void 0);
$7712d7abb20ba789$var$__decorate([
    (0, $fe6qx$property)({
        type: "number"
    })
], $7712d7abb20ba789$export$ed9fc9039e390ef3.prototype, "spacing_y", void 0);
$7712d7abb20ba789$export$ed9fc9039e390ef3 = $7712d7abb20ba789$var$__decorate([
    (0, $fe6qx$customElement)("flowy-diagram")
], $7712d7abb20ba789$export$ed9fc9039e390ef3);


export {$7712d7abb20ba789$export$132f54fcf658b73a as createOrUpdateArrow, $7712d7abb20ba789$export$ed9fc9039e390ef3 as FlowyDiagram, $7712d7abb20ba789$exports as default};
