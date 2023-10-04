import "interact"
import * as InteractiveSettings from "interactivesettings"

export default class Element {
  constructor(id, name, children, parent, isArray, setRelation) {
    this.id = id
    this.name = name;
    this.isArray = isArray;
    this.children = [];
    this.parent = null;
    this.position = {
      x: 0,
      y: 0
    };

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

  addChild(child) {
    this.children.push(child)
  }

  setParent(parent) {
    this.parent = parent;
  }

  evictChild(child) {
    const indexToRemove = this.children.findIndex(id => id == child)
    this.children.splice(indexToRemove, 1)
  }

  move(moveX, moveY) {
    this.position.x += moveX;
    this.position.y += moveY;

    document.getElementById(this.id).style.transform = `translate(${this.position.x}px, ${this.position.y}px)`;
    if(this.children.length == 0 || this.children == null) {
      return;
    }
    this.children.forEach((child) => {
      child.move(moveX, moveY);
    });
  }

}
