import "interact"
import * as InteractiveSettings from "interactivesettings"

export default class Element {
  constructor(id, name, children, parent, isArray, setRelation) {
    this.id = id
    this.name = id;
    this.isArray = isArray;
    this.children = [];
    this.parent = null;
    this.position = {
      x: 0,
      y: 0
    };
    this.layer = 0
    this.attributes = new Map();
    if (children) {
      this.children = children
      child.setParent(this);
    }

    if (parent) {
      this.parent = parent;
      parent.addChild(this);

    }

    InteractiveSettings.setDraggable(id, this.position, this.children);
    InteractiveSettings.setResizable(id);
    InteractiveSettings.setDropzone(id, setRelation);
  }

  setLayer(layer) {
    this.layer = layer
  }

  setAttributes(attributes) {
    this.attributes = attributes;
  }
  
  addAttribute(key, value) {
    this.attributes.set(key, value);
  }

  getLayer() {
    return this.layer;
  }

  getJSON() {
    if(this.getAttributesJSON() == null && this.getChildrenJSON() == null) {
      return '"'+this.name +'": null';
    }
    return '"'+this.name +'": {' +
      this.getAttributesJSON() + 
      this.getChildrenJSON() +
    '}';
  }

  getAttributesJSON() {
    let result = '';
    console.log(this.attributes.size)
    if(this.attributes.size == 0) {
      return result
    }
    this.attributes.forEach((key, val) => {
      result += '"' + key + '": ' + '"' + val + '",'
    })
    return result.slice(0, -1);
  }

  getChildrenJSON() {
    let res = "";
    if(this.children.length == 0) {
      return res;
    }
    this.children.forEach(child => {
      res += child.getJSON() + ',';
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

}
