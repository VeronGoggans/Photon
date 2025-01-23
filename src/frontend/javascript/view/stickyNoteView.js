import { AnimationHandler } from "../handlers/animationHandler.js";
import { createCustomElement } from "../util/ui/components.js";
import { AutoSave } from "../components/Autosave.js";



export class StandardStickyBoardView {
    constructor(controller, stickyBoard) {
        this.controller = controller;
        this.stickyBoard = stickyBoard;

        this.#initElements();
        this.#eventListeners();
        this.#dynamicBoardResize();

        const saveNameCallBack = async (name) => {
            await this.controller.updateStickyBoardName({
                'stickyBoardId': this.stickyBoard.id,
                'boardType': this.stickyBoard.type,
                'updatedName': name
            })
        }

        new AutoSave('.sticky-board-name-container h2', saveNameCallBack, false, false, true);
        AnimationHandler.fadeInFromBottom(this._viewElement);
    }



    /**
     *
     *
     * @param stickyNotes
     */
    renderAll(stickyNotes) {
        const contentFragment = document.createDocumentFragment();

        for (const stickyNote of stickyNotes) {
            const stickyNoteComponent = createCustomElement(stickyNote, 'sticky-note');
            AnimationHandler.fadeInFromBottom(stickyNoteComponent)
            contentFragment.appendChild(stickyNoteComponent);
        }

        this._stickyBoard.appendChild(contentFragment);
    }



    /**
     *
     *
     * @param stickyNote
     */
    renderOne(stickyNote) {
        const stickyNoteComponent = createCustomElement(stickyNote, 'sticky-note');
        AnimationHandler.fadeInFromBottom(stickyNoteComponent);
        this._stickyBoard.appendChild(stickyNoteComponent);
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

        this._stickyBoard.addEventListener('StickyCardClick', (event) => {
            console.log('sticky click')
        });
    }



    #initElements() {
        this._newStickyButton = document.querySelector('.add-sticky-btn');
        this._exitStickyBoardButton = document.querySelector('.exit-sticky-board-btn');
        this._viewElement = document.querySelector('.standard-sticky-board-view');
        this._stickyBoard = document.querySelector('.standard-sticky-board-wrapper');

        this._stickyBoardName = document.querySelector('h2');
        this._stickyBoardName.textContent = this.stickyBoard.name;
    }
}








export class ColumnStickyBoardView {
    constructor(controller, columnBoard) {
        this.controller = controller;                   // The parent controller "StickyBoardController"
        this.columnBoard = columnBoard;                 // The data related to the clicked on sticky board

        this.#initElements();                           // Will register all the relevant UI elements
        this.#eventListeners();                         // Adds eventlisteners to all the relevant UI elements

        const saveNameCallBack = async (name) => {
            await this.controller.updateStickyBoardName({
                'stickyBoardId': this.columnBoard.id,
                'boardType': this.columnBoard.type,
                'updatedName': name
            })
        }

        AnimationHandler.fadeInFromBottom(this.viewElement);
        new AutoSave('.sticky-board-name-container h2', saveNameCallBack, false, false, true);
    }






    #initElements() {
        this.viewElement = document.querySelector('.column-sticky-board-view');
        this._exitStickyBoardButton = document.querySelector('.exit-sticky-board-btn');
        this._columnBoard = document.querySelector('h2');
        this._columnBoard.textContent = this.columnBoard.name;
    }

    #eventListeners() {
        this._exitStickyBoardButton.addEventListener('click', () => {this.controller.loadPreviousView()});
    }
}