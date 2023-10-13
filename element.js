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

  getChildren() {
    return this.children;
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

  removeElement() {
    this.parent.removeChild(this.id);
    this.children.forEach(e => {
      e.removeElement();
    })
  }

  getJSON(asArray = false) {
    let namePrefix = "\"" + this.name + "\":";
    if (asArray) {
      namePrefix = "";
    }
    if (this.isArray) {
      if (this.list.length > 0) {
        return "\"" + this.name + "\":[" + this.getSimpleListAsJSON() + "]";
      }
      return "\"" + this.name + "\":[" + this.getChildrenAsJSON(true) + "]";
    } else {
      const attributes = this.getAttributesAsJSON();
      const children = this.getChildrenAsJSON()
      if (attributes && children) {
        return namePrefix + "{" + attributes + "," + children + "}";
      } else if (attributes) {
        return namePrefix + "{" + attributes + "}";
      } else if (children) {
        return namePrefix + "{" + children + "}";
      }

      if (asArray) {
        return null;
      }
      return namePrefix + null;
    }
  }

  getSimpleListAsJSON() {
    let result = ""
    this.list.forEach(element => {
      if (this.isNumeric(element)) {
        result += element + ",";
      } else {
        result += "\"" + element + "\",";
      }
    })
    return result.slice(0, -1);
  }

  getAttributesAsJSON() {
    let result = "";
    this.getAttributes().forEach((value, key) => {
      if (this.isNumeric(value)) {
        result += "\"" + key + "\":" + value + ",";
      } else {
        result += "\"" + key + "\":\"" + value + "\",";
      }
    })
    if (result == "") {
      return null;
    }
    return result.slice(0, -1);
  }

  getChildrenAsJSON(asList = false) {
    let result = "";

    this.children.forEach(child => {
      result += child.getJSON(asList) + ",";
    })

    if (result == "") {
      return null;
    }

    return result.slice(0, -1);
  }

  isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

}
