import { BoundedStack } from "../datastuctures/stack.js";


export class TextEditorModel {
    constructor() {
        this.editorObject = null;
        this.editorObjectType = null;
        this.stackLimit = 5;
        this.boundedStack = new BoundedStack(this.stackLimit);
    }

    storeEditorObject(editorObject, editorObjectType) {
        this.editorObject = editorObject;
        this.editorObjectType = editorObjectType;
        console.log(`Stored object: ${editorObject}`);
    }


    updateStoredObject(editorObject, name, content) {
        editorObject.name = name;
        editorObject.content = content;
    }


    getStoredObject() {
        return {
            editorObject: this.editorObject, 
            editorObjectType: this.editorObjectType
        }
    }


    clear() {
        this.editorObject = null;
        this.editorObjectType = null;
        console.log('CLEARED Stored Object');
    }
}