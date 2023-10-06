import Schema from "schema"

const schema = new Schema();

function add(){ 
    schema.addElement("test", null, null, false);
}

document.getElementById("addButton").onclick = () => {
    add();
}

document.getElementById("addAttribute").onclick = () => {
    addAttribute();
}


document.getElementById("generate").onclick = () => {
    document.getElementById("textarea").value = JSON.stringify(JSON.parse("{"+schema.getMainElement().getJSON()+"}"),null,2);  
}

function addAttribute() {
        const attribute = document.createElement("div");
        attribute.classList.add("attribute");
        const keyLabel = document.createElement("span");
        keyLabel.innerText = "key: ";
        const valueLabel = document.createElement("span");
        valueLabel.innerText = "value: ";
        const keyInput = document.createElement("input");
        keyInput.type = "text";
        const valueInput = document.createElement("input");
        valueInput.type = "text";
        const removeButton = document.createElement("button");
        removeButton.innerText = "remove";
        removeButton.onclick = () => {
            document.getElementById("attributes").removeChild(attribute);
        }

        attribute.appendChild(keyLabel);
        attribute.appendChild(keyInput);
        attribute.appendChild(valueLabel);
        attribute.appendChild(valueInput);
        attribute.appendChild(removeButton);

        document.getElementById("attributes").appendChild(attribute);




}