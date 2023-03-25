import { newflowy } from 'flowy-engine'

document.addEventListener("DOMContentLoaded", function(){
    var rightcard = false;
    var tempblock;
    var tempblock2;
    
    document.getElementById("blocklist").innerHTML = `

        <div class="blockelem create-flowy noselect">
            <input type="hidden" name="blockelemtype" class="blockelemtype" value="1">
            <div class="grabme">
                <img src="assets/grabme.svg">
            </div>
            <div class="blockin">
                <div class="blockico">
                    <span></span>
                    <img src="assets/eye.svg">
                </div>
                <div class="blocktext">
                    <p class="blocktitle">New visitor</p>
                    <p class="blockdesc">Triggers when somebody visits a specified page</p>
                </div>
            </div>
        </div>

        <div class="blockelem create-flowy noselect">
            <input type="hidden" name="blockelemtype" class="blockelemtype" value="2">
            <div class="grabme">
                <img src="assets/grabme.svg">
            </div>
            <div class="blockin">
                <div class="blockico">
                    <span></span>
                    <img src="assets/action.svg">
                </div>
                <div class="blocktext">                        
                    <p class="blocktitle">Action is performed</p>
                    <p class="blockdesc">Triggers when somebody performs a specified action</p>
                </div>
            </div>
        </div>
        
        <div class="blockelem create-flowy noselect">
            <input type="hidden" name="blockelemtype" class="blockelemtype" value="3">
            <div class="grabme">
                <img src="assets/grabme.svg"></div>
                <div class="blockin">                    
                    <div class="blockico">
                        <span></span>
                        <img src="assets/time.svg">
                    </div>
                <div class="blocktext">                        
                    <p class="blocktitle">Time has passed</p>
                    <p class="blockdesc">Triggers after a specified amount of time</p>          
                </div>
            </div>
        </div>
        
        <div class="blockelem create-flowy noselect">
            <input type="hidden" name="blockelemtype" class="blockelemtype" value="4">
            <div class="grabme">
                <img src="assets/grabme.svg">
            </div>
            <div class="blockin">                    
                <div class="blockico">
                    <span></span>
                    <img src="assets/error.svg">
                </div>
                <div class="blocktext">                        
                    <p class="blocktitle">Error prompt</p>
                    <p class="blockdesc">Triggers when a specified error happens</p>              
                </div>
            </div>
        </div>
        `;

    let flowy = newflowy(document.getElementById("canvas"), drag, release, snapping);
    function addEventListenerMulti(type, listener, capture, selector) {
        var nodes = document.querySelectorAll(selector);
        for (var i = 0; i < nodes.length; i++) {
            nodes[i].addEventListener(type, listener, capture);
        }
    }

    function addElement(drag, image_url, title, body ) {
        
        const img1 = document.createElement('img');
        img1.src = image_url;

        const p = document.createElement('P');
        p.className = 'blockyname'
        p.innerText = title

        const div1 = document.createElement('div');
        div1.className = 'blockyleft';
        div1.appendChild(img1)
        div1.appendChild(p)

        const img2 = document.createElement('img');
        img2.src = new URL('assets/more.svg', import.meta.url);

        const div2 = document.createElement('div');
        div2.className = 'blockyright';
        div2.appendChild(img2)

        const div3 = document.createElement('div');
        div3.className = 'blockydiv';

        const div4 = document.createElement('div');
        div4.className = 'blockyinfo';
        div4.innerHTML = body

        drag.appendChild(div1)
        drag.appendChild(div2)
        drag.appendChild(div3)
        drag.appendChild(div4)

    }

    function snapping(drag, first) {
        var grab = drag.querySelector(".grabme");
        grab.parentNode.removeChild(grab);
        var blockin = drag.querySelector(".blockin");
        blockin.parentNode.removeChild(blockin);
        if (drag.querySelector(".blockelemtype").value == "1") { 
            addElement(drag, new URL('assets/eyeblue.svg', import.meta.url), 'New visitor', 'When a <span>new visitor</span> goes to <span>Site 1</span>')
        } else if (drag.querySelector(".blockelemtype").value == "2") {
            addElement(drag, new URL('assets/actionblue.svg', import.meta.url), 'Action is performed', 'When <span>Action 1</span> is performed')
        } else if (drag.querySelector(".blockelemtype").value == "3") {
            addElement(drag, new URL('assets/timeblue.svg', import.meta.url), 'Time has passed', 'When <span>10 seconds</span> have passed</div>');
        } else if (drag.querySelector(".blockelemtype").value == "4") {
            addElement(drag, new URL('assets/errorblue.svg', import.meta.url), 'Error prompt', 'When <span>Error 1</span> is triggered</div>')
        } else if (drag.querySelector(".blockelemtype").value == "5") {
            addElement(drag, new URL('assets/databaseorange.svg', import.meta.url),'New database entry', 'Add <span>Data object</span> to <span>Database 1</span>');
        } else if (drag.querySelector(".blockelemtype").value == "6") {
            addElement(drag, new URL('assets/databaseorange.svg', import.meta.url),'Update database', 'Update <span>Database 1</span>');
        } else if (drag.querySelector(".blockelemtype").value == "7") {
            addElement(drag, new URL('assets/actionorange.svg', import.meta.url), 'Perform an action', 'Perform <span>Action 1</span>');
        } else if (drag.querySelector(".blockelemtype").value == "8") {
            addElement(drag, new URL('assets/twitterorange.svg', import.meta.url), 'Make a tweet', 'Tweet <span>Query 1</span> with the account <span>@alyssaxuu</span>');
        } else if (drag.querySelector(".blockelemtype").value == "9") {
            addElement(drag, new URL('assets/logred.svg', import.meta.url), 'Add new log entry','Add new <span>success</span> log entry');
        } else if (drag.querySelector(".blockelemtype").value == "10") {
            addElement(drag, new URL('assets/logred.svg', import.meta.url), 'Update logs', 'Edit <span>Log Entry 1</span>');
        } else if (drag.querySelector(".blockelemtype").value == "11") {
            addElement(drag, new URL('assets/errorred.svg', import.meta.url), 'Prompt an error', 'Trigger <span>Error 1</span>');
        }
        return true;
    }
    function drag(block) {
        block.classList.add("blockdisabled");
        tempblock2 = block;
    }
    function release() {
        if (tempblock2) {
            tempblock2.classList.remove("blockdisabled");
        }
    }
    var disabledClick = function(){
        document.querySelector(".navactive").classList.add("navdisabled");
        document.querySelector(".navactive").classList.remove("navactive");
        this.classList.add("navactive");
        this.classList.remove("navdisabled");
        if (this.getAttribute("id") == "triggers") {
            document.getElementById("blocklist").innerHTML = '<div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="1"><div class="grabme"><img src="assets/grabme.svg"></div><div class="blockin">                  <div class="blockico"><span></span><img src="assets/eye.svg"></div><div class="blocktext">                        <p class="blocktitle">New visitor</p><p class="blockdesc">Triggers when somebody visits a specified page</p>        </div></div></div><div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="2"><div class="grabme"><img src="assets/grabme.svg"></div><div class="blockin">                    <div class="blockico"><span></span><img src="assets/action.svg"></div><div class="blocktext">                        <p class="blocktitle">Action is performed</p><p class="blockdesc">Triggers when somebody performs a specified action</p></div></div></div><div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="3"><div class="grabme"><img src="assets/grabme.svg"></div><div class="blockin">                    <div class="blockico"><span></span><img src="assets/time.svg"></div><div class="blocktext">                        <p class="blocktitle">Time has passed</p><p class="blockdesc">Triggers after a specified amount of time</p>          </div></div></div><div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="4"><div class="grabme"><img src="assets/grabme.svg"></div><div class="blockin">                    <div class="blockico"><span></span><img src="assets/error.svg"></div><div class="blocktext">                        <p class="blocktitle">Error prompt</p><p class="blockdesc">Triggers when a specified error happens</p>              </div></div></div>';
        } else if (this.getAttribute("id") == "actions") {
            document.getElementById("blocklist").innerHTML = '<div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="5"><div class="grabme"><img src="assets/grabme.svg"></div><div class="blockin">                  <div class="blockico"><span></span><img src="assets/database.svg"></div><div class="blocktext">                        <p class="blocktitle">New database entry</p><p class="blockdesc">Adds a new entry to a specified database</p>        </div></div></div><div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="6"><div class="grabme"><img src="assets/grabme.svg"></div><div class="blockin">                  <div class="blockico"><span></span><img src="assets/database.svg"></div><div class="blocktext">                        <p class="blocktitle">Update database</p><p class="blockdesc">Edits and deletes database entries and properties</p>        </div></div></div><div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="7"><div class="grabme"><img src="assets/grabme.svg"></div><div class="blockin">                  <div class="blockico"><span></span><img src="assets/action.svg"></div><div class="blocktext">                        <p class="blocktitle">Perform an action</p><p class="blockdesc">Performs or edits a specified action</p>        </div></div></div><div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="8"><div class="grabme"><img src="assets/grabme.svg"></div><div class="blockin">                  <div class="blockico"><span></span><img src="assets/twitter.svg"></div><div class="blocktext">                        <p class="blocktitle">Make a tweet</p><p class="blockdesc">Makes a tweet with a specified query</p>        </div></div></div>';
        } else if (this.getAttribute("id") == "loggers") {
            document.getElementById("blocklist").innerHTML = '<div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="9"><div class="grabme"><img src="assets/grabme.svg"></div><div class="blockin">                  <div class="blockico"><span></span><img src="assets/log.svg"></div><div class="blocktext">                        <p class="blocktitle">Add new log entry</p><p class="blockdesc">Adds a new log entry to this project</p>        </div></div></div><div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="10"><div class="grabme"><img src="assets/grabme.svg"></div><div class="blockin">                  <div class="blockico"><span></span><img src="assets/log.svg"></div><div class="blocktext">                        <p class="blocktitle">Update logs</p><p class="blockdesc">Edits and deletes log entries in this project</p>        </div></div></div><div class="blockelem create-flowy noselect"><input type="hidden" name="blockelemtype" class="blockelemtype" value="11"><div class="grabme"><img src="assets/grabme.svg"></div><div class="blockin">                  <div class="blockico"><span></span><img src="assets/error.svg"></div><div class="blocktext">                        <p class="blocktitle">Prompt an error</p><p class="blockdesc">Triggers a specified error</p>        </div></div></div>';
        }
    }
    addEventListenerMulti("click", disabledClick, false, ".side");
    document.getElementById("close").addEventListener("click", function(){
       if (rightcard) {
           rightcard = false;
           document.getElementById("properties").classList.remove("expanded");
           setTimeout(function(){
                document.getElementById("propwrap").classList.remove("itson"); 
           }, 300);
            tempblock.classList.remove("selectedblock");
       } 
    });
    
document.getElementById("removeblock").addEventListener("click", function(){
 flowy.deleteBlocks();
});
var aclick = false;
var noinfo = false;
var beginTouch = function (event) {
    aclick = true;
    noinfo = false;
    if (event.target.closest(".create-flowy")) {
        noinfo = true;
    }
}
var checkTouch = function (event) {
    aclick = false;
}
var doneTouch = function (event) {
    if (event.type === "mouseup" && aclick && !noinfo) {
      if (!rightcard && event.target.closest(".block") && !event.target.closest(".block").classList.contains("dragging")) {
            tempblock = event.target.closest(".block");
            rightcard = true;
            document.getElementById("properties").classList.add("expanded");
            document.getElementById("propwrap").classList.add("itson");
            tempblock.classList.add("selectedblock");
       } 
    }
}
addEventListener("mousedown", beginTouch, false);
addEventListener("mousemove", checkTouch, false);
addEventListener("mouseup", doneTouch, false);
addEventListenerMulti("touchstart", beginTouch, false, ".block");
});
