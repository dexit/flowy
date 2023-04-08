import {html as $jZZuB$html, LitElement as $jZZuB$LitElement} from "lit";
import {property as $jZZuB$property, customElement as $jZZuB$customElement} from "lit/decorators.js";
import {unsafeHTML as $jZZuB$unsafeHTML} from "lit-html/directives/unsafe-html";

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}
var $22f06dd72194115c$exports = {};

$parcel$export($22f06dd72194115c$exports, "createElement", () => $22f06dd72194115c$export$c8a8987d4410bf2d, (v) => $22f06dd72194115c$export$c8a8987d4410bf2d = v);
$parcel$export($22f06dd72194115c$exports, "FlowyElement", () => $22f06dd72194115c$export$90c911497a48cbfb, (v) => $22f06dd72194115c$export$90c911497a48cbfb = v);



var $22f06dd72194115c$var$__decorate = undefined && undefined.__decorate || function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
const $22f06dd72194115c$var$mode_img = new URL("more.51e76296.svg", import.meta.url);
const $22f06dd72194115c$var$grabme_img = new URL("grabme.fee7a767.svg", import.meta.url);
function $22f06dd72194115c$export$c8a8987d4410bf2d(params) {
    const { image_url: image_url , type: type , title: title , description: description , value: value = 0  } = params;
    if (type == "element") return (0, $jZZuB$html)`
        <div>
            <div class='blockyleft'>
                <img src='${image_url}'>
                    <p class='blockyname'>${title}</p>
            </div>
            <div class='blockyright'>
                <img src='${$22f06dd72194115c$var$mode_img}'>
            </div>
            <div class='blockydiv'></div>
            <div class='blockyinfo'>${(0, $jZZuB$unsafeHTML)(description)}</div>
        </div>
        `;
    if (type == "template") return (0, $jZZuB$html)`
        <div class="blockelem create-flowy noselect">
            <input type="hidden" name="blockelemtype" class="blockelemtype" value="${value}">
            <div class="grabme">
                <img src="${$22f06dd72194115c$var$grabme_img}">
            </div>

            <div class="blockin">
                <div class="blockico">
                    <span></span>
                    <img src="${image_url}">
                </div>
                <div class="blocktext">
                    <p class="blocktitle">${title}</p>
                    <p class="blockdesc">${(0, $jZZuB$unsafeHTML)(description)}</p>
                </div>
            </div>
        </div>    
        `;
    if (type == "propertysheet") return (0, $jZZuB$html)`
        <div id="properties">
            <div id="close">
                <img src="${image_url}">
            </div>
            <p id="header2">Properties</p>
            <div id="propswitch">
                <div id="dataprop">Data</div>
                <div id="alertprop">Alerts</div>
                <div id="logsprop">Logs</div>
            </div>
            <div id="proplist">
                <p class="inputlabel">Select database</p>
                <div class="dropme">Database 1 <img src="assets/dropdown.svg"></div>
                <p class="inputlabel">Check properties</p>
                <div class="dropme">All<img src="assets/dropdown.svg"></div>
                <div class="checkus"><img src="assets/checkon.svg"><p>Log on successful performance</p></div>
                <div class="checkus"><img src="assets/checkoff.svg"><p>Give priority to this block</p></div>
            </div>
            <div id="divisionthing"></div>
            <div id="removeblock">Delete blocks</div>
        </div>
        `;
}
let $22f06dd72194115c$export$90c911497a48cbfb = class FlowyElement extends (0, $jZZuB$LitElement) {
    constructor(){
        super();
        this.type = "element";
        this.title = "";
        this.description = "";
    }
    /**
     * disable shadow root
     *
     * @returns
     * @see [How to create LitElement without Shadow DOM?](https://stackoverflow.com/a/55213037/521197)
     */ createRenderRoot() {
        return this;
    }
    render() {
        const { type: type , value: value , image_url: image_url , title: title , description: description  } = this;
        if (type == "element") return (0, $jZZuB$html)`
            <div>
                <div class='blockyleft'>
                    <img src='${image_url}'>
                        <p class='blockyname'>${title}</p>
                </div>
                <div class='blockyright'>
                    <img src='${$22f06dd72194115c$var$mode_img}'>
                </div>
                <div class='blockydiv'></div>
                <div class='blockyinfo'>${(0, $jZZuB$unsafeHTML)(description)}</div>
            </div>
            `;
        if (type == "template") return (0, $jZZuB$html)`
            <div>
                <input type="hidden" name="blockelemtype" class="blockelemtype" value="${value}">
                <div class="grabme">
                    <img src="${$22f06dd72194115c$var$grabme_img}">
                </div>

                <div class="blockin">
                    <div class="blockico">
                        <span></span>
                        <img src="${image_url}">
                    </div>
                    <div class="blocktext">
                        <p class="blocktitle">${title}</p>
                        <p class="blockdesc">${(0, $jZZuB$unsafeHTML)(description)}</p>
                    </div>
                </div>
            </div>
            `;
        if (type == "propertysheet") return (0, $jZZuB$html)`
                <div id="properties">
                    <div id="close">
                        <img src="${image_url}">
                    </div>
                    <p id="header2">Properties</p>
                    <div id="propswitch">
                        <div id="dataprop">Data</div>
                        <div id="alertprop">Alerts</div>
                        <div id="logsprop">Logs</div>
                    </div>
                    <div id="proplist">
                        <p class="inputlabel">Select database</p>
                        <div class="dropme">Database 1 <img src="assets/dropdown.svg"></div>
                        <p class="inputlabel">Check properties</p>
                        <div class="dropme">All<img src="assets/dropdown.svg"></div>
                        <div class="checkus"><img src="assets/checkon.svg"><p>Log on successful performance</p></div>
                        <div class="checkus"><img src="assets/checkoff.svg"><p>Give priority to this block</p></div>
                    </div>
                    <div id="divisionthing"></div>
                    <div id="removeblock">Delete blocks</div>
                </div>
            `;
    }
};
$22f06dd72194115c$var$__decorate([
    (0, $jZZuB$property)()
], $22f06dd72194115c$export$90c911497a48cbfb.prototype, "type", void 0);
$22f06dd72194115c$var$__decorate([
    (0, $jZZuB$property)({
        type: "number"
    })
], $22f06dd72194115c$export$90c911497a48cbfb.prototype, "value", void 0);
$22f06dd72194115c$var$__decorate([
    (0, $jZZuB$property)()
], $22f06dd72194115c$export$90c911497a48cbfb.prototype, "image_url", void 0);
$22f06dd72194115c$var$__decorate([
    (0, $jZZuB$property)()
], $22f06dd72194115c$export$90c911497a48cbfb.prototype, "title", void 0);
$22f06dd72194115c$var$__decorate([
    (0, $jZZuB$property)()
], $22f06dd72194115c$export$90c911497a48cbfb.prototype, "description", void 0);
$22f06dd72194115c$export$90c911497a48cbfb = $22f06dd72194115c$var$__decorate([
    (0, $jZZuB$customElement)("flowy-myelement")
], $22f06dd72194115c$export$90c911497a48cbfb);


export {$22f06dd72194115c$export$c8a8987d4410bf2d as createElement, $22f06dd72194115c$export$90c911497a48cbfb as FlowyElement, $22f06dd72194115c$exports as default};
