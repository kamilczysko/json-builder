import Element from "element"
import * as InteractiveSettings from "interactivesettings"

export default class ElementGUI {
    constructor(id, name, position = { x: 0, y: 0 }) {
        this.id = id;
        this.name = name;
        this.position = position;
        this.isSelected = false;
        this.element = new Element(id);
        this.element.setName(name);

        this.onChange = null;
        this.onSelect = null;
        this.provideChild = null;
        this.generateChild = null;
        this.typeChangeEvent = null;
        this.removeElement = null;
        this.onCopy = null;
        this.globalId = null;
        this.parentProvider = null;

        const graphicsElements = this.initGraphicalRepresentation(id, position, name);
        this.guiElement = graphicsElements.main;
        this.guiElementContainer = graphicsElements.elementContainer;
        this.copyButton = graphicsElements.copyButton;
        this.inputName = graphicsElements.inputName;
        this.isArrayCheckbox = graphicsElements.isArrayCheckbox;
        this.checkbox = graphicsElements.checkbox;
    }

    initGraphicalRepresentation(id, position, name) {
        let mainElement = document.createElement("div");
        mainElement.className = `element`;
        mainElement.style.zIndex = this.layer;
        mainElement.id = id;
        if (position) {
            mainElement.style.transform =
                `translate(${position.x}px, ${position.y}px)`;
        }
        mainElement.onclick = (event) => {
            event.stopPropagation();
            if (this.isSelected) {
                return;
            }
            this.isSelected = !this.isSelected;
            if (this.isSelected) {
                mainElement.classList.add("selected");
            } else {
                mainElement.classList.remove("selected");
            }
            this.onSelect(this.id);
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
        inputName.placeholder = "Enter a name for the object here"
        inputName.ondblclick = () => {
            event.stopPropagation();
        }
        let nameLabel = document.createElement("span");
        nameLabel.innerText = "name: "

        // nameContainer.appendChild(nameLabel);
        nameContainer.appendChild(inputName);

        let checkbox = document.createElement("div");
        checkbox.className = `checkbox`;

        let isArrayCheckbox = document.createElement("input");
        isArrayCheckbox.type = "checkbox"
        isArrayCheckbox.oninput = () => {
            this.element.setIsArray(isArrayCheckbox.checked);
            this.typeChangeEvent();
            this.onChange();
        }
        let label = document.createElement("span");
        label.innerText = "is array"

        checkbox.appendChild(isArrayCheckbox);
        checkbox.appendChild(label);


        topPanel.appendChild(nameContainer);
        // topPanel.appendChild(checkbox);

        let buttonPanel = document.createElement("div");
        buttonPanel.className = `button-panel`;

        let addButton = document.createElement("button");
        addButton.innerText = "add";
        addButton.onclick = (event) => {
            event.stopPropagation();
            this.generateChild(this.id);
        }

        let copyButton = document.createElement("button");
        copyButton.innerText = "duplicate";
        copyButton.onclick = () => {
            const cloned = this.clone(this.globalId());
            const parentId = this.element.getParent().getId();
            this.parentProvider(parentId).addChild(cloned);
        }
        let removeButton = document.createElement("button");
        removeButton.innerText = "X";
        removeButton.classList.add("remove-button")
        removeButton.onclick = () => {
            this.removeElement(this.id);
            if (this.element.getParent()) {
                this.element.getParent().removeChild(this.id);
            } else {
                document.getElementById("schemaContainer").removeChild(this.getElementGraphical())
            }
            this.element.getChildren().forEach(element => {
                element.removeElement(this.id);
            });
            this.onChange();
        }

        buttonPanel.appendChild(addButton);
        buttonPanel.appendChild(copyButton);
        buttonPanel.appendChild(checkbox);
        // buttonPanel.appendChild(removeButton);
        topPanel.appendChild(removeButton);

        elementHeader.appendChild(topPanel);
        elementHeader.appendChild(buttonPanel);

        let elementContainer = document.createElement("div");
        elementContainer.className = `element-container`;
        elementContainer.ondblclick = (event) => {
            event.stopPropagation();
            this.generateChild(this.id);
        }
        elementContainer.id = this.id + "-drop";

        let info = document.createElement("p");
        info.classList.add("info");
        info.innerText = "Double click to add new element or drag and drop existing one"

        elementContainer.appendChild(info);

        mainElement.appendChild(elementHeader);
        mainElement.appendChild(elementContainer);

        InteractiveSettings.setDraggable(id, this.position, this.children);
        InteractiveSettings.setDropzone(id, (childId) => {
            const child = this.provideChild(childId);
            this.addChild(child);
            child.getElementGraphical().style.position = "relative";
            this.onChange();
        });

        return { main: mainElement, elementContainer: elementContainer, 
            copyButton: copyButton, inputName:inputName, isArrayCheckbox:isArrayCheckbox,
        checkbox: checkbox };
    }

    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    getElementGraphical() {
        return this.guiElement;
    }

    addChild(child) {
        if (child.getElement().hasChild(this.id)) { //prevent errors during dragging objects with children
            return;
        }
        this.element.addChild(child.getElement());
        child.getElementGraphical().classList.add("isChild");
        this.guiElementContainer.appendChild(child.getElementGraphical())
        child.getElementGraphical().style.position = "block"
        this.guiElement.classList.add("parent")
        this.onChange();
    }

    deleteChild(child) {
        this.element.removeChild(child.getElement().getId());
        if (!this.element.hasChildren()) {
            this.guiElement.classList.remove("parent")
        }
        if (this.guiElementContainer.contains(child.getElementGraphical())) {
            this.guiElementContainer.removeChild(child.getElementGraphical());
            child.getElementGraphical().classList.remove("isChild");
            child.getElement().setParent(null);
        }
        document.getElementById("schemaContainer").appendChild(child.getElementGraphical())
        this.onChange();
    }

    removePermament(child) {
        if(!this.element.hasChild(child.getElement().getId())) {return;}
        this.element.removeChild(child.getElement().getId());
        if (!this.element.hasChildren()) {
            this.guiElement.classList.remove("parent")
        }
        this.guiElementContainer.removeChild(child.getElementGraphical());
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

    setPrimary(primary) {
        if (primary) {
            this.copyButton.style.display = "none"
            this.inputName.style.display = "none"
            this.checkbox.style.display = "none"
            this.setName("-----")
        } else {
            this.inputName.style.display = "block"
            this.checkbox.style.display = "block"
        }
        this.element.setPrimary(primary);
    }

    unselect() {
        this.guiElement.classList.remove("selected");
        this.isSelected = false;
    }

    select() {
        this.isSelected = true;
        this.guiElement.classList.add("selected");
        this.onSelect(this.id);
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

    setOnAddChild(generateChild) {
        this.generateChild = generateChild;
    }

    setOnTypeChange(typeChangeEvent) {
        this.typeChangeEvent = typeChangeEvent
    }

    setOnDelete(onRemove) {
        this.removeElement = onRemove;
    }

    setOnCopy(onCopy) {
        this.onCopy = onCopy;
    }

    setGlobalId(globalId) {
        this.globalId = globalId;
    }

    setParentProvider(provider) {
        this.parentProvider = provider;
    }

    getJSON() {
        return this.element.getJSON();
    }

    setAttribute(key, value) {
        this.element.setAttribute(key, value);
        this.onChange();
    }
    
    setAttributeByIndex(key, value, index) {
        this.element.setAttributeByIndex(key, value, index);
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

    setIsArray(isArray) {
        this.isArrayCheckbox.checked = isArray;
        this.element.setIsArray(isArray);
    }

    clone() {
        let tmpIDX = this.globalId();
        const newId = "element_" + tmpIDX
        const copied = new ElementGUI(newId, this.name + "-copy-" + tmpIDX, {x:0, y:0});

        copied.getElement().setList([...this.element.getList()]);
        copied.getElement().setAttributes(structuredClone(this.element.getAttributes()));
        copied.getElement().setParent(this.element.getParent())
        
        copied.setIsArray(this.element.isArray)

        copied.setOnChange(this.onChange);
        copied.setOnAddChild(this.generateChild);
        copied.setOnDelete(this.removeElement);
        copied.setOnSelect(this.onSelect);
        copied.setOnTypeChange(this.typeChangeEvent);
        copied.setChildProvider(this.provideChild);
        copied.setGlobalId(this.globalId);
        copied.setOnCopy(this.onCopy);
        copied.setParentProvider(this.parentProvider);

        this.onCopy(newId, copied);
        Array.from(this.element.getChildren().values()).forEach(child => {
            const clonedChild = this.parentProvider(child.getId()).clone();
            copied.addChild(clonedChild);
        })

        this.onChange();

        return copied;
    }
}