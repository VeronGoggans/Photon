import { CNode } from "../../util/CNode.js";
import { getPassedTime } from "../../util/date.js";
import { capitalizeFirstLetter } from "../../util/formatters.js";
import { applyWidgetStyle } from "../../util/ui.js";


class FlashcardDeck extends HTMLElement {
    static get observedAttributes() {
        return ['deck', 'stats']; 
    }

    constructor() {
        super();
    }

    
    connectedCallback() {
        this.deck = JSON.parse(this.getAttribute('deck'));
        this.stats = JSON.parse(this.getAttribute('stats'));
        this.id = this.deck.id;
        this.flashcards = this.stats.flashcards;
        this.progression = this.stats.progression;        

        this.render();
        this.addEventListeners();
    }

    disconnectedCallback() {
        this.removeEventListeners();
    }

    
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'deck') {
            this.deck = JSON.parse(newValue);
        } else if (name === 'stats') {
            this.stats = JSON.parse(newValue);
        }
        this.render();
    } 

    render() {
        this.innerHTML = `
            <p class="deck-name">${this.deck.name}</p>
            <div class="details">
                <p class="last-study-date">${getPassedTime(this.deck.last_study)}</p>
                <p class="card-count">
                    <span>${this.flashcards}</span>
                    <i class="bi bi-files"></i>
                </p>
                <div class="progress">
                    <div class="progress__fill">
                        <span class="percentage">${this.progression}%</span>
                    </div>
                </div>
            </div>
            <div class="flashcard-options">
                <i id="practice-btn" class="fa-solid fa-arrows-rotate"></i>
                <i id="edit-btn" class="fa-solid fa-pen"></i>
                <i id="delete-btn" class="fa-solid fa-trash"></i>
            </div>
        `;
        applyWidgetStyle(this);
        this.querySelector('.progress__fill').style.width = `${this.progression}%`;
    }


    addEventListeners() {
        this.querySelector('#practice-btn').addEventListener('click', this.handlePracticeClick.bind(this));
        this.querySelector('#delete-btn').addEventListener('click', this.handleDeleteClick.bind(this));
        this.querySelector('#edit-btn').addEventListener('click', this.handleEditClick.bind(this));
    }


    removeEventListeners() {
        this.querySelector('#practice-btn').removeEventListener('click', this.handlePracticeClick.bind(this));
        this.querySelector('#delete-btn').removeEventListener('click', this.handleDeleteClick.bind(this));
        this.querySelector('#edit-btn').removeEventListener('click', this.handleEditClick.bind(this));
    }


    handlePracticeClick() {
        this.dispatchEvent(new CustomEvent('PracticeDeck', { detail: { deck: this.deck }, bubbles: true }));
    }


    handleDeleteClick() {
        this.dispatchEvent(new CustomEvent('DeleteDeck', { detail: { deckId: this.id, name: this.deck.name }, bubbles: true }));
    }


    handleEditClick() {
        this.dispatchEvent(new CustomEvent('UpdateDeck', { detail: { deck: this.deck }, bubbles: true }));
    }
}

customElements.define('flashcard-deck', FlashcardDeck)




export class Flashcard {
    constructor(flashcard, dialog, controller) {
        this.flashcard = flashcard;
        this.dialog = dialog;
        this.controller = controller;

        this.#initElements();
        this.#applyRatingStyle();
        this.#eventListeners();
        return this.#render();
    }

    #applyRatingStyle() {
        if (this.flashcard.rating === 'wrong') {
            this.RATING_CONTAINER.style.backgroundColor = '#ff8c8c';
        }
        if (this.flashcard.rating === 'idle') {
            this.RATING_CONTAINER.style.backgroundColor = '#9d9eaf';
        }
    }

    #render() {
        this.RATING_CONTAINER.appendChild(this.RATING);
        this.UTIL_BAR.append(this.DELETE_BUTTON);
        this.HOST.append(this.NAME, this.RATING_CONTAINER, this.UTIL_BAR);
        return this.HOST
    }

    #initElements() {
        this.HOST = CNode.create('div', {'class': 'flashcard', 'id': this.flashcard.id});
        this.NAME = CNode.create('h3', {'textContent': this.flashcard.term});
        this.UTIL_BAR = CNode.create('div', {'class': 'util-bar'});
        this.DELETE_BUTTON = CNode.create('button', {'class': 'delete-flashcard-btn', 'innerHTML': '<i class="fa-solid fa-trash"></i>'});
        this.RATING_CONTAINER = CNode.create('div', {'class': 'rating'});
        this.RATING = CNode.create('span', {'textContent': capitalizeFirstLetter(this.flashcard.rating)});
    }

    #eventListeners() {

        this.HOST.addEventListener('click', (event) => {
            if (!event.target.closest('button')) {
                this.dialog.renderEditFlashcardModal(this.controller, this.flashcard)
            }
        });


        this.DELETE_BUTTON.addEventListener('click', async () => {
            await this.controller.deleteFlashcard(this.flashcard.id);
        });
    }
}