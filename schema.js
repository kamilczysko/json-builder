import ElementGUI from "elementGUI";
import "interact"

let fromJSON = false;

export default class Schema {
  constructor() {
    this.elements = new Map();
    this.selectedElementId = null;
    this.currentId = 0;
    this.setMainContainer();

    this.setOnCopyAction();
  }

  setOnCopyAction() {
    let ctrlDown = false;
    let copiedElement = null;
    document.body.onkeydown = (ev) => {
      if (ev.key == "Control" || ev.key == "Meta") {
        ctrlDown = true;
      }

      if (ev.key == "c" && ctrlDown) {
        copiedElement = this.elements.get(this.selectedElementId);
      } else if (ev.key == "v" && ctrlDown) {

        if (copiedElement) {
          const newElement = copiedElement.clone();
          const parent = this.elements.get(this.selectedElementId);
          parent.addChild(newElement);
          this.elements.set(newElement.getId(), newElement);
        }
      }
    }

    document.body.onkeyup = (ev) => {
      if (ev.key == "Control" || ev.key == "Meta") {
        ctrlDown = false;
      }
    };
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

  createElement(position = { x: 0, y: 0 }) {
    const newId = "element-" + this.currentId;
    const element = new ElementGUI(newId, newId, position);
    element.setOnSelect((id) => this.selectElement(id));
    element.setOnChange(() => { this.updateJSON(); });
    element.setOnTypeChange(() => this.updateElementTypeData());
    element.setChildProvider((childId) => this.getChildElement(childId));
    element.setOnAddChild((parentId) => this.addElementToParent(parentId));
    element.setOnDelete((id) => this.removeElement(id));
    element.setOnCopy((id, element) => {
      this.elements.set(id, element);
    });
    element.setGlobalId(() => {
      const newId = this.currentId;
      this.currentId++;
      return newId;
    })

    element.setParentProvider((id) => { return this.elements.get(id) })

    if (this.currentId == 0 || this.elements.length == 0) {
      element.setPrimary(true);
    }
    this.elements.set(newId, element);
    this.currentId++;
    return element;
  }

  addElementToParent(parentId) {
    const element = this.createElement();
    this.elements.get(parentId).addChild(element);
    return element;
  }

  addElement(position) {
    const element = this.createElement(position);
    document.getElementById("schemaContainer").appendChild(element.getElementGraphical());

    this.currentId++;
    this.updateJSON();
  }

  createElementForSchema(name, attributes, list, hasListOfChildren = false) {
    const newId = "element-" + this.currentId;
    const newElement = new ElementGUI(newId, name, { x: 0, y: 0 });

    newElement.getElement().setList([...list]);
    newElement.getElement().setAttributes(structuredClone(attributes));
    const isArray = list != null && list.length > 0;
    newElement.setIsArray(isArray || hasListOfChildren)

    newElement.setOnSelect((id) => this.selectElement(id));
    newElement.setOnChange(() => {
      this.updateJSON();
    });
    newElement.setOnTypeChange(() => this.updateElementTypeData());
    newElement.setChildProvider((childId) => this.getChildElement(childId));
    newElement.setOnAddChild((parentId) => this.addElementToParent(parentId));
    newElement.setOnDelete((id) => this.removeElement(id));
    newElement.setOnCopy((id, element) => {
      this.elements.set(id, element);
    });
    newElement.setGlobalId(() => {
      const newId = this.currentId;
      this.currentId++;
      return newId;
    })

    newElement.setParentProvider((id) => { return this.elements.get(id) })

    this.elements.set(newId, newElement);
    this.currentId++;

    return newElement;
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
    document.getElementById("atributePanel").style.display = "block"
    this.updateElementTypeData();
  }

  getMainElement() {
    const primaryItems = Array.from(this.elements.values()).filter(element => element.getElement().getIsPrimary())
    if (primaryItems.length > 0) {
      return primaryItems[0]
    }
    if (Array.from(this.elements.values()).length == 1) {
      Array.from(this.elements.values())[0].getElement().setPrimary(true);
      return Array.from(this.elements.values())[0]
    }
    return null;
  }

  updateElementTypeData() {
    const actualElement = this.elements.get(this.selectedElementId);
    document.getElementById("attributes").innerHTML = null;
    if (actualElement == null) {
      return;
    }
    if (actualElement.getElement().isArray) {
      this.setListOnView(this.selectedElementId);
      document.getElementById("addAttribute").onclick = () => {
        actualElement.addToList("")
        this.addListToView(actualElement, "", actualElement.getElement().getList().length - 1);
      };
      document.getElementById("clearAttributes").onclick = () => {
        actualElement.getElement().setList([]);
        this.updateJSON();
        this.updateElementTypeData();
      };
    } else {
      this.setAttributesOnView(this.selectedElementId);
      document.getElementById("addAttribute").onclick = () => {
        actualElement.setAttribute("", "");
        this.addAttributesToView(actualElement, "", "", actualElement.getElement().getAttributes().length - 1);
      };
      document.getElementById("clearAttributes").onclick = () => {
        actualElement.getElement().setAttributes([]);
        this.updateJSON();
        this.updateElementTypeData();
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
    document.getElementById("attributes").innerHTML = null;
    const element = this.elements.get(elementId);
    element.getElement().getAttributes().forEach((entry, index) => {
      this.addAttributesToView(element, entry.key, entry.value, index);
    })
  }


  addAttributesToView(element, key, value, index) {
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

    keyInput.oninput = () => {
      element.setAttributeByIndex(keyInput.value, valueInput.value, index);
    }
    keyInput.onkeydown = (ev) => {
      if (ev.key === "Enter") {
        ev.preventDefault();
        valueInput.select()
      }
    }
    valueInput.oninput = () => {
      element.setAttributeByIndex(keyInput.value, valueInput.value, index);
    }
    valueInput.onkeydown = (ev) => {
      if (ev.key === "Enter") {
        ev.preventDefault();
        element.setAttribute("", "");
        this.addAttributesToView(element, "", "", index + 1);
      }
    }
    const removeButton = document.createElement("button");
    removeButton.innerText = "remove";
    removeButton.onclick = () => {
      element.deleteAttribute(keyInput.value);
      document.getElementById("attributes").removeChild(attribute);
      this.setAttributesOnView(this.selectedElementId);
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

  updateJSON() {
    if (fromJSON) {
      return; //prevent refreshing when done from json
    }
    const mainElement = this.getMainElement()
    let json = null
    try {
      if (mainElement) {
        // console.log(mainElement.getElement().getJSON())
        json = JSON.stringify(JSON.parse(mainElement.getElement().getJSON()), null, 5)
      }
      document.getElementById("textarea").value = json;
    } catch (error) {
      console.log(error)
    }
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


  /****create from json*****DONT touch****/

  createSchemaFromJSON(text) {
    try {
      fromJSON = true;
      this.elements = new Map();
      document.getElementById("schemaContainer").innerHTML = null;

      const result = this.processObject(JSON.parse(text), null);
      document.getElementById("schemaContainer").appendChild(result.getElementGraphical())
    } catch (error) {
      console.log(error)
    } finally {
      fromJSON = false;
    }
  }

  processObject(object) {
    const mainElement = this.getObject(object, "main");
    mainElement.setPrimary(true);
    return mainElement;
  }

  isObject(value) {
    return typeof value === 'object' &&
      !Array.isArray(value) &&
      value !== null
  }

  isArray(value) {
    return Array.isArray(value) &&
      value !== null
  }

  isStringOrNumber(value) {
    return typeof value == "string" || typeof value == "number"
  }

  getObject(object, name, getAsListElement = false) {
    let listOfChildren = [];
    let list = [];
    let attributes = [];
    let children = [];

    if (object == null) {
      return this.createElementForSchema(name, [], []);
    }

    const objAsMap = new Map(Object.entries(object));
    objAsMap.forEach((value, key) => {
      if (this.isArray(value)) {
        //support also list of objects
        let isArrayWithObjects = Array.from(value).filter(obj => this.isObject(obj)).length > 0;
        if (isArrayWithObjects) {
          listOfChildren.push(this.getObject(value, key, true))
        } else {
          children.push(this.createElementForSchema(key, [], value));
        }
      } else if (this.isStringOrNumber(value)) {
        attributes.push({ key: key, value: value });
      }
      if (this.isObject(value)) { 
        if (this.hasOnlyOneAttribute(object)) {
          Array.from(Object.entries((value))).forEach((v, i) => {
                if(Array.from(Object.values(v)[1]).filter(a => this.isObject(a)).length > 0) {
                  children.push(this.getObject(value, key));
                } else {
                  children.push(this.createElementForSchema(Object.values(v)[0], [], Object.values(v)[1]));
                }
          })
        } else {
        children.push(this.getObject(value, key));
      }
      }
    });
    const newElement = this.createElementForSchema(name, attributes, list, this.isArray(object));
    children.forEach(child => {
      newElement.addChild(child);
    })
    listOfChildren.forEach(child => {
      newElement.addChild(child);
    })
    return newElement;
  }

  hasOnlyOneAttribute(value) {
    let res = true;
    Array.from(Object.values((value))).forEach(val => {
      Array.from(Object.values((val))).forEach(v => {
        if(!this.isArray(v)) {
          res = false
        }
      })
    })
    return res;
  }
}