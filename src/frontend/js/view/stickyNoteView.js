import { AnimationHandler } from "../handlers/animationHandler.js";
import { Dialog } from "../util/dialog.js";
import { createCustomElement } from "../util/ui/components.js";




export class StandardStickyBoardView {
    constructor(controller, stickyBoard) {
        this.controller = controller;
        this.stickyBoard = stickyBoard;

        this.dialog = new Dialog();
        this.#initElements();
        this.#eventListeners();
        AnimationHandler.fadeInFromBottom(this._viewElement);
    }



    /**
     *
     *
     * @param stickyNotes
     */
    renderAll(stickyNotes) {
        this._stickyBoardName.textContent = this.stickyBoard.name;
        // this._description.textContent = this.stickyBoard.description;
        
        const contentFragment = document.createDocumentFragment();

        for (let i = 0; i < stickyNotes.length; i++) {
            const stickyNote = createCustomElement(stickyNotes[i], 'sticky-note');
            AnimationHandler.fadeInFromBottom(stickyNote)
            contentFragment.appendChild(stickyNote);
        }

        this._stickyBoard.appendChild(contentFragment);
    }



    /**
     *
     *
     * @param stickyNote
     */
    renderOne(stickyNote) {
        const stickyNoteCard = createCustomElement(stickyNote, 'sticky-note');
        AnimationHandler.fadeInFromBottom(stickyNoteCard);
        this._stickyBoard.appendChild(stickyNoteCard);
    }



    /**
     *
     *
     * @param stickyNoteId
     */
    renderDelete(stickyNoteId) {
        const stickyNotes = this._stickyBoard.children

        for (let i = 0; i < stickyNotes.length; i++) {
            if (stickyNotes[i].id === String(stickyNoteId)) {
                AnimationHandler.fadeOutCard(stickyNotes[i])
            }
        }
    }



    /**
     *
     *
     * @param stickyNote
     */
    renderUpdate(stickyNote) {
        const stickyNotes = this._stickyBoard.children

        for (let i = 0; i < stickyNotes.length; i++) {
            if (stickyNotes[i].id === String(stickyNote.id)) {
                stickyNotes[i].setAttribute('sticky', JSON.stringify(stickyNote));
            }
        }
    }


    debounce(callback, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId); // Clear the previous timeout
            timeoutId = setTimeout(() => {
                callback(...args); // Call the callback after the delay
            }, delay);
        };
    }


    // // Wrap the saveContent function with debounce
    // const debouncedSaveContent = this.debounce((content) => {
    //     const { id } = this.stickyBoard;
    //     const
    //     this.controller.patchStickyBoard(this.stickyBoard.id, content);
    // }, 2000); // 5 seconds






    #eventListeners() {
        this._newStickyButton.addEventListener('click', () => {this.dialog.renderStickyNoteModal(this.controller, this.stickyBoard.id)});
        this._viewElement.addEventListener('PreviousViewButtonClick', () => {this.controller.loadPreviousView()});

        this._stickyBoardDescription.addEventListener('input', () => {
            const changedStickyBoardName = this._stickyBoardName.textContent.trim();

        });
        this._stickyBoardName.addEventListener('input', () => {
            const changedStickyBoardDescription = this._stickyBoardDescription.innerHTML;
        });

        this._stickyBoard.addEventListener('StickyCardClick', (event) => {
            const { sticky } = event.detail;
            this.dialog.renderStickyNoteModal(this.controller, this.stickyBoard.id, sticky)
        });
    }



    #initElements() {
        this._newStickyButton = document.querySelector('.add-sticky-btn');
        this._viewElement = document.querySelector('.standard-sticky-board-view');
        this._stickyBoard = document.querySelector('.standard-sticky-board-wrapper');

        this._stickyBoardDescription = document.querySelector('.description');
        this._stickyBoardName = document.querySelector('h2');
    }
}








export class ColumnStickyBoardView {
    constructor(controller, stickyColumnBoard) {
        this.controller = controller;                   // The parent controller "StickyBoardController"
        this.stickyColumnBoard = stickyColumnBoard;     // The data related to the clicked on sticky board

        this.dialog = new Dialog();                     // Dependency to render modals if necessary
        this.#initElements();                           // Will register all the relevant UI elements
        this.#eventListeners();                         // Adds eventlisteners to all the relevant UI elements


        AnimationHandler.fadeInFromBottom(this.viewElement);
    }






    #initElements() {
        this.viewElement = document.querySelector('.column-sticky-board-view');
    }

    #eventListeners() {

    }
}