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
//TODO copy paste
// let savedElement = null;

// document.body.onkeydown = (ev) => {
//     ev = ev || window.event; 
//     var key = ev.which || ev.keyCode;
    
//     //todo FIX WITH CTRL
//     if (key == 86) {
//         schema.addCopiedElement(savedElement);
//     }
//     else if (key == 67) {
//         savedElement = schema.getSelectedElement();
//     }
// }