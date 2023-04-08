import 'flowy-engine/dist/flowy.js' 
import './element'
import { createElement } from './element' 

import type { FlowyDiagram } from 'flowy-engine'
import { html, render } from 'lit-html'


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


function addEventListenerMulti(type: string, listener: (event: any) => void, capture: boolean, selector: string) {
    const nodes = document.querySelectorAll(selector);
    for (let i = 0; i < nodes.length; i++) {
        nodes[i].addEventListener(type, listener, capture);
    }
}

function renderTemplates(target: HTMLElement, templates: Array<any>) {

    const div = document.createElement('div')

    render(html`${templates}`, div)

    target.innerHTML = div.innerHTML

}

const addPropertySheet = () => { 

    const container = document.getElementById('propwrap')!
    
    const e = createElement( { image_url:close_img, title:'', description:'', type:'propertysheet' })

    render( e, container)
}

const  menuElement = ( value:number, image_url:URL, title:string, description:string ) =>  createElement( { value:value, image_url:image_url, title:title, description:description, type:'template' })

const  addElement = ( target:HTMLElement, image_url:URL, title:string, description:string ) =>  {
    
    let e = createElement( { image_url:image_url, title:title, description:description, type:'element' })

    return render( e, target )
}

document.addEventListener("DOMContentLoaded", function () {
    let rightcard = false
    let tempblock: any
    let tempblock2: any

    const blocklist = document.getElementById("blocklist") as HTMLElement


    const menu_item = [
        [
            menuElement( 1, eye_img, 'New visitor', 'Triggers when somebody visits a specified page'),
            menuElement( 2, action_img, 'Action is performed', 'Triggers when somebody performs a specified action'),
            menuElement( 3, time_img, 'Time has passed', 'Triggers after a specified amount of time'),
            menuElement(4, error_img, 'Error prompt', 'Triggers when a specified error happens'),
        ],
        [
            menuElement(5, database_img, 'New database entry', 'Adds a new entry to a specified database'),
            menuElement(6, database_img, 'Update database', 'Edits and deletes database entries and properties'),
            menuElement(7, action_img, 'Perform an action', 'Performs or edits a specified action'),
            menuElement(8, twitter_img, 'Make a tweet', 'Makes a tweet with a specified query'),
        ],
        [
            menuElement(9, log_img, 'Add new log entry', 'Adds a new log entry to this project'),
            menuElement(10, log_img, 'Update logs', 'Edits and deletes log entries in this project'),
            menuElement(11, error_img, 'Prompt an error', 'Triggers a specified error'),
        ]
    ]

    renderTemplates(blocklist, menu_item[0])

    addPropertySheet()

    const flowy = document.getElementById('flowy') as FlowyDiagram

    flowy.addEventListener( 'grab', (event:any) => drag(event.detail), false)
    flowy.addEventListener( 'release', () => release(), false)

    flowy.registerSnapping( snapping )


    function snapping(drag:HTMLElement, first:boolean) {
        const grab = drag.querySelector(".grabme") 
        grab?.parentElement?.removeChild(grab);
        const blockin = drag.querySelector(".blockin");
        blockin?.parentElement?.removeChild(blockin);

        const value = (drag.querySelector(".blockelemtype") as HTMLDataElement).value
        if (value == "1") {
            addElement(drag, eyeblue_img, 'New visitor', 'When a <span>new visitor</span> goes to <span>Site 1</span>')
        } else if (value == "2") {
            addElement(drag, actionblue_img, 'Action is performed', 'When <span>Action 1</span> is performed')
        } else if (value == "3") {
            addElement(drag, timeblue_img, 'Time has passed', 'When <span>10 seconds</span> have passed</div>');
        } else if (value == "4") {
            addElement(drag, errorblue_img, 'Error prompt', 'When <span>Error 1</span> is triggered</div>')
        } else if (value == "5") {
            addElement(drag, databaseorange_img, 'New database entry', 'Add <span>Data object</span> to <span>Database 1</span>');
        } else if (value == "6") {
            addElement(drag, databaseorange_img, 'Update database', 'Update <span>Database 1</span>');
        } else if (value == "7") {
            addElement(drag, actionorange_img, 'Perform an action', 'Perform <span>Action 1</span>');
        } else if (value == "8") {
            addElement(drag, twitterorange_img, 'Make a tweet', 'Tweet <span>Query 1</span> with the account <span>@alyssaxuu</span>');
        } else if (value == "9") {
            addElement(drag, logred_img, 'Add new log entry', 'Add new <span>success</span> log entry');
        } else if (value == "10") {
            addElement(drag, logred_img, 'Update logs', 'Edit <span>Log Entry 1</span>');
        } else if (value == "11") {
            addElement(drag, errorred_img, 'Prompt an error', 'Trigger <span>Error 1</span>');
        }
        return true;
    }

    function drag(block: any) {
        block.classList.add("blockdisabled");
        tempblock2 = block;
    }

    function release() {
        if (tempblock2) {
            tempblock2.classList.remove("blockdisabled");
        }
    }

    const disabledClick =  (event:Event) => {
        const target = event.target as HTMLElement

        document.querySelector(".navactive")?.classList.add("navdisabled");
        document.querySelector(".navactive")?.classList.remove("navactive");
        target.classList.add("navactive");
        target.classList.remove("navdisabled");

        if (target.getAttribute("id") == "triggers") {

            renderTemplates(blocklist, menu_item[0])

        } else if (target.getAttribute("id") == "actions") {

            renderTemplates(blocklist, menu_item[1])

        } else if (target.getAttribute("id") == "loggers") {

            renderTemplates(blocklist, menu_item[2])

        }
    }

    addEventListenerMulti("click", disabledClick, false, ".side");

    document.getElementById("close")?.addEventListener("click", () => {
        if (rightcard) {
            rightcard = false;
            document.getElementById("properties")?.classList.remove("expanded");
            setTimeout(() =>
                document.getElementById("propwrap")?.classList.remove("itson"), 300);
            tempblock.classList.remove("selectedblock");
        }
    });

    document.getElementById("removeblock")?.addEventListener("click", () => flowy.deleteBlocks())

    let aclick = false;
    let noinfo = false;

    const beginTouch = (event: Event) => {
        const target = event.target as HTMLElement

        aclick = true;
        noinfo = false;
        if (target.closest(".create-flowy")) {
            noinfo = true;
        }
    }

    const checkTouch = () => aclick = false

    const doneTouch = (event: Event) => {

        const target = event.target as HTMLElement
        const closest = target.closest(".block")

        if (event.type === "mouseup" && aclick && !noinfo) {
            if (!rightcard && closest && !closest?.classList.contains("dragging")) {
                tempblock = closest
                rightcard = true;
                document.getElementById("properties")?.classList.add("expanded");
                document.getElementById("propwrap")?.classList.add("itson");
                tempblock.classList.add("selectedblock");
            }
        }
    }
    addEventListener("mousedown", beginTouch, false);
    addEventListener("mousemove", checkTouch, false);
    addEventListener("mouseup", doneTouch, false);
    addEventListenerMulti("touchstart", beginTouch, false, ".block");

});
