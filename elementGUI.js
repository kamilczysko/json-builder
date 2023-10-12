import Element from "element"
import * as InteractiveSettings from "interactivesettings"

export default class ElementGUI {
    constructor(id, name, position) {
        this.id = id;
        this.name = name;
        this.position = position;
        this.isSelected = true;
        this.element = new Element(id);
        this.element.setName(name);

        this.onChange = null;
        this.onSelect = null;
        this.provideChild = null;

        const graphicsElements = this.initGraphicalRepresentation(id, position, name);
        this.gui = graphicsElements.main;
        this.drop = graphicsElements.drop;
    }

    initGraphicalRepresentation(id, position, name) {
        let mainElement = document.createElement("div");
        mainElement.className = `element`;
        mainElement.style.zIndex = this.layer;
        mainElement.id = id;
        // mainElement.style.position = "absolute";
        mainElement.style.transform =
            `translate(${position.x}px, ${position.y}px)`;
        mainElement.onclick = () => {
            this.isSelected = !this.isSelected;
            if (this.isSelected) {
                mainElement.classList.add("selected");
            } else {
                mainElement.classList.remove("selected");
            }
            this.onSelect();
        }

        let inputDiv = document.createElement("div");
        inputDiv.className = `elementInput`;

        let inputName = document.createElement("input");
        inputName.type = "text"
        inputName.className = `elementInput input`
        inputName.value = name
        inputName.oninput = () => {
            this.setName(inputName.value);
        }
        inputName.ondblclick = () => {
            event.stopPropagation();
        }

        let arrayInputControl = document.createElement("div");
        arrayInputControl.style.display = "flex"
        arrayInputControl.style.flexDirection = "column"
        arrayInputControl.style.gap = "0";
        arrayInputControl.style.minWidth = "50px";

        let inputArrray = document.createElement("input");
        inputArrray.type = "checkbox"
        inputArrray.oninput = () => {
            this.element.setIsArray(inputArrray.checked == true);
            this.onChange();
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

        InteractiveSettings.setDraggable(id, this.position, this.children);
        InteractiveSettings.setResizable(id);
        InteractiveSettings.setDropzone(id, (childId) => {
            const child = this.provideChild(childId);
            this.addChild(child);
            child.getElementGraphical().style.position = "relative";
            this.onChange();
        });

        return { main: mainElement, drop: drop };
    }

    getId() {
        return this.id;
    }

    getElementGraphical() {
        return this.gui;
    }

    addChild(child) {
        this.element.addChild(child.getElement());
        this.drop.appendChild(child.getElementGraphical())
        child.getElementGraphical().style.position = "block"
        this.drop.classList.add("parent")
        this.onChange();
    }

    deleteChild(child) {
        this.element.removeChild(child.getElement().getId());
        if (this.element.hasChildren()) {
            this.drop.classList.remove("parent")
        }
        this.gui.removeChild(child.getElementGraphical());
        document.getElementById("schemaContainer").appendChild(child.getElementGraphical())
        this.onChange();
    }

    setName(name) {
        this.name = name;
        this.element.setName(name);
        this.onChange();
    }

    setPosition(position) {
        this.position = position;
    }

    getElement() {
        return this.element;
    }

    setSelected(selected) {
        this.gui.classList.remove("selected");
        this.isSelected = selected;
    }

    setOnSelect(onSelect) {
        this.onSelect = onSelect;
    }

    setOnChange(onChange) {
        this.onChange = onChange;
    }

    setChildProvider(provideChild) {
        this.provideChild = provideChild;
    }

    getJSON() {
        return this.element.getJSON();
    }

    setAttribute(key, value) {
        this.element.setAttribute(key, value);
        this.onChange();
    }

    addToList(item) {
        this.element.addToList(item);
        this.onChange();
    }

    removeFromList(value) {
        this.element.removeFromList(value);
        this.onChange();
    }

    editInList(value, index) {
        this.element.editInList(index, value);
        this.onChange();
    }

    deleteAttribute(key) {
        this.element.deleteAttribute(key);
        this.onChange();
    }
}