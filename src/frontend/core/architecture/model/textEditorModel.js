import { UniqueEvictingStack } from "../../datastuctures/stack.js";
import { HttpModel } from "./httpModel.js";
import { getFormattedTimestamp } from "../../util/date.js";
import { EditorNotesCache } from "../../components/cache.js";



export class TextEditorModel {
    constructor() {
        this.currentLoadedNote = null;
        this.stackLimit = 10;
        this.httpModel = new HttpModel();
        this.editorNotesCache = new EditorNotesCache();
        this.recentlyViewedNotesStack = new UniqueEvictingStack(this.stackLimit);

        this.#addRecentlyViewedNotes();
    }



    /**
     * This method stores a single editor object
     *
     * This method also stores the editor object in an evicting stack
     * for the recently viewed notes feature inside the text editor
     *
     * @param currentLoadedNote      - The note actual object being saved
     */
    storeEditorObject(currentLoadedNote) {
        this.currentLoadedNote = currentLoadedNote;
        console.log("currentLoadedNote:", currentLoadedNote);

        if (currentLoadedNote !== null) {
            currentLoadedNote.last_visit = getFormattedTimestamp();
            this.editorNotesCache.setIndex(currentLoadedNote.id);
            this.recentlyViewedNotesStack.push(currentLoadedNote);
        }
    }



    /**
     * This method will remove the deleted editor object from the evicting stack
     *
     * @param currentLoadedNoteId - The editor object id that was deleted ( doesn't exist anymore )
     */
    removeDeletedObjectFromEvictingStack(currentLoadedNoteId) {
        this.recentlyViewedNotesStack.evictDeleted(currentLoadedNoteId)
    }


    /**
     *  This method shows a representation of what's inside the evicting stack
     *
     * @returns { Array[Object] } - A list of the 5 most recently viewed notes
     */
    getRecentlyViewedNotes() {
        return this.recentlyViewedNotesStack.view();
    }


    /**
     * This method returns the currently loaded (visible inside the editor) note or template
     * @returns { currentLoadedNote: Object }
     */
    getStoredObject() {
        return this.currentLoadedNote
    }


    clear() {
        this.currentLoadedNote = null;
        console.log('currentLoadedNote: ', this.currentLoadedNote);
    }


    /**
     * This method will store all the content of a folder within an array
     * This array will only be used to navigate (cycle) through notes from within the editor,
     * and will NOT be used to keep track of which currentLoadedNote is currently edited.
     *
     * @param {array} notes - An array of note objects
     */
    storeNotesInMemory(notes) {
        this.editorNotesCache.setArray(notes);
    }


    /**
     *
     */
    getNextNoteInMemory() {
        const nextNote = this.editorNotesCache.getNext();
        this.storeEditorObject(nextNote);
        return nextNote
    }


    /**
     *
     */
    getPreviousNoteInMemory() {
        const previousNote = this.editorNotesCache.getPrevious();
        this.storeEditorObject(previousNote);
        return previousNote;
    }


    /**
     * Modifies the cache by adding, updating, or deleting a note based on the specified action.
     *
     * @param {string} action - The action to perform: "add", "update", or "delete".
     * @param {Object} note - The note object to be added, updated, or deleted.
     * The note must have an `id` property for "update" and "delete" actions.
     * @throws {Error} If an invalid action is specified.
     */
    modifyEditorCache(action, note) {
        switch (action) {
            case "add":
                this.editorNotesCache.addNote(note);
                break;
            case "update":
                this.editorNotesCache.updateNote(note);
                break;
            case "delete":
                this.editorNotesCache.deleteNote(note);
                break;
            default:
                throw new Error(`Invalid action: ${action}. Expected "add", "update", or "delete".`);
        }
    }





    /**
     * This method is called when the app is initialized,
     * and fills the evicting stack with the most recently viewed notes.
     */
    async #addRecentlyViewedNotes() {
        const response = await this.httpModel.get('/notes?bookmarks=false&recent=false&recently_viewed=true&search_items=false');
        this.recentlyViewedNotesStack.stack = response.content.notes
    }
}