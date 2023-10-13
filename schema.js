import ElementGUI from "elementGUI";
import "interact"

export default class Schema {
  constructor() {
    this.elements = new Map();
    this.selectedElementId = null;
    this.currentId = 0;
    this.setMainContainer();
  }

  createSchemaFromJSON(text) {
    try {
      const json = JSON.parse(text);
      document.getElementById("textarea").value = JSON.stringify(json, null, 5)
    } catch {

    }
  }

  setMainContainer() {
    interact("#schemaContainer").dropzone({
      ondrop: (event) => {
        const toRemove = this.elements.get(event.relatedTarget.id);
        if (toRemove.getElement().getParent()) {
          const parentId = toRemove.getElement().getParent().getId();
          this.elements.get(parentId).deleteChild(toRemove);
        }
      }
    })
  }

  addElementToParent(parentId) { // merge with methodd below
    const newId = "element-" + this.currentId;
    const element = new ElementGUI(newId, newId, { x: 0, y: 0 });
    element.setOnSelect(() => this.selectElement(newId));
    element.setOnChange(() => {
      this.updateJSON();
      // ;
    });
    element.setOnTypeChange(() => this.updateElementTypeData());
    element.setChildProvider((childId) => this.getChildElement(childId));
    element.setOnAddChild((parentId) => this.addElementToParent(parentId));
    element.setOnDelete(() => this.removeElement(element.getId()))

    if (this.currentId == 0 || this.elements.length == 0) { //todo set primary first element with lowest layer or if even layers with more children
      element.getElement().setPrimary(true);
    }
    this.elements.set(newId, element);
    this.elements.get(parentId).addChild(element);
    this.currentId++;
    return element;
  }

  addElement(position) {
    const newId = "element-" + this.currentId;
    const element = new ElementGUI(newId, newId, position);
    element.setOnSelect(() => this.selectElement(newId));
    element.setOnChange(() => {
      this.updateJSON();
    });
    element.setOnTypeChange(() => this.updateElementTypeData());
    element.setChildProvider((childId) => this.getChildElement(childId));
    element.setOnAddChild((parentId) => this.addElementToParent(parentId));
    element.setOnDelete(() => this.removeElement(element.getId()))

    if (this.currentId == 0 || this.elements.length == 0) { //todo set primary first element with lowest layer or if even layers with more children
      element.getElement().setPrimary(true);
    }
    this.elements.set(newId, element);

    document.getElementById("schemaContainer").appendChild(element.getElementGraphical());

    this.currentId++;
    this.updateJSON();
  }

  getChildElement(childId) {
    return this.elements.get(childId);
  }

  selectElement(id) {
    Array.from(this.elements.values()).forEach(element => {
      if (element.getId() != id) {
        element.setSelected(false);
      }
    })
    this.selectedElementId = id;
    document.getElementById("addAttribute").style.display = "block"
    this.updateElementTypeData();
  }

  getMainElement() {
    const primaryItems = Array.from(this.elements.values()).filter(element => element.getElement().getIsPrimary())
    if (primaryItems.length > 0) {
      return primaryItems[0]
    }
    if(Array.from(this.elements.values()).length == 1) {
      Array.from(this.elements.values())[0].getElement().setPrimary(true);
      return Array.from(this.elements.values())[0]
    }
    return null;
  }

  updateElementTypeData() {
    const actualElement = this.elements.get(this.selectedElementId);
    document.getElementById("attributes").innerHTML = null;
    if(actualElement == null) {
      return;
    }
    if (actualElement.getElement().isArray) {
      this.setListOnView(this.selectedElementId);
      document.getElementById("addAttribute").onclick = () => {
        actualElement.addToList("")
        this.addListToView(actualElement, "", actualElement.getElement().getList().length - 1);
      };
    } else {
      this.setAttributesOnView(this.selectedElementId);
      document.getElementById("addAttribute").onclick = () => {
        this.addAttributesToView(actualElement, "", "");
      };
    }
  }

  setListOnView(elementId) {
    const element = this.elements.get(elementId);
    element.getElement().getList().forEach((value, index) => {
      this.addListToView(element, value, index);
    })
  }

  setAttributesOnView(elementId) {
    const element = this.elements.get(elementId);
    element.getElement().getAttributes().forEach((value, key) => {
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
    valueInput.oninput = () => {
      element.setAttribute(keyInput.value, valueInput.value);
    }
    valueInput.onkeydown = (ev) => {
      if (ev.key === "Enter") {
        ev.preventDefault();
        this.addAttributesToView(element, "", "");
      }
    }
    const removeButton = document.createElement("button");
    removeButton.innerText = "remove";
    removeButton.onclick = () => {
      element.deleteAttribute(keyInput.value);
      document.getElementById("attributes").removeChild(attribute);
    }

    attribute.appendChild(keyLabel);
    attribute.appendChild(keyInput);
    attribute.appendChild(valueLabel);
    attribute.appendChild(valueInput);
    attribute.appendChild(removeButton);
    document.getElementById("attributes").appendChild(attribute);
    keyInput.select();
  }

  addListToView(element, value, index) {
    const attribute = document.createElement("div");
    attribute.classList.add("attribute");
    const valueLabel = document.createElement("span");
    valueLabel.innerText = "value: ";
    const valueInput = document.createElement("input");
    valueInput.type = "text";
    valueInput.value = value;
    valueInput.oninput = () => {
      element.editInList(valueInput.value, index);
    }
    valueInput.onkeydown = (ev) => {
      if (ev.key === "Enter") {
        ev.preventDefault();
        element.addToList("")
        this.addListToView(element, "", element.getElement().getList().length - 1);
      }
    }
    const removeButton = document.createElement("button");
    removeButton.innerText = "remove";
    removeButton.onclick = () => {
      element.removeFromList(valueInput.value);
      this.updateElementTypeData();
    }

    attribute.appendChild(valueLabel);
    attribute.appendChild(valueInput);
    attribute.appendChild(removeButton);
    document.getElementById("attributes").appendChild(attribute);
    valueInput.select();
  }
  reloadList() {
    document.getElementById("attributes").innerHTML = null;
    this.setListOnView(this.selectedElementId);
  }

  updateJSON() {
    const mainElement = this.getMainElement()
    let json = null
    if (mainElement) {
      json = JSON.stringify(JSON.parse("{" + mainElement.getElement().getJSON() + "}"), null, 5)
    }
    document.getElementById("textarea").value = json;
  }

  removeElement(id) {
    const elementToRemove = this.elements.get(id);
    if (elementToRemove.getElement().getParent()) {
      const parent = this.elements.get(elementToRemove.getElement().getParent().getId());
      parent.removePermament(elementToRemove);
    }
    this.elements.delete(id);
    this.selectedElementId = null;
  }
}
