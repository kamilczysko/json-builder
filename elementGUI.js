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

        let elementHeader = document.createElement("div");
        elementHeader.className = `element-header`;

        let topPanel = document.createElement("div");
        topPanel.className = `top-panel`;

        let nameContainer = document.createElement("div");
        nameContainer.className = `name`;

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
        let nameLabel = document.createElement("span");
        nameLabel.innerText = "name: "

        nameContainer.appendChild(nameLabel);
        nameContainer.appendChild(inputName);

        let checkbox = document.createElement("div");
        checkbox.className = `checkbox`;

        let isArrayCheckbox = document.createElement("input");
        isArrayCheckbox.type = "checkbox"
        isArrayCheckbox.oninput = () => {
            this.element.setIsArray(inputArrray.checked == true);
            this.onChange();
        }
        let label = document.createElement("span");
        label.innerText = "is array"

        checkbox.appendChild(isArrayCheckbox);
        checkbox.appendChild(label);
        
        topPanel.appendChild(nameContainer);
        topPanel.appendChild(checkbox);

        let buttonPanel = document.createElement("div");
        buttonPanel.className = `button-panel`;

        let addButton = document.createElement("button");
        addButton.innerText = "add";
        let copyButton = document.createElement("button");
        copyButton.innerText = "copy";
        let removeButton = document.createElement("button");
        removeButton.innerText = "remove";
        
        buttonPanel.appendChild(addButton);
        buttonPanel.appendChild(copyButton);
        buttonPanel.appendChild(removeButton);

        elementHeader.appendChild(topPanel);
        elementHeader.appendChild(buttonPanel);
        
        let elementContainer = document.createElement("div");
        elementContainer.className = `element-container`;
        elementContainer.id = this.id + "-drop";

        mainElement.appendChild(elementHeader);
        mainElement.appendChild(elementContainer);

        InteractiveSettings.setDraggable(id, this.position, this.children);
        InteractiveSettings.setResizable(id);
        InteractiveSettings.setDropzone(id, (childId) => {
            const child = this.provideChild(childId);
            this.addChild(child);
            child.getElementGraphical().style.position = "relative";
            this.onChange();
        });

        return { main: mainElement, drop: elementContainer };
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