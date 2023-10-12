export default class Element {
  constructor(id) {
    this.id = id;
    this.isPrimary = false;
    this.name = null;
    this.children = [];
    this.parent = null;
    this.isSelected = false;
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
      if (this.isNumeric(val)) {
        result += "\"" + key + "\": " + "" + val + ","
      } else {
        result += "\"" + key + "\": " + "\"" + val + "\","
      }
    })
    return result.slice(0, -1);
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

  isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

}
