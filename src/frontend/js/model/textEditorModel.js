import { UniqueEvictingStack } from "../datastuctures/stack.js";
import { HttpModel } from "./httpModel.js";
import { getFormattedTimestamp } from "../util/date.js";



export class TextEditorModel {
    constructor() {
        this.editorObject = null;
        this.editorObjectType = null;
        this.stackLimit = 5;
        this.httpModel = new HttpModel();
        this.evictingStack = new UniqueEvictingStack(this.stackLimit);
    }


    storeEditorObject(editorObject, editorObjectType) {
        this.editorObject = editorObject;
        this.editorObjectType = editorObjectType;

        if (editorObject !== null && editorObjectType === 'note') {
            editorObject.last_visit = getFormattedTimestamp();
            this.evictingStack.push(editorObject);
        }
    }


    updateStoredObject(editorObject, name, content) {
        editorObject.name = name;
        editorObject.content = content;
    }
    

    addRecentlyStoredNote(note) {
        this.evictingStack.push(note);
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


    async addRecentlyViewedNotes() {
        const { notes } = await this.httpModel.get('/recentViewedNotes');
        this.evictingStack.stack = notes    
    }
}