import { NoteDetailContainer } from "../components/modals/noteDetailModal.js";
import { DeleteModal } from "../components/modals/deleteModal.js";
import { SearchModal } from "../components/modals/searchModal.js";
import { EditFolderModal } from "../components/modals/editFolderModal.js";
import { AnimationHandler } from "../handlers/animationHandler.js";
import { NewStickyBoardModel } from "../components/modals/newStickyBoardModal.js";


export class Dialog {
    constructor() {
        this.dialog = document.querySelector('.dialog');
        this.attachEventlisteners();
    }

    attachEventlisteners() {
        this.dialog.addEventListener('click', (event) => {
            const excludedContainers = [
                '.delete-modal',
                '.settings-container',
                '.note-details-modal',
                '.edit-folder-modal',
                '.create-deck-modal',
                '.edit-flashcard-modal',
                '.sticky-note-modal',
                '.new-sticky-board-modal',
            ];

            // Check if the clicked target belongs to any excluded container
            if (excludedContainers.some(selector => event.target.closest(selector))) {
                return;
            }
            this.close();
        });

        this.dialog.addEventListener('DialogEvent', (event) => {
            const { action } = event.detail;
            if (action === 'close') {
                this.close();
            }
        });
    }

    show() {
        this.dialog.style.visibility = 'visible';
        this.dialog.style.top = '0%';
    }

    close() {
        this.dialog.style.visibility = 'hidden';
        this.dialog.style.top = '100%';
        if (this.dialog.firstChild) {
            this.dialog.removeChild(this.dialog.firstChild);
        }
    }

    addChild(child) {
        this.dialog.appendChild(child);
        AnimationHandler.fadeInFromBottom(child);
        this.show();
    }


    renderNoteDetailsModal(noteInfo) {
        this.addChild(new NoteDetailContainer(noteInfo))
    }


    renderDeleteModal(deleteDetails, deleteCallback) {
        this.addChild(new DeleteModal(deleteDetails, deleteCallback));
        this.dialog.querySelector('.delete-modal input').focus()
    }


    renderNewStickyBoardModal(controller) {
        this.addChild(new NewStickyBoardModel(controller));
        this.dialog.querySelector('.new-sticky-board-modal input').focus()
    }


    renderSearchModal(toolbar) {
        const modal = new SearchModal()
        toolbar.appendChild(modal);
        modal.querySelector('.search-function-modal input').focus();
        modal.style.opacity = '1';
        modal.style.transform = 'translateY(0px)';
    }


    renderEditFolderModal(controller, folder = null) {
        this.addChild(new EditFolderModal(controller, folder));
        this.dialog.querySelector('.edit-folder-modal input').focus()
    }
}


export function dialogEvent(htmlElement, dialogAction) {
    htmlElement.dispatchEvent(new CustomEvent('DialogEvent', { detail: { action: dialogAction }, bubbles: true}));
}