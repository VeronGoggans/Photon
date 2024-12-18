import { AnimationHandler } from "../handlers/animationHandler.js";
import { Dialog } from "../util/dialog.js";


export class StandardStickyBoardView {
    constructor(controller, stickyBoard) {
        this.controller = controller;
        this.stickyBoard = stickyBoard;

        this.dialog = new Dialog();
        this.#initElements();
        this.#eventListeners();
        AnimationHandler.fadeInFromBottom(this._viewElement);
    }

    
    renderAll(stickyNotes) {
        this._stickyBoardName.textContent = this.stickyBoard.name;
        this._description.textContent = this.stickyBoard.description;
        
        const contentFragment = document.createDocumentFragment();

        for (let i = 0; i < stickyNotes.length; i++) {
            const stickyNote = this.#stickyNote(stickyNotes[i]);
            AnimationHandler.fadeInFromBottom(stickyNote)
            contentFragment.appendChild(stickyNote);
        }
        this._stickyBoard.appendChild(contentFragment);
    }


    renderOne(stickyNote) {
        const stickyNoteCard = this.#stickyNote(stickyNote);
        AnimationHandler.fadeInFromBottom(stickyNoteCard);
        this._stickyBoard.insertBefore(stickyNoteCard, this._stickyBoard.lastElementChild);
    }


    renderDelete(stickyNoteId) {
        const stickyNotes = this._stickyBoard.children

        for (let i = 0; i < stickyNotes.length; i++) {
            if (stickyNotes[i].id == stickyNoteId) {
                AnimationHandler.fadeOutCard(stickyNotes[i])
            }
        }
    }


    renderUpdate(stickyNote) {
        const stickyNotes = this._stickyBoard.children

        for (let i = 0; i < stickyNotes.length; i++) {
            if (stickyNotes[i].id == stickyNote.id) {    
                stickyNotes[i].setAttribute('sticky', JSON.stringify(stickyNote));
            }
        }
    }


    #stickyNote(sticky) {
        const stickyCard = document.createElement('sticky-card');
        stickyCard.setAttribute('sticky', JSON.stringify(sticky));
        return stickyCard
    }


    #eventListeners() {
        this._newStickyButton.addEventListener('click', () => {this.dialog.renderStickyNoteModal(this.controller, this.stickyBoard.id)});
        this._viewElement.addEventListener('PreviousViewButtonClick', () => {this.controller.loadPreviousView()});

        this._stickyBoard.addEventListener('StickyCardClick', (event) => {
            const { sticky } = event.detail;
            this.dialog.renderStickyNoteModal(this.controller, this.stickyBoard.id, sticky)
        });
    }



    #initElements() {
        this._newStickyButton = document.querySelector('.add-sticky-btn');
        this._viewElement = document.querySelector('.standard-sticky-board-view');
        this._stickyBoard = document.querySelector('.standard-sticky-board-wrapper');
        this._description = document.querySelector('.description');
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