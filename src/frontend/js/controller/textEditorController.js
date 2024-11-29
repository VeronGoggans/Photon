import { TextEditorView } from "../view/textEditorView.js";
import { TextEditorModel } from "../model/textEditorModel.js";
import { FlashcardModel } from "../model/flashcardModel.js";
import { HttpModel } from "../model/httpModel.js";
import { pushNotification } from "../handlers/notificationHandler.js";



export class TextEditorController {
    constructor(applicationController) {
        this.applicationController = applicationController;
        this.model = new TextEditorModel();
        this.model.addRecentlyViewedNotes();
        this.httpModel = new HttpModel();
    }


    init() {
        this.textEditorView = new TextEditorView(this, this.applicationController);
        this.flashcardModel = new FlashcardModel();
    }


    loadPreviousView() {
        const previousView = this.applicationController.getPreviousView();
        if (previousView === 'notes') {
            const currentFolder = this.applicationController.getCurrentFolder();
            // The notes view will be initialized in the folder they were in before opening the editor
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


    async save(name, content, notify, clearEditorObject) {
        const { editorObject, editorObjectType } = this.model.getStoredObject();
        if (clearEditorObject) {
            this.model.editorObject = null;
        }

        if (editorObjectType === 'note') {
            if (editorObject !== null) {
                this.model.updateStoredObject(editorObject, name, content);            
                await this.applicationController.updateNote(editorObject);
            } else {                
                await this.applicationController.addNote(name, content, notify)
            }
        }

        if (editorObject === 'template') {
            if (editorObject !== null) {
                this.model.updateStoredObject(editorObject, name, content);
                await this.applicationController.updateTemplate(editorObject)
            } else {
                await this.applicationController.addTemplate(name, content, notify)
            }
        }
    }


    openInTextEditor(editorObject, editorObjectType, allFolderNames) {
        this.model.storeEditorObject(editorObject, editorObjectType);
        const viewedNotes = this.model.getRecentlyViewedNotes();
        this.textEditorView.open(editorObject, allFolderNames, viewedNotes);
    }


    storeEditorObject(editorObject, editorObjectType) {
        this.model.storeEditorObject(editorObject, editorObjectType);
    }


    showTextEditor(editorObjectType, allFolderNames) {
        this.model.storeEditorObject(null, editorObjectType);
        const viewedNotes = this.model.getRecentlyViewedNotes();
        this.textEditorView.show(allFolderNames, viewedNotes);
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
     * Returns a Object that contains the deck name and 
     * a list of saved flashcard objects
     * @returns {Object}
    */
    getStoredDeckInfo() {
        return this.flashcardModel.getStoredDeckInfo();
    }

    async addDeck(deckName, flashcards) {
        await this.applicationController.addDeck(deckName, flashcards);
    }


    async handleDeleteButtonClick(editorObjectId) {
        const { editorObjectType } = this.model.getStoredObject()
        
        if (editorObjectType === 'note') {
            const { note } = await this.httpModel.delete(`/note/${editorObjectId}`);
            pushNotification('deleted', note.name);
        }
        if (editorObjectType === 'template') {
            const { template } = await this.httpModel.delete(`/template/${editorObjectId}`);
            pushNotification('deleted', template.name);
        }
        this.textEditorView.clearEditorContent();
        this.model.editorObject = null;
    }
}