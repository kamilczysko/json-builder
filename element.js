export default class Element {
  constructor(id) {
    this.id = id;
    this.isPrimary = false;
    this.name = null;
    this.children = new Map();
    this.parent = null;
    this.isArray = false;
    this.layer = 0;
    this.attributes = new Map();
    this.list = [];
  }

  addChild(child) {
    this.children.set(child.getId(), child);
    child.setParent(this);
    child.setPrimary(false);
    child.setLayer(this.layer + 1);
  }

  setParent(parent) {
    if (this.parent && this.parent.getId() != parent.getId()) {
      this.parent.removeChild(this.id);
    }
    this.parent = parent;
    this.setLayer(this.parent.getLayer + 1)
  }

  setPrimary(isPrimary) {
    this.isPrimary = isPrimary;
  }

  getIsPrimary() {
    return this.isPrimary;
  }

  getId() {
    return this.id;
  }
   
  removeChild(id) {
    this.children.delete(id)
  }

  setLayer(layerNumber) {
    this.layer = layerNumber;
  }

  getParent() {
    return this.parent;
  }

  setName(name) {
    this.name = name;
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

  removeFromList(value) {
    const index = this.list.indexOf(value);
    this.list.splice(index, 1);
  }

  editInList(idx, value) {
    this.list[idx] = value;
  }

  getList() {
    return this.list;
  }

  setIsArray(isArray) {
    this.isArray = isArray;
  }

  hasChildren() {
    return this.children.size > 0;
  }

  getJSON() {
    if (this.isArray) {
      let result = "";
      this.list.forEach(value => {
        if (this.isNumeric(value)) {
          result += value + ",";
        } else {
          result += "\"" + value + "\",";
        }
      })
      return "\"" + this.name + "\":[" + result.slice(0, -1) + "]";
    }
    if (this.getAttributesJSON() == null && this.getChildrenJSON() == null) {
      return "\"" + this.name + "\": null";
    }
    let attrs = this.getAttributesJSON() != null ? this.getAttributesJSON() : null
    let childs = this.getChildrenJSON() != null ? this.getChildrenJSON() : null
    if (attrs && childs) {
      return '"' + this.name + "\": {" +
        attrs + "," +
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

  getJSONAsArrayItem() { //return as json 
    if (this.getAttributesJSON() == null && this.getChildrenJSON() == null) {
      return "null";
    }
    let attrs = this.getAttributesJSON() != null ? this.getAttributesJSON() : ""
    let childs = this.getChildrenJSON() != null ? ", " + this.getChildrenJSON() : ""
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
      if (this.isNumeric(val)) {
        result += "\"" + key + "\": " + "" + val + ","
      } else {
        result += "\"" + key + "\": " + "\"" + val + "\","
      }
    })
    return result.slice(0, -1);
  }

  getChildrenJSON() {
    if (this.children.size == 0) {
      return null;
    }
    let res = "";
    Array.from(this.children.values()).forEach(child => {
      res += child.getJSON() + ",";
    })
    return res.slice(0, -1);
  }

  isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

}
