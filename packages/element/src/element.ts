import {LitElement, html, render} from 'lit';
import {query} from 'lit/decorators/query.js';
import {customElement, property} from 'lit/decorators.js';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';
import type { SnappingHandler, FlowyDiagram } from 'flowy-engine'

const mode_img = new URL('../assets/more.svg', import.meta.url)
const grabme_img = new URL('../assets/grabme.svg', import.meta.url)
const logred_img = new URL('../assets/logred.svg', import.meta.url)
const databaseorange_img = new URL('../assets/databaseorange.svg', import.meta.url)
const eye_img = new URL('../assets/eye.svg', import.meta.url)
const eyeblue_img = new URL('../assets/eyeblue.svg', import.meta.url)
const action_img = new URL('../assets/action.svg', import.meta.url)
const actionblue_img = new URL('../assets/actionblue.svg', import.meta.url)
const actionorange_img = new URL('../assets/actionorange.svg', import.meta.url)
const time_img = new URL('../assets/time.svg', import.meta.url)
const timeblue_img = new URL('../assets/timeblue.svg', import.meta.url)
const error_img = new URL('../assets/error.svg', import.meta.url)
const errorblue_img = new URL('../assets/errorblue.svg', import.meta.url)
const errorred_img = new URL('../assets/errorred.svg', import.meta.url)
const database_img = new URL('../assets/database.svg', import.meta.url)
const twitter_img = new URL('../assets/twitter.svg', import.meta.url)
const twitterorange_img = new URL('../assets/twitterorange.svg', import.meta.url)
const log_img = new URL('../assets/log.svg', import.meta.url)
const close_img = new URL('../assets/close.svg', import.meta.url)
const dropdown_img = new URL('../assets/dropdown.svg', import.meta.url)
const checkon_img = new URL('../assets/checkon.svg', import.meta.url)
const checkoff_img = new URL('../assets/checkoff.svg', import.meta.url)


export interface ElementMetaData {

    addElement: ( target:HTMLElement ) => boolean

    addTemplates: ( target:HTMLElement ) => void

    addTimeSheet: (  target:HTMLElement, element?:HTMLElement ) => void

}

export function getElementMetaData( diagram:FlowyDiagram ): ElementMetaData {
    return {

        addElement: ( target:HTMLElement ) => {

            const grab = target.querySelector(".grabme") 
            grab?.parentElement?.removeChild(grab);
            const blockin = target.querySelector(".blockin");
            blockin?.parentElement?.removeChild(blockin);
    
            const value = (target.querySelector(".blockelemtype") as HTMLDataElement).value

            switch( value ) {
                case "1":
                    _addElement(target, eyeblue_img, 'New visitor', 'When a <span>new visitor</span> goes to <span>Site 1</span>')
                    break
                case "2" :
                    _addElement(target, actionblue_img, 'Action is performed', 'When <span>Action 1</span> is performed')
                    break
                case "3":
                    _addElement(target, timeblue_img, 'Time has passed', 'When <span>10 seconds</span> have passed</div>')
                    break
                case "4":
                    _addElement(target, errorblue_img, 'Error prompt', 'When <span>Error 1</span> is triggered</div>')
                    break
                case "5":
                    _addElement(target, databaseorange_img, 'New database entry', 'Add <span>Data object</span> to <span>Database 1</span>');
                    break
                case "6":
                    _addElement(target, databaseorange_img, 'Update database', 'Update <span>Database 1</span>');
                    break
                case "7":
                    _addElement(target, actionorange_img, 'Perform an action', 'Perform <span>Action 1</span>');
                    break
                case "8":
                    _addElement(target, twitterorange_img, 'Make a tweet', 'Tweet <span>Query 1</span> with the account <span>@alyssaxuu</span>');
                    break
                case "9":
                    _addElement(target, logred_img, 'Add new log entry', 'Add new <span>success</span> log entry');
                    break
                case "10":
                    _addElement(target, logred_img, 'Update logs', 'Edit <span>Log Entry 1</span>');
                    break
                case "5":
                    _addElement(target, errorred_img, 'Prompt an error', 'Trigger <span>Error 1</span>');
                    break
                default:
                    return false
            }
    
            return true;
        },

        addTemplates: _addTemplates,

        addTimeSheet: _addTimeSheet,

    }
}

const _addElement = ( target:HTMLElement, image_url:URL, title:string, description:string ) =>  {
    
    const content = 
        html`
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

    return render( content, target )
}

const  createTemplate = ( value:number, image_url:URL, title:string, description:string ) => 
    html`
    <div class="blockelem create-flowy noselect">
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

const _addTemplates =  ( target:HTMLElement ) => {

    const templates = [
            createTemplate( 1, eye_img, 'New visitor', 'Triggers when somebody visits a specified page'),
            createTemplate( 2, action_img, 'Action is performed', 'Triggers when somebody performs a specified action'),
            createTemplate( 3, time_img, 'Time has passed', 'Triggers after a specified amount of time'),
            createTemplate( 4, error_img, 'Error prompt', 'Triggers when a specified error happens'),
    
            createTemplate(5, database_img, 'New database entry', 'Adds a new entry to a specified database'),
            createTemplate(6, database_img, 'Update database', 'Edits and deletes database entries and properties'),
            createTemplate(7, action_img, 'Perform an action', 'Performs or edits a specified action'),
            createTemplate(8, twitter_img, 'Make a tweet', 'Makes a tweet with a specified query'),

            createTemplate(9, log_img, 'Add new log entry', 'Adds a new log entry to this project'),
            createTemplate(10, log_img, 'Update logs', 'Edits and deletes log entries in this project'),
            createTemplate(11, error_img, 'Prompt an error', 'Triggers a specified error'),
    ]

    render(html`${templates}`, target)
        
} 

const _addTimeSheet = (  target:HTMLElement, element?:HTMLElement ) => {

    const content =  html`
    <div id="properties">
        <div id="close">
            <img src="${close_img}">
        </div>
        <p id="header2">Properties</p>
        <div id="propswitch">
            <div id="dataprop">Data</div>
            <div id="alertprop">Alerts</div>
            <div id="logsprop">Logs</div>
        </div>
        <div id="proplist">
            <p class="inputlabel">Select database</p>
            <div class="dropme">Database 1 <img src="${dropdown_img}"></div>
            <p class="inputlabel">Check properties</p>
            <div class="dropme">All<img src="${dropdown_img}"></div>
            <div class="checkus"><img src="${checkon_img}"><p>Log on successful performance</p></div>
            <div class="checkus"><img src="${checkoff_img}"><p>Give priority to this block</p></div>
        </div>
        <div id="divisionthing"></div>
        <div id="removeblock">Delete blocks</div>
    </div>
    `
    render( content, target )

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