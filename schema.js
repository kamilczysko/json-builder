import ElementGUI from "elementGUI";
import "interact"

export default class Schema {
  constructor() {
    this.elements = new Map();
    this.selectedElementId = null;
    this.currentId = 0;
  }

  createSchemaFromJSON(text) {
    try {
      const json = JSON.parse(text);
      // const map = new Map(Object.entries(json));
      document.getElementById("textarea").value = JSON.stringify(json, null, 5)
    } catch {

    }
  }

  addElement() {
    const newId = "element-" + this.currentId;
    const element = new ElementGUI(newId, newId, { x: 0, y: 0 });
    element.setOnSelect(() => this.selectElement(newId));
    element.setOnChange(() => this.updateJSON());
    element.setChildProvider((childId) => this.getChildElement(childId))

    if (this.currentId == 0) { //todo set primary first element with lowest layer or if even layers with more children
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
  }

  getMainElement() {
    const primaryItems = Array.from(this.elements.values()).filter(element => element.getElement().getIsPrimary())
    if (primaryItems.length > 0) {
      return primaryItems[0]
    }
    return null;
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
      element.addAttribute(keyInput.value, valueInput.value);
      this.updateJSON();
    }
    const removeButton = document.createElement("button");
    removeButton.innerText = "remove";
    removeButton.onclick = () => {
      element.removeAttribute(keyInput.value);
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
    valueInput.oninput = () => {
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
    const mainElement = this.getMainElement()
    let json = null
    if (mainElement) {
      json = JSON.stringify(JSON.parse("{" + mainElement.getElement().getJSON() + "}"), null, 5)
    }
    document.getElementById("textarea").value = json;
  }
}
