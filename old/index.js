import Schema from "schema"

const schema = new Schema();

function add(){ 
    schema.addElement("test", null, null, false);
}

document.getElementById("addButton").onclick = () => {
    add();
}


document.getElementById("generate").onclick = () => {
    document.getElementById("textarea").value = JSON.stringify(JSON.parse("{"+schema.getMainElement().getJSON()+"}"),null,2);  
}
