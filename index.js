import Schema from "schema"
import "interact"

const schema = new Schema();

function add() {
    schema.addElement({ x: 0, y: 0 }, null, null, false);
}

document.getElementById("addButton").onclick = () => {
    add();
}

document.getElementById("removeButton").onclick = () => {
    schema.deleteSelectedElement();
}

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

interact("#schemaContainer").dropzone({
      ondrop: (event) => {
        const toRemove = this.elements.get(event.relatedTarget.id);
        if (toRemove.getElement().getParent()) {
          const parentId = toRemove.getElement().getParent().getId();
          this.elements.get(parentId).deleteChild(toRemove);
        }
      }
    })
  

let savedElement = null;

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