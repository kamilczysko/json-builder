import Element from "element"
import "interact"

export default class Schema {
  constructor() {
    this.elements = new Map();
    this.actualId = 0;

    this.setMainContainer((childId) => this.evictChild(childId));
  }

  getMainElement() {
    return this.elements.get("element-0");
  }

  setMainContainer(evictChild) {
    interact("#schemaContainer").dropzone({
      ondrop: (event) => {
        evictChild(event.relatedTarget.id);
      }
    })
  }

  addElement(name, parent, children, isArray) {
    const newId = "element-" + this.actualId;
    this.setItemOnView(newId);

    this.elements.set(newId, new Element(newId, name, parent, children, isArray, (parentId, childId) => { this.setRelation(parentId, childId) }));
    this.actualId++;
  }

  setRelation(parentId, childId) {
    if (this.relationExistsAlready(parentId, childId)) {
      return;
    }
    this.removeFromPreviousParent(childId);
    this.elements.get(parentId).addChild(this.elements.get(childId))
    this.elements.get(childId).setParent(this.elements.get(parentId))
    console.log(this.elements.get(parentId))
  }

  removeFromPreviousParent(childId) {
    const previousParent = this.elements.get(childId).parent;
    if (previousParent) {
      this.elements.get(previousParent.id).evictChild(childId);
    }
  }

  evictChild(childId) {
    const parent = this.elements.get(childId).parent
    if (parent == null) {
      return;
    }
    parent.evictChild(childId);
    this.elements.get(childId).setParent(null);
  }

  setItemOnView(id) {
    let mainElement = document.createElement("div");
    mainElement.className = `element`;
    mainElement.id = id;

    let inputDiv = document.createElement("div");
    inputDiv.className = `flex gap-2 px-2`;

    let inputName = document.createElement("input");
    inputName.value = id
    inputName.type = "text"
    inputName.className = `element input`

    let inputArrray = document.createElement("input");
    inputArrray.type = "checkbox"

    inputDiv.appendChild(inputName);
    inputDiv.appendChild(inputArrray);

    let drop = document.createElement("div");
    drop.className = `element drop`;
    drop.id = id+"-drop";

    mainElement.appendChild(inputDiv);
    mainElement.appendChild(drop);

    document.getElementById("schemaContainer").appendChild(mainElement)
  }

  relationExistsAlready(parentId, childId) {
    const childWithId = this.elements.get(parentId).children.filter(element => element.id == childId).length
    return childWithId > 0
  }
}
