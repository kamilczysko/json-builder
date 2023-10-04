import Element from "element"
import "interact"

export default class Schema {
  constructor() {
    this.elements = new Map();
    this.actualId = 0;

    this.setMainContainer((childId) => this.evictChild(childId));
  }

  setMainContainer(evictChild) {
    interact("#schemaContainer").dropzone({
      ondrop: (event) => {
        console.log(event.relatedTarget.id)
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
    if(parent == null) {
       return;
    }
    parent.evictChild(childId);
    this.elements.get(childId).setParent(null);
  }

  setItemOnView(id) {
    let e = document.createElement("div");
    e.className = `bg-blue-300 bg-opacity-50 absolute z-0 w-16 h-16 border-b-[1px] border-r-[1px] border-black`;
    e.innerHTML = "test"
    e.id = id;
    document.getElementById("schemaContainer").appendChild(e)
  }

  relationExistsAlready(parentId, childId) {
    const childWithId = this.elements.get(parentId).children.filter(element => element.id == childId).length
    return childWithId > 0
  }
}
