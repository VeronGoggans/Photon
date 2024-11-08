import { AnimationHandler } from "../handlers/animationHandler.js";
import { BaseView } from "./baseView.js";


export class FlashcardDeckView extends BaseView {
    constructor(controller, applicationController) {
        super(controller);
        this.controller = controller;
        this.applicationController = applicationController;

        this.#initElements();
        this.#eventListeners();
        AnimationHandler.fadeInFromBottom(this._viewElement)
    }

    renderAll(decks) {
        if (decks.length > 0) {
            const deckFragment = document.createDocumentFragment();

            for (let i = 0; i < decks.length; i++) {
                const { deck, stats } = decks[i];
                const deckCard = this.#flashcardDeck(deck, stats);
        
                deckFragment.appendChild(deckCard);                
                AnimationHandler.fadeInFromBottom(deckCard);
            }
            this._flashcardDecks.appendChild(deckFragment);
        }
    }


    renderOne(deck) {
        const deckCard = this.#flashcardDeck(deck);
        this._flashcardDecks.appendChild(deckCard);
        AnimationHandler.fadeInFromBottom(deckCard);
    }


    renderDelete(deckId) {        
        const decks = this._flashcardDecks.children;

        for (let i = 0; i < decks.length; i++) {
            if (decks[i].id == deckId) {
                AnimationHandler.fadeOutCard(decks[i]);
            }
        }
    }


    renderStats(flashcardCount) {
        this._flashcardCountSpan.textContent = flashcardCount; 
        // this._streakSpan.textContent = `${misc.streak}`
        // const minutes = misc.study_time;
        // if (minutes >= 60) {
        //     this._hoursStudiedSpan.textContent = Math.floor(minutes / 60);
        //     this._minutesStudiedSpan.textContent = minutes % 60;
        // }
        // else {
        //     this._minutesStudiedSpan.textContent = minutes;
        // }
    } 


    /**
     * This method is used to temporarly save a flashcard 
     * from the new deck modal
     * 
     * @param {Object} flashcard 
     */
    saveFlashcard(flashcard) {
        this.controller.saveCardToModel(flashcard);
    }

    /**
     * Temporarely stores the deck name
     * 
     * @param {Object} flashcard 
     */
    saveDeckName(deckName) {
        this.controller.saveDeckName(deckName)
    }


    #flashcardDeck(deck, stats) {
        const flashcardDeck = document.createElement('flashcard-deck');
        flashcardDeck.setAttribute('deck', JSON.stringify(deck));
        flashcardDeck.setAttribute('stats', JSON.stringify(stats));
        return flashcardDeck
    }


    #eventListeners() {
        this._addDeckButton.addEventListener('click', () => {this.dialog.renderNewDeckModal(this.controller)});

        this._flashcardDecks.addEventListener('PracticeDeck', async (event) => {
            console.log('press');
            
            const { deck } = event.detail;
            const flashcards = await this.controller.getFlashcards(deck.id); 
            this.applicationController.initView('flashcardsPractice', {
                deck: deck,
                flashcards: flashcards,
                previousView: 'flashcardsHome',
            })
        })

        this._flashcardDecks.addEventListener('UpdateDeck', async (event) => {
            const { deck } = event.detail;
            const flashcards = await this.controller.getFlashcards(deck.id);
            this.applicationController.initView('flashcardEdit', {
                deck: deck,
                flashcards: flashcards,
                previousView: 'flashcardsHome'
            })
        })

        this._flashcardDecks.addEventListener('DeleteDeck', (event) => {
            const { deckId, name } = event.detail;
            this.dialog.renderDeleteModal(this.controller, deckId, name);
        })
    }


    #initElements() {
        this._flashcardDecks = document.querySelector('.flashcard-deck-container');
        this._flashcardProgressions = document.querySelector('.flashcard-deck-progression-container');
        this._flashcardCountSpan = document.querySelector('.flashcard-count');
        this._streakSpan = document.querySelector('.study-streak');
        this._hoursStudiedSpan = document.querySelector('.hours-studied');
        this._minutesStudiedSpan = document.querySelector('.minutes-studied');
        this._addDeckButton = document.querySelector('.create-deck-btn');
        this._viewElement = document.querySelector('.flashcards-view');
    }
}