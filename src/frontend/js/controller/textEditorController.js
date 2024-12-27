import { TextEditorView } from "../view/textEditorView.js";
import { TextEditorModel } from "../model/textEditorModel.js";
import { HttpModel } from "../model/httpModel.js";
import { pushNotification } from "../handlers/notificationHandler.js";
import {
    CREATE_NOTE_EVENT,
    FETCH_NOTE_BY_ID_EVENT,
    GET_BREAD_CRUMBS_EVENT,
    GET_CURRENT_FOLDER_EVENT,
    GET_PREVIOUS_VIEW_EVENT,
    INIT_VIEW_EVENT,
    OPEN_NOTE_IN_TEXT_EDITOR_EVENT,
    OPEN_TEXT_EDITOR_EVENT,
    PATCH_NOTE_CONTENT_EVENT,
    PATCH_NOTE_NAME_EVENT
} from "../components/eventBus.js";



export class TextEditorController {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.model = new TextEditorModel();
        this.httpModel = new HttpModel();
        this.eventBus.registerEvents({
            [OPEN_TEXT_EDITOR_EVENT]: () => this.showTextEditor(),
            [OPEN_NOTE_IN_TEXT_EDITOR_EVENT]: (editorObject) => this.openInTextEditor(editorObject)
        })
    }


    init() {
        this.textEditorView = new TextEditorView(this, this.eventBus);
    }


    /**
     * This method will load the view the user was in before opening the editor.
     * Side effects - this will clear the stored editor object from memory
     */
    loadPreviousView() {
        const previousViewId = this.eventBus.emit(GET_PREVIOUS_VIEW_EVENT);

        if (previousViewId === 'notes') {

            // The notes view will be initialized in the folder they were in before opening the editor
            const currentFolder = this.eventBus.emit(GET_CURRENT_FOLDER_EVENT);
            this.eventBus.emit(INIT_VIEW_EVENT, {
                viewId: previousViewId,
                folder: currentFolder,
                location: null
            });
        } 
        else {
            this.eventBus.emit(INIT_VIEW_EVENT, {viewId: previousViewId});
        }
        this.model.clear();
    }


    /**
     *
     *
     * @param editorObject
     */
    async loadRecentlyViewedNote(editorObject) {
        // Save the new editor object to the model
        this.model.storeEditorObject(editorObject);

        // Get the recently viewed notes list
        const recentlyViewedNotes = this.model.getRecentlyViewedNotes();

        // Get the location of the editor object within the folder structure
        const { location } = await this.eventBus.asyncEmit(FETCH_NOTE_BY_ID_EVENT, editorObject.id)

        // Load the recently viewed note in the editor
        this.textEditorView.open(editorObject, location, recentlyViewedNotes);
    }



    /**
     *
     * @param name
     * @param content
     * @param notify
     * @param clearEditorObject
     */
    async autoSave(name, content, notify, clearEditorObject) {
        const { editorObject } = this.model.getStoredObject();

        if (clearEditorObject) {
            this.model.editorObject = null;
        }

        // If the name of the note has been changed update only the name of the note
        if (editorObject !== null && editorObject.name !== name) {
            editorObject.name = name;
            await this.eventBus.asyncEmit(PATCH_NOTE_NAME_EVENT, {
                'noteId': editorObject.id, 'updatedName': name});
        }

        // If the content of the note has been changed update only the content of the note
        else if (editorObject !== null && editorObject.content !== content) {
            editorObject.content = content;
            await this.eventBus.asyncEmit(PATCH_NOTE_CONTENT_EVENT, {
                'noteId': editorObject.id, 'updatedContent': content});
        }

        // Create a new note, if the editor object is null
        else if (editorObject === null) {
            const currentFolder = this.eventBus.emit(GET_CURRENT_FOLDER_EVENT);
            const note = await this.eventBus.asyncEmit(CREATE_NOTE_EVENT, {
                folderId: currentFolder.id, name: name, content: content, notify: notify
            });
            // Store the just created note
            this.model.storeEditorObject(note);
        }
    }



    /**
     * This method will open the editor with the template or note the user clicked on.
     *
     * @param editorObject     - The actual data of the template or note the user clicked on
     */
    openInTextEditor(editorObject) {
        this.model.storeEditorObject(editorObject);
        const breadCrumbs = this.eventBus.emit(GET_BREAD_CRUMBS_EVENT);
        const viewedNotes = this.model.getRecentlyViewedNotes();
        this.textEditorView.open(editorObject, breadCrumbs, viewedNotes);
    }


    /**
     * This method will open the text editor without loading in a note or template
     *
     *
     *
     */
    showTextEditor() {
        this.model.clear();
        const breadCrumbs = this.eventBus.emit(GET_BREAD_CRUMBS_EVENT);
        const viewedNotes = this.model.getRecentlyViewedNotes();
        this.textEditorView.show(breadCrumbs, viewedNotes);
    }



    clearStoredObject() {
        this.model.clear();
    }


    getStoredObject() {
        return this.model.getStoredObject();
    }



    /**
     * This method will delete the currently loaded editor object.
     * This method is called when the user clicks on the delete option inside the editor,
     * which means the user still remains inside the editor when this function is called.
     *
     * @param editorObjectId
     */
    async deleteEditorObject(editorObjectId) {

        const { note } = await this.httpModel.delete(`/note/${editorObjectId}`);
        this.model.removeDeletedObjectFromEvictingStack(editorObjectId)
        pushNotification('deleted', note.name);


        // Clear the previous editor object content
        this.textEditorView.clearEditorContent();
        // Remove the previous editor object from memory
        this.model.editorObject = null;
    }
}