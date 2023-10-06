import Schema from "schema"

const schema = new Schema();

function add() {
    schema.addElement({x:0, y:0}, null, null, false);
}

document.getElementById("addButton").onclick = () => {
    add();
}

document.getElementById("removeButton").onclick = () => {
    schema.deleteSelectedElement();
}

document.getElementById("generate").onclick = () => {
    console.log(schema.getMainElement().getJSON())
    if (schema.hasElements()) {
        document.getElementById("textarea").value = JSON.stringify(JSON.parse("{" + schema.getMainElement().getJSON() + "}"), null, 5);
    } else {
        document.getElementById("textarea").value = "{}";
    }
}

document.getElementById("schemaContainer").ondblclick = (event) => {
    const position = {
        x: event.offsetX,
        y: event.offsetY
    }
    schema.addElement(position, null, null, false);

}