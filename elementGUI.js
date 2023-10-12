import "element"

export default class ElementGUI {
    constructor(id, name, position) {
        this.id = id;
        this.name = name;
        this.position = position;

        this.element = new Element(id);
        this.element.setName = name;
        
        this.gui = this.initGraphicalRepresentation(id, position, name);
    }

    initGraphicalRepresentation(id, position, name) {
        let mainElement = document.createElement("div");
        mainElement.className = `element`;
        mainElement.style.zIndex = this.layer;
        mainElement.id = id;
        mainElement.style.position = "absolute";
        mainElement.style.transform =
          `translate(${position.x}px, ${position.y}px)`;
    
        let inputDiv = document.createElement("div");
        inputDiv.className = `elementInput`;
    
        let inputName = document.createElement("input");
        inputName.type = "text"
        inputName.className = `elementInput input`
        inputName.value = name
        inputName.oninput = () => {
          this.setName(inputName.value);
          this.updateJSON();
        }
        inputName.ondblclick = () => {
          event.stopPropagation();
        }
    
        let arrayInputControl = document.createElement("div");
        arrayInputControl.style.display = "flex"
        arrayInputControl.style.flexDirection = "column"
        arrayInputControl.style.gap = "0";
        arrayInputControl.style.width = "50px";
    
        let inputArrray = document.createElement("input");
        inputArrray.type = "checkbox"
        inputArrray.oninput = () => {
          this.isArray = inputArrray.checked;
          this.updateJSON();
          this.updateElementData();
        }
        let label = document.createElement("span");
        label.style.fontWeight = "100"
        label.style.fontSize = "10px"
        label.innerHTML = "is array"
        arrayInputControl.appendChild(inputArrray);
        arrayInputControl.appendChild(label);
    
        inputDiv.appendChild(inputName);
        inputDiv.appendChild(arrayInputControl);
    
        let drop = document.createElement("div");
        drop.className = `element drop`;
        drop.id = this.id + "-drop";
    
        mainElement.appendChild(inputDiv);
        mainElement.appendChild(drop);
      }

      setName(name) {
        this.name = name;
      }

      setPosition(position) {
        this.position = position;
      }

}