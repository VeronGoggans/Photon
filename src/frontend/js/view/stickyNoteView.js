import { AnimationHandler } from "../handlers/animationHandler.js";
import { Dialog } from "../util/dialog.js";


export class StickyNoteView {
    constructor(controller, stickyWall) {
        this.controller = controller;
        this.stickyWall = stickyWall;

        this.dialog = new Dialog();
        this.#initElements();
        this.#eventListeners();
        AnimationHandler.fadeInFromBottom(this.viewElement);
    }

    
    renderAll(stickyNotes) {
        // setting the sticky wall name & description.
        this._stickyWallName.textContent = this.stickyWall.name;
        this._description.textContent = this.stickyWall.description;
        
        const contentFragment = document.createDocumentFragment();

        for (let i = 0; i < stickyNotes.length; i++) {
            const stickyNote = this.#stickyNote(stickyNotes[i]);
            AnimationHandler.fadeInFromBottom(stickyNote)
            contentFragment.appendChild(stickyNote);
        }
        this._stickyWall.insertBefore(contentFragment, this._stickyWall.firstChild);
    }


    renderOne(stickyNote) {
        const stickyNoteCard = this.#stickyNote(stickyNote);
        AnimationHandler.fadeInFromBottom(stickyNoteCard);
        this._stickyWall.insertBefore(stickyNoteCard, this._stickyWall.lastElementChild);        
    }


    renderDelete(stickyNoteId) {
        const stickyNotes = this._stickyWall.children 

        for (let i = 0; i < stickyNotes.length; i++) {
            if (stickyNotes[i].id == stickyNoteId) {
                AnimationHandler.fadeOutCard(stickyNotes[i])
            }
        }
    }


    renderUpdate(stickyNote) {
        const stickyNotes = this._stickyWall.children 

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
        this.createStickyNoteButton.addEventListener('click', () => {this.dialog.renderStickyNoteModal(this.controller, this.stickyWall.id)});
        this.viewElement.addEventListener('PreviousViewButtonClick', () => {this.controller.loadPreviousView()});

        this._stickyWall.addEventListener('StickyCardClick', (event) => {
            const { sticky } = event.detail;
            this.dialog.renderStickyNoteModal(this.controller, this.stickyWall.id, sticky)
        });
    }

    #initElements() {
        this.createStickyNoteButton = document.querySelector('.add-sticky-btn');    
        this.viewElement = document.querySelector('.sticky-wall-view');
        this._stickyWall = document.querySelector('.sticky-wall');
        this._description = document.querySelector('.description-block-content');
        this._stickyWallName = document.querySelector('h1');
    }
}