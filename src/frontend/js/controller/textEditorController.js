import { TextEditorView } from "../view/textEditorView.js";
import { TextEditorModel } from "../model/textEditorModel.js";
import { FlashcardModel } from "../model/flashcardModel.js";

export class TextEditorController {
    constructor(applicationController) {
        this.applicationController = applicationController;
        this.model = new TextEditorModel();
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
            this.model.clear()
        }

        // Note cases
        if (editorObject !== null && editorObjectType === 'note') {
            editorObject.name = name;
            editorObject.content = content;
            
            await this.applicationController.updateNote(editorObject)
        }
        if (editorObject === null && editorObjectType === 'note') {
            await this.applicationController.addNote(name, content, notify)
        }
        // Template cases
        if (editorObject !== null && editorObjectType === 'template') {
            editorObject.name = name;
            editorObject.content = content;
            await this.applicationController.updateTemplate(editorObject)
        }
        if (editorObject === null && editorObjectType === 'template') {
            await this.applicationController.addTemplate(name, content, notify)
        } 
    }

    openInTextEditor(editorObject, editorObjectType, allFolderNames) {
        this.model.storeEditorObject(editorObject, editorObjectType);
        this.textEditorView.open(editorObject, allFolderNames);
    }

    storeEditorObject(editorObject, editorObjectType) {
        this.model.storeEditorObject(editorObject, editorObjectType);
    }

    showTextEditor(editorObjectType, allFolderNames) {
        this.model.storeEditorObjectType(editorObjectType);
        this.textEditorView.show(allFolderNames);
    }

    clearStoredObject() {
        this.model.clear()
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
            await this.applicationController.deleteNote(editorObjectId, true);
        }
        if (editorObjectType === 'template') {
            await this.applicationController.deleteTemplate(editorObjectId, true);
        }
        this.textEditorView.clear();
    }
}