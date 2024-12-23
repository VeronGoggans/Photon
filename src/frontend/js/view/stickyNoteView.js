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
        this.#dynamicBoardResize();
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


    /**
     * This method will dynamically resize the sticky board based on the width of the view element
     */
    #dynamicBoardResize() {
        let resizeTimeout;

        const observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                console.log('resize')
                clearTimeout(resizeTimeout);

                resizeTimeout = setTimeout(() => {
                    const width = entry.contentRect.width;

                    if (width < 690) {
                        this._stickyBoard.style.gridTemplateColumns = 'repeat(2, 200px)';
                    } else if (width < 950) {
                        this._stickyBoard.style.gridTemplateColumns = 'repeat(3, 200px)';
                    } else if (width < 1120) {
                        this._stickyBoard.style.gridTemplateColumns = 'repeat(4, 200px)';
                    } else {
                        this._stickyBoard.style.gridTemplateColumns = 'repeat(5, 200px)';
                    }
                }, 100); // Adjust debounce time as necessary
            }
        });

        observer.observe(this._viewElement);
    }






    #eventListeners() {
        this._newStickyButton.addEventListener('click', () => {
            console.log('new sticky');
        });
        this._exitStickyBoardButton.addEventListener('click', () => {this.controller.loadPreviousView()});

        this._stickyBoardDescription.addEventListener('input', () => {
            const changedStickyBoardName = this._stickyBoardName.textContent.trim();
        });
        this._stickyBoardName.addEventListener('input', () => {
            const changedStickyBoardDescription = this._stickyBoardDescription.innerHTML;
        });

        this._stickyBoard.addEventListener('StickyCardClick', (event) => {
            console.log('sticky click')
        });
    }



    #initElements() {
        this._newStickyButton = document.querySelector('.add-sticky-btn');
        this._exitStickyBoardButton = document.querySelector('.exit-sticky-board-btn');
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