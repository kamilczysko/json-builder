import "interact"
import "elementGUI"
import * as InteractiveSettings from "interactivesettings"

export default class Element {
  constructor(id) {
    this.id = id;
    this.isPrimary = false;
    this.name = null;
    this.children = [];
    this.parent = null;
    this.isSelected = false;
    this.position = position;
    this.layer = 0;
    this.attributes = new Map();
    this.isArray = false;
    this.list = [];
  }

  addChild(child) {
    this.children.push(child);
    child.setParent(this);
    child.setPrimary(false);
    child.setLayer(this.layer + 1);
  }

  setPosition(position) {
    this.position = position;
  }

  getPosition() {
    return this.position;
  }
  
  setParent(parent) {
    this.parent = parent;
  }

  setPrimary(isPrimary) {
    this.isPrimary = isPrimary;
  }

  removeChild(id) {
    this.children.filter(child => child.id == id).forEach(child => { //remove parent new parent is not set yet 
      if (child.getParent().getId() == this.id) {
        child.setParent(null);
      }
    })
    this.children = this.children.filter(child => child.id != id)
  }

  setLayer(layerNumber) {
    this.layer = layerNumber;
  }

  setSelected(selection) {
    this.isSelected = selection;
  }

  getAttributes() {
    return this.attributes;
  }

  getAttribute(key) {
    return this.attributes.get(key);
  }

  setAttributes(attributes) {
    this.attributes = attributes;
  }

  setAttribute(key, value) {
    this.attributes.set(key, value)
  }

  deleteAttribute(key) {
    this.attributes.delete(key);
  }

  setList(list) {
    this.list = list;
  }

  addToList(data) {
    this.list.push(data);
  }

  removeFromList(index) {
    this.list = this.list.splice(index);
  }

  editInList(idx, value) {
    this.list[idx] = value;
  }

  getList() {
    return this.list;
  }

}
