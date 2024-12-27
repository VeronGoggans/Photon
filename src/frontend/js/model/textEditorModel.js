import { UniqueEvictingStack } from "../datastuctures/stack.js";
import { HttpModel } from "./httpModel.js";
import { getFormattedTimestamp } from "../util/date.js";



export class TextEditorModel {
    constructor() {
        this.editorObject = null;
        this.stackLimit = 5;
        this.httpModel = new HttpModel();
        this.evictingStack = new UniqueEvictingStack(this.stackLimit);
        this.#addRecentlyViewedNotes();
    }



    /**
     * This method stores a single editor object
     *
     * This method also stores the editor object in an evicting stack
     * for the recently viewed notes feature inside the text editor
     *
     * @param editorObject      - The note actual object being saved
     */
    storeEditorObject(editorObject) {
        this.editorObject = editorObject;

        if (editorObject !== null) {
            editorObject.last_visit = getFormattedTimestamp();
            this.evictingStack.push(editorObject);
        }
    }



    /**
     * This method will remove the deleted editor object from the evicting stack
     *
     * @param editorObjectId - The editor object id that was deleted ( doesn't exist anymore )
     */
    removeDeletedObjectFromEvictingStack(editorObjectId) {
        this.evictingStack.evictDeleted(editorObjectId)
    }


    /**
     *  This method shows a representation of what's inside the evicting stack
     *
     * @returns { Array[Object] } - A list of the 5 most recently viewed notes
     */
    getRecentlyViewedNotes() {
        return this.evictingStack.view();
    }


    /**
     * This method returns the currently loaded (visible inside the editor) note or template
     * @returns { editorObject: Object }
     */
    getStoredObject() {
        return this.editorObject
    }


    clear() {
        this.editorObject = null;
    }


    /**
     * This method is called when the app is initialized,
     * and fills the evicting stack with the most recently viewed notes.
     */
    async #addRecentlyViewedNotes() {
        const response = await this.httpModel.get('/notes?bookmarks=false&recent=false&recently_viewed=true&search_items=false');
        this.evictingStack.stack = response.content.notes
    }
}