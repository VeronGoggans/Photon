import { CNode } from "../../util/CNode.js";
import { AnimationHandler } from "../../handlers/animationHandler.js";
import { dialogEvent } from "../../util/dialog.js";


export class NewDeckModal {
    constructor(controller, cards, deckName) {
        this.controller = controller;
        this.dialog = document.querySelector('.dialog');
        this.flashcards = cards;

        // Setting up the flashcard counter
        if (cards !== null && cards.length > 0) {
            this.cardCount = cards.length;
        } else {
            this.cardCount = 0;
        }
        
        this.HOST = CNode.create('div', {'class': 'create-deck-modal'});
        this.MODAL_TITLE = CNode.create('h2', {'textContent': 'Creating a new deck'});
        this.DECK_NAME_INPUT = CNode.create('input', {'type': 'text', 'class': 'deck-name-input', 'placeholder': 'Deck name', 'value': deckName === null ? '' : deckName, 'spellCheck': false});
        this.CARD_TERM = CNode.create('input', {'type': 'text', 'class': 'term-input', 'placeholder': 'Card term', 'spellCheck': false});
        this.DESCRIPTION_SECTION = CNode.create('div', {'class': 'description-section'});
        this.RICH_TEXT_OPTIONS = CNode.create('div', {'class': 'rich-text-options'});
        this.BOLD_BTN = CNode.create('button', {'innerHTML': '<i class="bi bi-type-bold"></i>', 'onclick' : "formatText('bold')", 'id': 'boldBtn'});
        this.ITALIC_BTN = CNode.create('button', {'innerHTML': '<i class="bi bi-type-italic"></i>', 'onclick' : "formatText('italic')", 'id': 'italicBtn'});
        this.UNDERLINE_BTN = CNode.create('button', {'innerHTML': '<i class="bi bi-type-underline"></i>', 'onclick' : "formatText('underline')", 'id': 'underlineBtn'});
        this.STRIKE_BTN = CNode.create('button', {'innerHTML': '<i class="bi bi-type-strikethrough"></i>', 'onclick' : "formatText('strikethrough')", 'id': 'strikeBtn'});
        this.LIST1_BTN = CNode.create('button', {'innerHTML': '<i class="bi bi-list-task"></i>', 'onclick' : "formatText('insertUnorderedList')"});
        this.LIST2_BTN = CNode.create('button', {'innerHTML': '<i class="bi bi-list-ol"></i>', 'onclick' : "formatText('insertOrderedList')"});
        this.SELECT_BTN = CNode.create('button', {'class': 'select-text-btn', 'innerHTML': '<i class="bi bi-body-text"></i>'});
        this.CARD_DECSRIPTION = CNode.create('div', {'class': 'card-description', 'contentEditable': true, 'spellCheck': false});
        this.NEXT_BTN = CNode.create('button', {'class': 'next-card-btn', 'textContent': 'Save card'});
        this.SAVE_BTN = CNode.create('button', {'class': 'save-deck-btn', 'textContent': 'Save deck'});
        this.CARD_COUNT_SPAN = CNode.create('span', {'innerHTML': `${cards === null ? '0' : cards.length} <i class="bi bi-files"></i>`, 'class': 'card-count'});

        this.#eventListeners();
        return this.#render();
    }

    #clearPreviousCardInput() {
        this.CARD_TERM.value = '';
        this.CARD_DECSRIPTION.textContent = '';
    }


    #saveCardInput() {
        const term = this.CARD_TERM.value.trim() === '' ? 'Untitled' : this.CARD_TERM.value;
        const description = this.CARD_DECSRIPTION.innerHTML.trim() === '' ? 'No description' : this.CARD_DECSRIPTION.innerHTML;

        return {
            'term': term, 
            'description': description 
        }
    }

    #getSelectedText() {
        const selection = window.getSelection();

        if (!selection.isCollapsed) {
            const range = selection.getRangeAt(0);

            if (range && range.toString().length > 0) {
                // Create a new document fragment to hold the selected content
                const selectedContent = range.cloneContents();

                // Create a temporary div to hold the selected HTML content
                const tempDiv = document.createElement('div');
                tempDiv.appendChild(selectedContent);

                // Get the HTML content as a string
                const selectedHtml = tempDiv.innerHTML;

                 // Set the selected text as the card description
                this.CARD_DECSRIPTION.innerHTML = selectedHtml 
            }
           
            // Make the dialog visible again. 
            AnimationHandler.fadeInFromBottom(this.HOST);
            this.dialog.style.visibility = 'visible';
        }
    }

    #eventListeners() {
        this.NEXT_BTN.addEventListener('click', () => {
            // Save the current card input
            const flashcard = this.#saveCardInput();
            this.controller.saveCardToModel(flashcard);

            // Save the deck name if not already saved
            const deckName = this.DECK_NAME_INPUT.value
            this.controller.saveDeckName(deckName)

            // Clear input
            this.#clearPreviousCardInput();

            // Update card count
            this.cardCount += 1
            this.CARD_COUNT_SPAN.textContent = this.cardCount;
        });

        this.SELECT_BTN.addEventListener('click', () => {
            const editorPaper = document.querySelector('.editor-paper');
            if (editorPaper !== null) {

                // Animate the modal
                AnimationHandler.fadeOutToBottom(this.HOST);
                setTimeout(() => {
                    this.dialog.style.visibility = 'hidden';
                }, 150)
                
                editorPaper.addEventListener('mouseup', () => {this.#getSelectedText()});
            }
        });

        this.SAVE_BTN.addEventListener('click', () => {
            // Check if there is a flashcard being working on that hasn't been stored yet            
            if (this.CARD_DECSRIPTION.innerHTML.trim() !== '' || this.CARD_TERM.value.trim() !== '') {
                const flashcard = this.#saveCardInput();
                this.controller.saveCardToModel(flashcard);
            }
            // Save the deck 
            const { deckName, flashcards } = this.controller.getStoredDeckInfo();
            this.controller.addDeck(
                deckName,
                flashcards
            )
            dialogEvent(this.HOST, 'close');
        })
    }


    #render() {
        this.RICH_TEXT_OPTIONS.append(this.BOLD_BTN, this.ITALIC_BTN, this.UNDERLINE_BTN, this.STRIKE_BTN, this.LIST1_BTN, this.LIST2_BTN, this.SELECT_BTN);
        this.DESCRIPTION_SECTION.append(this.RICH_TEXT_OPTIONS, this.CARD_DECSRIPTION);
        this.HOST.append(this.MODAL_TITLE, this.DECK_NAME_INPUT, this.CARD_TERM, this.DESCRIPTION_SECTION, this.CARD_COUNT_SPAN, this.NEXT_BTN, this.SAVE_BTN);
        return this.HOST;
    }
}