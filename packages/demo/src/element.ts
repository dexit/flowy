import {LitElement, html, render} from 'lit';
import {query} from 'lit/decorators/query.js';
import {customElement, property} from 'lit/decorators.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';


const mode_img = new URL('../assets/more.svg', import.meta.url)
const grabme_img = new URL('../assets/grabme.svg', import.meta.url)

type addElementParameters = {
    image_url: URL,
    title: string,
    description: string
    value?: number
    type: 'element' | 'template' | 'propertysheet'
}

export function createElement( params: addElementParameters  ) {

    const { image_url, type, title, description, value = 0 } = params 

    if( type == 'element') {

        return html`
            <flowy-myelement class="blockelem create-flowy noselect" value="${value}" image_url="${image_url}" title="${title}" description="${description}" type="element"/>
        `

/*        
        return html`
        <div>
            <div class='blockyleft'>
                <img src='${image_url}'>
                    <p class='blockyname'>${title}</p>
            </div>
            <div class='blockyright'>
                <img src='${mode_img}'>
            </div>
            <div class='blockydiv'></div>
            <div class='blockyinfo'>${unsafeHTML(description)}</div>
        </div>
        `
*/
    }

    if( type == 'template' ) {

        return html`
            <flowy-myelement class="blockelem create-flowy noselect" value="${value}" image_url="${image_url}" title="${title}" description="${description}" type="template"/>
        `
/*
        return html`
        <div class="blockelem create-flowy noselect">
            <input type="hidden" name="blockelemtype" class="blockelemtype" value="${value}">
            <div class="grabme">
                <img src="${grabme_img}">
            </div>
            <flowy-myelement value="${value}" image_url="${image_url}" title="${title}" description="${description}" type="template"/>
        </div>    
        `
*/
    }

    if( type == 'propertysheet') {

        return html`
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
        `
    }
}


@customElement('flowy-myelement')
export class FlowyElement extends LitElement {

    @property()
    type: 'element' | 'template' | 'propertysheet' = 'element'

    @property( { type: 'number' })
    value?:number

    @property()
    image_url?: URL

    @property()
    title: string = ''

    @property()
    description: string = ''

    constructor() {
        super();
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

    protected render() {

        const { type , value, image_url, title, description } = this    
        
        if( type == 'element') {
            return html`
            <div>
                <div class='blockyleft'>
                    <img src='${image_url}'>
                        <p class='blockyname'>${title}</p>
                </div>
                <div class='blockyright'>
                    <img src='${mode_img}'>
                </div>
                <div class='blockydiv'></div>
                <div class='blockyinfo'>${unsafeHTML(description)}</div>
            </div>
            `
    
        }
        if( type == 'template' ) {
            console.debug( 'render' )
            return html`
            <div>
                <input type="hidden" name="blockelemtype" class="blockelemtype" value="${value}">
                <div class="grabme">
                    <img src="${grabme_img}">
                </div>

                <div class="blockin">
                    <div class="blockico">
                        <span></span>
                        <img src="${image_url}">
                    </div>
                    <div class="blocktext">
                        <p class="blocktitle">${title}</p>
                        <p class="blockdesc">${unsafeHTML(description)}</p>
                    </div>
                </div>
            </div>
            `
        }

        if( type == 'propertysheet') {

            return html`
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
            `
        }
    }

}
