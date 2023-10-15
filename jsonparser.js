export function createSchemaFromJSON(text, createElement) {
    try {
        const result = processObject(JSON.parse(text), null, (name, attributes, list) => {createElement(name, attributes, list)});
        console.log(result);
        return result;
    } catch(error) {
        console.log(error)
    }
}

function processObject(object, name=null, createElementMethod) {
    const objectAsMap = new Map(Object.entries(object)); 
    const list = [];
    const attributes = [];
    const children = [];
    let objectName = name;

    objectAsMap.forEach((value, key) => {
        if(isObject(value) || value == null) { //if is null, should be treated as object with empty attributes etc
            if(objectName != ""){
                return processObject(value, objectName);
            } else {
                objectName = key;
                children.push(processObject(value));
            }
        } else if (isArray(value)) {
            list = value;
        } else if(isStringOrNumber(value)) {
            attributes.push({key: key, value: value})
        }
    })
    const newElement = createElementMethod(objectName, attributes, list);
    console.log("========")
    console.log(newElement)
    children.forEach(child => {
        newElement.addChild(child);
    })
    
    return newElement;
}

function isObject(value) {
    return typeof value === 'object' &&
    !Array.isArray(value) &&
    value !== null
}

function isArray(value) {
    return Array.isArray(value) &&
    value !== null
}

function isStringOrNumber(value) {
    return typeof value == "string" || typeof value == "number"
}

/*
{
    "a": {
         "b": "c",
         "d": {
              "d": "f"
         },
         "g": {
              "e": "g"
         }
    }
}

*/