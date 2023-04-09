import 'flowy-engine/dist/flowy.js' 
import { getElementMetaData } from 'flowy-element'
import type { FlowyDiagram } from 'flowy-engine'


document.addEventListener("DOMContentLoaded", function () {

    const flowy = document.getElementById('flowy') as FlowyDiagram

    const element = getElementMetaData( flowy )

    const templates_container = document.getElementById("blocklist")!

    element.addTemplates( templates_container )

    const properties_container = document.getElementById('propwrap')!
    
    flowy.addEventListener( 'blockSelected', ((e:CustomEvent<HTMLElement>) => {
        // guard already selected
        if( flowy.querySelector( ".selectedblock" ) !== null ) return 

        console.debug( `block selected! ${e.detail.id}`)

        element.addPopertiesSheet( properties_container, e.detail  )

        properties_container.querySelector("#properties")?.classList.add("expanded")
        properties_container.classList.add("itson");
        e.detail.classList.add("selectedblock");

    }) as EventListener, false )

    flowy.addEventListener( 'sheetClosed', ((e:CustomEvent<HTMLElement>) => {
        console.debug( `sheet closed! element: ${e.detail.id}`)
        
        properties_container.querySelector("#properties")?.classList.remove("expanded")
        setTimeout(() => properties_container.classList.remove("itson"), 300)

        e.detail.classList.remove("selectedblock");

    }) as EventListener, false )

 
})

