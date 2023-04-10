import 'flowy-engine/dist/flowy.js' 
import { initElement } from 'flowy-element'
import type { FlowyDiagram } from 'flowy-engine'


document.addEventListener("DOMContentLoaded", function () {

    const flowy = document.getElementById('flowy') as FlowyDiagram
    const templates_container = document.getElementById("blocklist")!
    const properties_container = document.getElementById('propwrap')!

    initElement( flowy,  templates_container , properties_container )
    
    flowy.addEventListener( 'blockSelected', (e) => {

        console.debug( `block selected! ${e.detail.id}`)

        properties_container.classList.add("itson");

    }, false )

    flowy.addEventListener( 'sheetClosed', (e) => {

        console.debug( `sheet closed! element: ${e.detail.id}`)
                
        setTimeout(() => properties_container.classList.remove("itson"), 300)

    }, false )

 
})

