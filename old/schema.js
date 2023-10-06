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

  hasElements() {
    return this.elements.size > 0
  }

  getSelectedElement() {
    return this.elements.get(this.selectedElementId);
  }

  setMainContainer(evictChild) {
    interact("#schemaContainer").dropzone({
      ondrop: (event) => {
        evictChild(event.relatedTarget.id);
      }
    })
  }

  addElement(position, parent, children, isArray) {
    const newId = "element-" + this.actualId;
    const element = new Element(newId, position, parent, children, isArray, (parentId, childId) => { this.setRelation(parentId, childId) }, () => {this.updateJSON()});
    this.elements.set(newId, element);
    element.onClick(() => this.selectElement(newId))
    this.actualId++;
    this.updateJSON();
  }

  deleteSelectedElement() {
    if (this.selectedElementId == null) {
      return;
    }
    this.elements.get(this.selectedElementId).delete();
    this.elements.delete(this.selectedElementId);
    this.selectedElementId = null;
  }

  setRelation(parentId, childId) {
    if (this.relationExistsAlready(parentId, childId)) {
      return;
    }
    this.removeFromPreviousParent(childId);
    this.elements.get(parentId).addChild(this.elements.get(childId))
    this.elements.get(childId).setParent(this.elements.get(parentId))
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
        if (element.isArray) {
          this.setListOnView(id);
          document.getElementById("addAttribute").onclick = () => {
            element.addToList("")
            this.addListToView(element, "", element.getList().length-1);
            this.updateJSON();
          };
        } else {
          this.setAttributesOnView(id);
          document.getElementById("addAttribute").onclick = () => {
            this.addAttributesToView(element, "", "");
            this.updateJSON();
          };
        }
      }
    })
  }

  setListOnView(elementId) {
    const element = this.elements.get(elementId);
    const attributes = element.getList();
    attributes.forEach((value, index) => {
      this.addListToView(element, value, index);
    })
  }

  setAttributesOnView(elementId) {
    const element = this.elements.get(elementId);
    const attributes = element.getAttributes();
    attributes.forEach((value, key) => {
      this.addAttributesToView(element, key, value);
    })
  }

  addAttributesToView(element, key, value) {
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
      element.addAttribute(keyInput.value, valueInput.value);
      this.updateJSON();
    }
    const removeButton = document.createElement("button");
    removeButton.innerText = "remove";
    removeButton.onclick = () => {
      element.removeAttribute(key);
      document.getElementById("attributes").removeChild(attribute);
      this.updateJSON();
    }

    attribute.appendChild(keyLabel);
    attribute.appendChild(keyInput);
    attribute.appendChild(valueLabel);
    attribute.appendChild(valueInput);
    attribute.appendChild(removeButton);
    document.getElementById("attributes").appendChild(attribute);
  }

  addListToView(element, value, index) {
    const attribute = document.createElement("div");
    attribute.classList.add("attribute");
    const valueLabel = document.createElement("span");
    valueLabel.innerText = "value: ";
    const valueInput = document.createElement("input");
    valueInput.type = "text";
    valueInput.value = value;
    valueInput.onchange = () => {
      element.changeOnList(valueInput.value, index);
      this.updateJSON();
    }
    const removeButton = document.createElement("button");
    removeButton.innerText = "remove";
    removeButton.onclick = () => {
      element.removeFromList(valueInput.value);
      document.getElementById("attributes").removeChild(attribute);
      this.reloadList();
      this.updateJSON();
    }

    attribute.appendChild(valueLabel);
    attribute.appendChild(valueInput);
    attribute.appendChild(removeButton);
    document.getElementById("attributes").appendChild(attribute);
  }

  reloadList() {
    document.getElementById("attributes").innerHTML = null;
    this.setListOnView(this.selectedElementId);
  }

  updateJSON() {
    document.getElementById("textarea").value = JSON.stringify(JSON.parse("{" + this.getMainElement().getJSON() + "}"), null, 5);
  }
}
