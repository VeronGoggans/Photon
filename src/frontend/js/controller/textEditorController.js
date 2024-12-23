import { TextEditorView } from "../view/textEditorView.js";
import { TextEditorModel } from "../model/textEditorModel.js";
import { HttpModel } from "../model/httpModel.js";
import { pushNotification } from "../handlers/notificationHandler.js";



export class TextEditorController {
    constructor(applicationController) {
        this.applicationController = applicationController;
        this.model = new TextEditorModel();
        this.httpModel = new HttpModel();
    }


    init() {
        this.textEditorView = new TextEditorView(this, this.applicationController);
    }


    /**
     * This method will load the view the user was in before opening the editor.
     * Side effects - this will clear the stored editor object from memory
     */
    loadPreviousView() {
        const previousView = this.applicationController.getPreviousView();

        if (previousView === 'notes') {

            // The notes view will be initialized in the folder they were in before opening the editor
            const currentFolder = this.applicationController.getCurrentFolder();
            this.applicationController.initView(previousView, {
                folder: currentFolder,
                location: null
            });
        } 
        else {
            this.applicationController.initView(previousView);
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
        const { location } = await this.applicationController.getNoteById(editorObject.id);

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
    async save(name, content, notify, clearEditorObject) {
        const { editorObject } = this.model.getStoredObject();

        if (clearEditorObject) {
            this.model.editorObject = null;
        }

        if (editorObject !== null) {
            this.model.updateStoredObject(editorObject, name, content);
            await this.applicationController.updateNote(editorObject, notify);
        }

        else {
            await this.applicationController.addNote(name, content, notify)
        }

    }









    /**
     * This method will open the editor with the template or note the user clicked on.
     *
     * @param editorObject     - The actual data of the template or note the user clicked on
     * @param objectLocation   - The location of the note within the folder structure, templates don't have a location
     */
    openInTextEditor(editorObject, objectLocation) {
        this.model.storeEditorObject(editorObject);
        const viewedNotes = this.model.getRecentlyViewedNotes();
        this.textEditorView.open(editorObject, objectLocation, viewedNotes);
    }


    /**
     * This method will open the text editor without loading in a note or template
     *
     *
     * @param objectLocation    - The location of the note within the folder structure, templates don't have a location
     */
    showTextEditor(objectLocation) {
        this.model.storeEditorObject(null);
        const viewedNotes = this.model.getRecentlyViewedNotes();
        this.textEditorView.show(objectLocation, viewedNotes);
    }


    storeEditorObject(editorObject) {
        this.model.storeEditorObject(editorObject);
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