import "interact"
import * as InteractiveSettings from "interactivesettings"

export default class Element {
  constructor(id, name, children, parent, isArray, setRelation) {
    this.id = id
    this.name = id;
    this.isArray = isArray;
    this.children = [];
    this.parent = null;
    this.isSelected = false;
    this.position = {
      x: 0,
      y: 0
    };
    this.layer = 0
    this.attributes = new Map();
    this.list = []
    if (children) {
      this.children = children
      child.setParent(this);
    }

    if (parent) {
      this.parent = parent;
      parent.addChild(this);

    }
    this.setItemOnView(id);
    InteractiveSettings.setDraggable(id, this.position, this.children);
    InteractiveSettings.setResizable(id);
    InteractiveSettings.setDropzone(id, setRelation);

  }

  select(selection) {
    this.isSelected = selection;
    if (selection) {
      document.getElementById(this.id).classList.add("selected");
    } else {
      document.getElementById(this.id).classList.remove("selected")
    }
  }

  addToList(value) {
    this.list.push(value)
  }

  setLayer(layer) {
    this.layer = layer
  }

  setName(name) {
    this.name = name;
  }

  setAttributes(attributes) {
    this.attributes = attributes;
  }

  addAttribute(key, value) {
    this.attributes.set(key, value);
  }

  getAttributes() {
    return this.attributes;
  }

  removeAttribute(key) {
    this.attributes.delete(key);
  }

  getLayer() {
    return this.layer;
  }

  getJSON() {
    if (this.isArray) {
      if (this.children.length > 0) {
        console.log(this.children.map(c => c.getJSONAsArrayItem()).toString())
        return "\"" + this.name + "\":[" + this.children.map(c => c.getJSONAsArrayItem()).toString() + "]"
      }
      return "\"" + this.name + "\": [" + this.list + "]"
    }
    if (this.getAttributesJSON() == null && this.getChildrenJSON() == null) {
      // return null;
      return "\"" + this.name + "\": null";
    }
    let attrs = this.getAttributesJSON() != null ? this.getAttributesJSON() : null
    let childs = this.getChildrenJSON() != null ? this.getChildrenJSON() : null
    if (attrs && childs) {
      return '"' + this.name + "\": {" +
        attrs + ","+
        childs +
        "}";
    } else if (attrs) {
      return '"' + this.name + "\": {" +
        attrs +
        "}";
    }
    else {
      return '"' + this.name + "\": {" +
        childs +
        "}";
    }
  }

getJSONAsArrayItem() {
  if (this.getAttributesJSON() == null && this.getChildrenJSON() == null) {
    return "null";
  }
  let attrs = this.getAttributesJSON() != null ? this.getAttributesJSON() : ""
  let childs = this.getChildrenJSON() != null ? ", " + this.getChildrenJSON() : ""
  console.log("childs:" + childs)
  return "{" +
    attrs +
    childs +
    "}";
}

getAttributesJSON() {
  if (this.attributes.size == 0) {
    return null;
  }
  let result = "";
  this.attributes.forEach((val, key) => {
    if(this.isNumeric(val)) {
      result += "\t\"" + key + "\": " + "" + val + ","
    } else {
      result += "\t\"" + key + "\": " + "\"" + val + "\","
    }
  })
  return result.slice(0, -1);
}

isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

getChildrenJSON() {
  if (this.children.length == 0) {
    return null;
  }
  let res = "";
  this.children.forEach(child => {
    res += child.getJSON() + ",";
  })
  return res.slice(0, -1);
}

addChild(child) {
  child.setLayer(this.layer + 1)
  this.children.push(child)
}

getName() {
  return this.name;
}

setParent(parent) {
  this.parent = parent;
  if (parent == null) {
    this.setLayer(0);
  } else {
    this.setLayer(parent.getLayer() + 1);
  }

}

evictChild(child) {
  const indexToRemove = this.children.findIndex(id => id == child);
  this.children.splice(indexToRemove, 1);
}

delete() {
  if(this.parent) {
    this.parent.evictChild(this.id);
  }
  this.children.forEach(child => {
    child.delete();
  })
  const self = document.getElementById(this.id);
  document.getElementById("schemaContainer").removeChild(self);
}

move(moveX, moveY) {
  this.position.x += moveX;
  this.position.y += moveY;

  document.getElementById(this.id).style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
  if (this.children.length == 0 || this.children == null) {
    return;
  }
  this.children.forEach((child) => {
    child.move(moveX, moveY);
  });
}

setItemOnView(id) {
  let mainElement = document.createElement("div");
  mainElement.className = `element`;
  mainElement.id = id;

  let inputDiv = document.createElement("div");
  inputDiv.className = `elementInput`;

  let inputName = document.createElement("input");
  inputName.value = id
  inputName.type = "text"
  inputName.className = `element input`
  inputName.oninput = () => { this.setName(inputName.value) }

  let arrayInputControl = document.createElement("div");
  let inputArrray = document.createElement("input");
  inputArrray.type = "checkbox"
  inputArrray.onchange = () => {
    this.isArray = inputArrray.checked;
  }
  let label = document.createElement("p");
  label.style.fontWeight = "100"
  label.innerHTML = "array"
  arrayInputControl.appendChild(inputArrray);
  // arrayInputControl.appendChild(label);

  inputDiv.appendChild(inputName);
  inputDiv.appendChild(arrayInputControl);

  let drop = document.createElement("div");
  drop.className = `element drop`;
  drop.id = id + "-drop";

  mainElement.appendChild(inputDiv);
  mainElement.appendChild(drop);

  document.getElementById("schemaContainer").appendChild(mainElement)
}

onClick(action) {
  document.getElementById(this.id).onmousedown = () => action()
}

}
