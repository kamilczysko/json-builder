import Schema from "schema"

const schema = new Schema();

document.getElementById("schemaContainer").ondblclick = (event) => {
    const position = {
        x: event.offsetX,
        y: event.offsetY
    }
    schema.addElement(position, null, null, false);
}

document.getElementById("textarea").oninput = () => {
    schema.createSchemaFromJSON(document.getElementById("textarea").value);
}

let isJSONSchemaContainerVisible = true;

document.getElementById("json-container-show-button").onclick = () => {
    if(isJSONSchemaContainerVisible) {
        isJSONSchemaContainerVisible = false;
        document.getElementById("json-panel").classList.remove("visible");
        document.getElementById("json-panel").classList.add("hidden");
    } else {
        isJSONSchemaContainerVisible = true;
        document.getElementById("json-panel").classList.remove("hidden");
        document.getElementById("json-panel").classList.add("visible");
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