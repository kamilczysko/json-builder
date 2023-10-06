import Schema from "schema"

const schema = new Schema();

function add() {
    schema.addElement("test", null, null, false);
}

document.getElementById("addButton").onclick = () => {
    add();
}

document.getElementById("removeButton").onclick = () => {
    schema.deleteSelectedElement();
}

document.getElementById("generate").onclick = () => {
    if (schema.hasElements()) {
        document.getElementById("textarea").value = JSON.stringify(JSON.parse("{" + schema.getMainElement().getJSON() + "}"), null, 5);
    } else {
        document.getElementById("textarea").value = "{}";
    }
}