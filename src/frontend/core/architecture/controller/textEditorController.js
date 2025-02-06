import { TextEditorView } from "../view/textEditorView.js";
import { TextEditorModel } from "../model/textEditorModel.js";
import { HttpModel } from "../model/httpModel.js";
import { pushNotification } from "../../handlers/notificationHandler.js";
import {
    CLEAR_STORED_NOTE_EVENT,
    CREATE_NOTE_EVENT, DELETE_NOTE_EVENT,
    FETCH_NOTE_BY_ID_EVENT,
    GET_BREAD_CRUMBS_EVENT,
    GET_CURRENT_FOLDER_EVENT,
    GET_PREVIOUS_VIEW_EVENT,
    INIT_VIEW_EVENT, LOAD_NOTES_IN_MEMORY_EVENT,
    OPEN_NOTE_IN_TEXT_EDITOR_EVENT,
    OPEN_TEXT_EDITOR_EVENT,
    PATCH_NOTE_CONTENT_EVENT,
    PATCH_NOTE_NAME_EVENT
} from "../../components/eventBus.js";
import { ReferenceItemTypes } from "../../constants/constants.js";
import { loadFolder } from "../view/viewFunctions.js";



export class TextEditorController {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.model = new TextEditorModel();
        this.httpModel = new HttpModel();
        this.eventBus.registerEvents({
            [OPEN_TEXT_EDITOR_EVENT]: () => this.showTextEditor(),
            [OPEN_NOTE_IN_TEXT_EDITOR_EVENT]: (editorObject) => this.openInTextEditor(editorObject),
            [LOAD_NOTES_IN_MEMORY_EVENT]: (notes) => this.model.storeNotesInMemory(notes),
            [CLEAR_STORED_NOTE_EVENT]: () => this.model.clear()
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
                location: null,
                clearFilters: false
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
     * @param { Object } editorObject
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
     * @param { number } id
     * @param { ReferenceItemTypes } type
     */
    async loadReferenceItem(id, type) {
        let note, location;

        switch (type) {
            case ReferenceItemTypes.NOTES:
                // Get the note & location of the reference item's ID.
                ({ note, location } = await this.eventBus.asyncEmit(FETCH_NOTE_BY_ID_EVENT, id));

                // Save the new editor object to the model
                this.model.storeEditorObject(note);

                // Get the recently viewed notes list
                const recentlyViewedNotes = this.model.getRecentlyViewedNotes();

                // Load the recently viewed note in the editor
                this.textEditorView.open(note, location, recentlyViewedNotes);
                break;

            case ReferenceItemTypes.TEMPLATES:
                // Get the note of the reference item's ID.
                ({ note } = await this.eventBus.asyncEmit(FETCH_NOTE_BY_ID_EVENT, id));

                // Apply the template to the page
                this.textEditorView.applyTemplate(note);
                break;
            case ReferenceItemTypes.FOLDERS:
                // Load the specified folder.
                await loadFolder(id, this.eventBus);
                break;
            case ReferenceItemTypes.BOARDS:
                
                break;
            default:
                break;
        }

    }



    /**
     *
     * @param name
     * @param content
     * @param notify
     * @param clearEditorObject
     */
    async autoSave(name, content, notify, clearEditorObject) {
        const editorObject = this.model.getStoredObject();

        if (clearEditorObject) {
            this.model.editorObject = null;
        }


        // If the name of the note has been changed update only the name of the note
        if (editorObject !== null && editorObject.name !== name) {

            // Store the new name
            editorObject.name = name;

            // Event that'll notify the NoteController to make a backend call to update the name in the backend
            const note = await this.eventBus.asyncEmit(
                PATCH_NOTE_NAME_EVENT,
                { 'noteId': editorObject.id, 'updatedName': name }
            );

            this.model.modifyEditorCache('update', note);
        }


        // If the content of the note has been changed update only the content of the note
        else if (editorObject !== null && editorObject.content !== content) {

            // Store the new content
            editorObject.content = content;

            // Event that'll notify the NoteController to make a backend call to update the content in the backend
            const note = await this.eventBus.asyncEmit(
                PATCH_NOTE_CONTENT_EVENT,
                { 'noteId': editorObject.id, 'updatedContent': content }
            );

            this.model.modifyEditorCache('update', note);
        }


        // Create a new note, if the editor object is null
        else if (editorObject === null) {
            const currentFolder = this.eventBus.emit(GET_CURRENT_FOLDER_EVENT);
            const note = await this.eventBus.asyncEmit(
                CREATE_NOTE_EVENT,
                { folderId: currentFolder.id, name: name, content: content, notify: notify }
            );
            // Store the just created note
            this.model.storeEditorObject(note);
            this.model.modifyEditorCache('add', note);
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


    /**
     *
     */
    clearStoredObject() {
        this.model.clear();
    }


    /**
     *
     * @returns {currentLoadedNote:Object}
     */
    getStoredObject() {
        return this.model.getStoredObject();
    }


    /**
     *
     * @returns {*}
     */
    getNextNote() {
        return this.model.getNextNoteInMemory();
    }


    /**
     * This
     *
     * @returns {*}
     */
    getPreviousNote() {
        return this.model.getPreviousNoteInMemory();
    }


    /**
     * This method will delete the currently loaded editor object.
     * This method is called when the user clicks on the delete option inside the editor,
     * which means the user still remains inside the editor when this function is called.
     *
     * @param noteId
     */
    async deleteEditorObject(noteId) {

        const note = await this.eventBus.asyncEmit(DELETE_NOTE_EVENT, {
            noteId: noteId,
            notifyUser: true,
            render: false
        });

        this.model.removeDeletedObjectFromEvictingStack(noteId);
        this.model.modifyEditorCache('delete', note);
        pushNotification('deleted', note.name);

        // Remove the previous editor object from memory
        this.model.clear();
        this.textEditorView.clearEditorContent();
    }
}