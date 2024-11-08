import { Flashcard } from "../components/entities/flashcardDeck.js";
import { AnimationHandler } from "../handlers/animationHandler.js";
import { BaseView } from "./baseView.js";

export class FlashcardEditView extends BaseView {
    constructor(controller, applicationController) {
        super();
        this.controller = controller;
        this.applicationController = applicationController;

        this.#initElements();
        this.#eventListeners();
        AnimationHandler.fadeInFromSide(this.viewElement);
    }

    renderAll(deck, flashcards) {
        this.deck = deck;
        this._deckName.textContent = deck.name;
        const flashcardsFragment = document.createDocumentFragment();

        for (let i = 0; i < flashcards.length; i++) {
            const flashcard = this.#flashcard(flashcards[i]);
            flashcardsFragment.appendChild(flashcard);
        }
        this._flashcardsContainer.appendChild(flashcardsFragment);
    }


    renderOne(flashcard) {
        const flashcardObj = this.#flashcard(flashcard);
        AnimationHandler.fadeInFromBottom(flashcardObj);
        this._flashcardsContainer.appendChild(flashcardObj);
    }
    

    renderUpdate(flashcard) {
        const flashcards = this._flashcardsContainer.children;

        for (let i = 0; i < flashcards.length; i++) {
            if (flashcards[i].id == flashcard.id) {    
                flashcards[i].querySelector('h3').textContent = flashcard.term;
            }
        }
    }

    renderDelete(flashcard) {
        const flashcards = this._flashcardsContainer.children;

        for (let i = 0; i < flashcards.length; i++) {
            if (flashcards[i].id == flashcard.id) {    
                AnimationHandler.fadeOutCard(flashcards[i]);
            }
        }
    }

    #flashcard(flashcard) {
        return new Flashcard(flashcard, this.dialog, this.controller);
    }

    #initElements() {
        this._flashcardsContainer = document.querySelector('.flashcards');
        this.viewElement = document.querySelector('.flashcard-edit-view');
        this._deckName = this.viewElement.querySelector('h1');
        this._addFlashcardButton = this.viewElement.querySelector('.add-flashcard-btn');
    }

    #eventListeners() {
        this._addFlashcardButton.addEventListener('click', () => {this.dialog.renderEditFlashcardModal(this.controller)});
        this.viewElement.addEventListener('PreviousViewButtonClick', () => {this.controller.loadPreviousView()});
    }
}