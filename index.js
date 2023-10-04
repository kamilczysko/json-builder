import Schema from "schema"

const schema = new Schema();

function add(){ 
    schema.addElement("test", null, null, false);
}

document.getElementById("addButton").onclick = () => {
    add();
}

