import Element from "element"
import "interact"

export default class Schema {
  constructor() {
    this.elements = new Map();
    this.selectedElementId = null;
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
    const element = new Element(newId, name, parent, children, isArray, (parentId, childId) => { this.setRelation(parentId, childId) });
    this.elements.set(newId, element);
    element.onClick(() => this.selectElement(newId))
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

  relationExistsAlready(parentId, childId) {
    const childWithId = this.elements.get(parentId).children.filter(element => element.id == childId).length
    return childWithId > 0
  }

  selectElement(id) {
    this.selectedElementId = null;
    this.elements.forEach((element, key) => {
      element.select(false);
      if (key == id) {
        this.selectedElementId = id;
        element.select(true);
        document.getElementById("addAttribute").style.display = "block"
        document.getElementById("attributes").innerHTML = null;
        this.setAttributesOnView(id);
        document.getElementById("addAttribute").onclick = () => {
          this.addAttributeToView(element, "", "");
        };
      }
    })
  }

  setAttributesOnView(elementId) {
    const element = this.elements.get(elementId);
    const attributes = element.getAttributes();
    attributes.forEach((value, key) => {
      this.addAttributeToView(element, key, value);
    })
  }

  addAttributeToView(element, key, value) {
    const attribute = document.createElement("div");
    attribute.classList.add("attribute");
    const keyLabel = document.createElement("span");
    keyLabel.innerText = "key: ";
    const valueLabel = document.createElement("span");
    valueLabel.innerText = "value: ";
    const keyInput = document.createElement("input");
    keyInput.value = key;
    keyInput.type = "text";
    const valueInput = document.createElement("input");
    valueInput.type = "text";
    valueInput.value = value;
    valueInput.onchange = () => {
      element.addAttribute(keyInput.value, valueInput.value)
    }
    const removeButton = document.createElement("button");
    removeButton.innerText = "remove";
    removeButton.onclick = () => {
        element.removeAttribute(key);
        document.getElementById("attributes").removeChild(attribute);
    }

    attribute.appendChild(keyLabel);
    attribute.appendChild(keyInput);
    attribute.appendChild(valueLabel);
    attribute.appendChild(valueInput);
    attribute.appendChild(removeButton);
    document.getElementById("attributes").appendChild(attribute);
}
}
