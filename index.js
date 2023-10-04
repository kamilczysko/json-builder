import Schema from "schema"

const schema = new Schema();

function add(){ 
    schema.addElement("test", null, null, false);
}

document.getElementById("addButton").onclick = () => {
    add();
}


document.getElementById("generate").onclick = () => {
    console.log("{"+schema.getMainElement().getJSON()+"}");
}
