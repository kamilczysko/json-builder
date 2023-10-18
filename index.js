import Schema from "schema"


const schema = new Schema();


let foundItems = []
let actualSelectedIndex = 0

document.getElementById("search").oninput = (event) => {
    search();
}

document.getElementById("search").onkeydown = (event) => {
    if(event.key != "Enter") {return}
    search()
}

function search() {
    actualSelectedIndex = 0;
    foundItems = []
    if(document.getElementById("search").value == "") {
        document.getElementById("foundInfo").innerText = ""
        return
    }
    document.getElementById("foundInfo").innerText = ""
    foundItems = schema.findByName(document.getElementById("search").value);
    if(foundItems.length > 0){
        document.getElementById("foundInfo").innerText = "" + (actualSelectedIndex+1) + "/" + (foundItems.length)
    }
}

document.getElementById("nextButton").onclick = () => {
    if(foundItems.length == 0) {
        return
    }
    actualSelectedIndex = ((++actualSelectedIndex) + foundItems.length) % foundItems.length
    selectFoundElement();
}

document.getElementById("prevButton").onclick = () => {
    if(foundItems.length == 0) {
        return
    }
    if(actualSelectedIndex == 0) {
        actualSelectedIndex = foundItems.length - 1;
    } else {
        actualSelectedIndex --;
    }
    document.getElementById("foundInfo").innerText = "" + (actualSelectedIndex+1) + "/" + (foundItems.length)
    selectFoundElement();
}

function selectFoundElement() {
    document.getElementById("foundInfo").innerText = "" + (actualSelectedIndex+1) + "/" + (foundItems.length)
    const actualId = foundItems[actualSelectedIndex].getId();
    document.getElementById(actualId).scrollIntoView();
    foundItems[actualSelectedIndex].select(true);
}

document.getElementById("schemaContainer").ondblclick = (event) => {
    const position = {
        x: event.offsetX,
        y: event.offsetY
    }
    schema.addElement(position, null, null, false);
}

document.getElementById("textarea").oninput = (event) => {
    try {
        schema.createSchemaFromJSON(document.getElementById("textarea").value);
        document.getElementById("textarea").classList.remove("error")
    } catch (error) {
        console.log(error)
        document.getElementById("textarea").classList.add("error")
    }
}

document.getElementById("textarea").onblur = (event) => {
    const json = document.getElementById("textarea").value;
    console.log(json)
    if(json==null || json == "") {return;}
    // console.log(JSON.stringify(JSON.parse(json), null, 5))
    document.getElementById("textarea").value = JSON.stringify(JSON.parse(json), null, 5);
    event.preventDefault();
}


let isJSONSchemaContainerVisible = true;

document.getElementById("json-container-show-button").onclick = () => {
    if (isJSONSchemaContainerVisible) {
        isJSONSchemaContainerVisible = false;
        document.getElementById("control-panel").classList.remove("visible");
        document.getElementById("control-panel").classList.add("hidden");
        // document.getElementById("json-panel").style.position = "absolute"
    } else {
        isJSONSchemaContainerVisible = true;
        document.getElementById("control-panel").classList.remove("hidden");
        document.getElementById("control-panel").classList.add("visible");
        // document.getElementById("json-panel").style.position = "sticky"
    }
}

document.getElementById("copyToClipboardButton").onclick = () => {
    document.getElementById("copyInfo").classList.add("copyInfo-visible");
    document.getElementById("copyInfo").classList.remove("copyInfo-hidden");
    setTimeout(() => {
        document.getElementById("copyInfo").classList.add("copyInfo-hidden");
        document.getElementById("copyInfo").classList.remove("copyInfo-visible");
    }, 500);

    copyToClipboard(document.getElementById("textarea").value);
}

function copyToClipboard(text) {
    console.log(text)
    if (window.clipboardData && window.clipboardData.setData) {
        return window.clipboardData.setData("Text", text);

    }
    else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in Microsoft Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand("copy");  // Security exception may be thrown by some browsers.
        }
        catch (ex) {
            return prompt("Copy to clipboard: Ctrl+C, Enter", text);
        }
        finally {
            document.body.removeChild(textarea);
        }
    }
}