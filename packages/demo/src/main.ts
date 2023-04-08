import 'flowy-engine/dist/flowy.js' 
import { getElementMetaData } from 'flowy-element'
import type { FlowyDiagram } from 'flowy-engine'

function addEventListenerMulti(type: string, listener: (event: any) => void, capture: boolean, selector: string) {
    const nodes = document.querySelectorAll(selector);
    for (let i = 0; i < nodes.length; i++) {
        nodes[i].addEventListener(type, listener, capture);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    let rightcard = false
    let tempblock: any
    let tempblock2: any

    const flowy = document.getElementById('flowy') as FlowyDiagram

    const element = getElementMetaData( flowy )

    const templates_container = document.getElementById("blocklist") as HTMLElement

    element.addTemplates( templates_container )

    const properties_container = document.getElementById('propwrap')!
    
    element.addTimeSheet( properties_container )

    flowy.addEventListener( 'grab', (event:any) => drag(event.detail), false)
    flowy.addEventListener( 'release', () => release(), false)

    flowy.registerSnapping( ( drag, _ ) => element.addElement( drag ) )

    const drag = (block: any) => {
        block.classList.add("blockdisabled");
        tempblock2 = block;
    }

    const release = () => {
        if (tempblock2) {
            tempblock2.classList.remove("blockdisabled");
        }
    }

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



