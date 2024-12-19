import { TextEditorView } from "../view/textEditorView.js";
import { TextEditorModel } from "../model/textEditorModel.js";
import { FlashcardModel } from "../model/flashcardModel.js";
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
        this.flashcardModel = new FlashcardModel();
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
     * @param editorObjectType
     */
    async loadRecentlyViewedNote(editorObject, editorObjectType) {
        // Save the new editor object to the model
        this.model.storeEditorObject(editorObject, editorObjectType);

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
        const { editorObject, editorObjectType } = this.model.getStoredObject();
        if (clearEditorObject) {
            this.model.editorObject = null;
        }

        if (editorObjectType === 'note') {
            if (editorObject !== null) {
                this.model.updateStoredObject(editorObject, name, content);            
                await this.applicationController.updateNote(editorObject, notify);
            } else {
                console.log('Add document')
                console.log(editorObject)
                console.log(name)
                await this.applicationController.addNote(name, content, notify)
            }
        }

        if (editorObject === 'template') {
            if (editorObject !== null) {
                this.model.updateStoredObject(editorObject, name, content);
                await this.applicationController.updateTemplate(editorObject, notify)
            } else {
                await this.applicationController.addTemplate(name, content, notify)
            }
        }
    }







    /**
     * This method will open the editor with the template or note the user clicked on.
     *
     * @param editorObject     - The actual data of the template or note the user clicked on
     * @param editorObjectType - The type of the object (e.g) template, note
     * @param objectLocation   - The location of the note within the folder structure, templates don't have a location
     */
    openInTextEditor(editorObject, editorObjectType, objectLocation) {
        this.model.storeEditorObject(editorObject, editorObjectType);
        const viewedNotes = this.model.getRecentlyViewedNotes();
        this.textEditorView.open(editorObject, objectLocation, viewedNotes);
    }


    /**
     * This method will open the text editor without loading in a note or template
     *
     * @param editorObjectType  - note if editor has been opened from the notes tab
     *                          - template if the editor has been opened from the templates tab
     * @param objectLocation    - The location of the note within the folder structure, templates don't have a location
     */
    showTextEditor(editorObjectType, objectLocation) {
        this.model.storeEditorObject(null, editorObjectType);
        const viewedNotes = this.model.getRecentlyViewedNotes();
        this.textEditorView.show(objectLocation, viewedNotes);
    }


    storeEditorObject(editorObject, editorObjectType) {
        this.model.storeEditorObject(editorObject, editorObjectType);
    }


    clearStoredObject() {
        this.model.clear();
    }


    getStoredObject() {
        return this.model.getStoredObject();
    }


    /**
     * Temporarely saves a flashcard object
     * 
     * @param {Object} flashcard 
     */
    saveCardToModel(flashcard) {
        this.flashcardModel.storeFlashcard(flashcard);
    }


    /**
     * Temporarely stores the deck name
     * 
     * @param {Object} flashcard 
     */
    saveDeckName(deckName) {
        this.flashcardModel.storeDeckName(deckName)
    }


    /**
     * Returns an Object that contains the deck name and
     * a list of saved flashcard objects
     * @returns {Object}
    */
    getStoredDeckInfo() {
        return this.flashcardModel.getStoredDeckInfo();
    }

    async addDeck(deckName, flashcards) {
        await this.applicationController.addDeck(deckName, flashcards);
    }


    /**
     * This method will delete the currently loaded editor object.
     * This method is called when the user clicks on the delete option inside the editor,
     * which means the user still remains inside the editor when this function is called.
     *
     * @param editorObjectId
     */
    async handleDeleteButtonClick(editorObjectId) {
        const { editorObjectType } = this.model.getStoredObject()
        
        if (editorObjectType === 'note') {
            const { note } = await this.httpModel.delete(`/note/${editorObjectId}`);
            this.model.removeDeletedObjectFromEvictingStack(editorObjectId)
            pushNotification('deleted', note.name);
        }
        if (editorObjectType === 'template') {
            const { template } = await this.httpModel.delete(`/template/${editorObjectId}`);
            pushNotification('deleted', template.name);
        }

        // Clear the previous editor object content
        this.textEditorView.clearEditorContent();
        // Remove the previous editor object from memory
        this.model.editorObject = null;
    }
}