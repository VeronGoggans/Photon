import { EvictingStack } from "../datastuctures/stack.js";


export class TextEditorModel {
    constructor() {
        this.editorObject = null;
        this.editorObjectType = null;
        this.stackLimit = 5;
        this.evictingStack = new EvictingStack(this.stackLimit);
    }

    storeEditorObject(editorObject, editorObjectType) {
        this.editorObject = editorObject;
        this.editorObjectType = editorObjectType;

        if (editorObject !== null && editorObjectType === 'note') {
            this.evictingStack.push(
                {
                    id: editorObject.id,
                    name: editorObject.name,
                    time: new Date()
                }
            )
        }
    }


    updateStoredObject(editorObject, name, content) {
        editorObject.name = name;
        editorObject.content = content;
    }


    setStoredRecentlyViewedNotes(notes) {
        notes.forEach(note => {
            this.evictingStack.push(note);
        });
    }


    getRecentlyViewedNotes() {
        return this.evictingStack.view();
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
    }
}