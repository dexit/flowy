import {LitElement, html, render} from 'lit';
import {query} from 'lit/decorators/query.js';
import {customElement, property} from 'lit/decorators.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';


const mode_img = new URL('../assets/more.svg', import.meta.url)

@customElement('flowy-myelement')
export class FlowyElement extends LitElement {

    @property()
    image_url?: URL

    @property()
    title: string = ""

    @property()
    description: string = ""

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
        return html`
        <div class='blockyleft'>
            <img src='${this.image_url}'>
            <p class='blockyname'>${this.title}</p>
        </div>
        <div class='blockyright'>
            <img src='${mode_img}'>
        </div>
        <div class='blockydiv'></div>
        <div class='blockyinfo'>
            <span>${unsafeHTML(this.description)}</span>
        </div>
        `    
    }

}