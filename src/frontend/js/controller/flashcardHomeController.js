import { HttpModel } from "../model/httpModel.js";
import { FlashcardDeckView } from "../view/flashcardDeckView.js";
import { FlashcardModel } from "../model/flashcardModel.js";

export class FlashcardHomeController {
    constructor(applicationController) {
        this.applicationController = applicationController;
        this.model = new HttpModel();
    }

    async init() {
        this.view = new FlashcardDeckView(this, this.applicationController);
        this.flashcardModel = new FlashcardModel();
        await this.getDecks()
    }

    
    async addDeck(deckName, flashcards) {
        const { deck } = await this.model.add('/deck', {'name': deckName, 'flashcards': flashcards});
        this.view.renderOne(deck);
    }


    async getDecks() {
        const { decks } = await this.model.get('/decks');        
        this.view.renderAll(decks)
        // this.view.renderStats(flashcard_count)
    }


    async getDeckById(deckId) {
        const { deck } = await this.model.get(`/deck/${deckId}`);
        return deck
    }

    async getFlashcards(deckId) {
        const { flashcards } = await this.model.get(`/flashcards/${deckId}`)
        return flashcards
    }


    async getSearchItems() {
        const { items } = await this.model.get('/deckSearchItems');
        return items
    }


    async delete(deckId) {
        await this.model.delete(`/deck/${deckId}`);       
        this.view.renderDelete(deckId);
    }

    /**
     * Temporarely stores a flashcard object
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
}