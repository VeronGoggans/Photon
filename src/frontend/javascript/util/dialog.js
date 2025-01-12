import { NoteDetailModal} from "../components/modals/noteDetailModal.js";
import { DeleteModal } from "../components/modals/deleteModal.js";
import { SearchModal } from "../components/modals/searchModal.js";
import { FolderModal } from "../components/modals/folderModal.js";
import { AnimationHandler } from "../handlers/animationHandler.js";
import { StickyBoardModel } from "../components/modals/stickyBoardModal.js";
import {
    RENDER_DELETE_MODAL_EVENT,
    RENDER_FOLDER_MODAL_EVENT, RENDER_CATEGORY_MODAL_EVENT,
    RENDER_NOTE_DETAILS_MODAL_EVENT, RENDER_SEARCH_MODAL_EVENT, RENDER_STICKY_BOARD_MODAL_EVENT
} from "../components/eventBus.js";



/**
 *
 */
export class Dialog {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.dialog = document.querySelector('.dialog');
        this.attachEventlisteners();
        this.eventBus.registerEvents({
            [RENDER_FOLDER_MODAL_EVENT]: (modalData) => this.renderFolderModal(modalData),
            [RENDER_DELETE_MODAL_EVENT]: (modalData) => this.renderDeleteModal(modalData),
            [RENDER_NOTE_DETAILS_MODAL_EVENT]: (modalData) => this.renderNoteDetailsModal(modalData),
            [RENDER_STICKY_BOARD_MODAL_EVENT]: (modalData) => this.renderStickyBoardModal(modalData),
            [RENDER_SEARCH_MODAL_EVENT]: () => this.renderSearchModal(),
            [RENDER_CATEGORY_MODAL_EVENT]: (modalData) => this.renderCategoryModal(modalData)
        })
    }

    attachEventlisteners() {

        /**
         *
         */
        this.dialog.addEventListener('click', (event) => {
            const excludedContainers = [
                '.delete-modal',
                '.settings-container',
                '.note-details-modal',
                '.edit-folder-modal',
                '.category-modal',
                '.new-sticky-board-modal',
            ];

            // Check if the clicked target belongs to any excluded container
            if (excludedContainers.some(selector => event.target.closest(selector))) {
                return;
            }
            this.#close();
        });


        /**
         *
         */
        this.dialog.addEventListener('CloseDialog', () => {
            this.#close();
        })
    }


    /**
     *
     */
    #show() {
        this.dialog.style.visibility = 'visible';
        this.dialog.style.top = '0%';
    }


    /**
     *
     */
    #close() {
        this.dialog.style.visibility = 'hidden';
        this.dialog.style.top = '100%';
        if (this.dialog.firstChild) {
            this.dialog.removeChild(this.dialog.firstChild);
        }
    }


    /**
     *
     * @param child
     */
    #renderModal(child) {
        this.dialog.appendChild(child);
        AnimationHandler.fadeInFromBottom(child);
        this.#show();
    }


    /**
     *
     * @param modalData
     */
    renderNoteDetailsModal(modalData) {
        const modal = new NoteDetailModal(modalData);
        this.#renderModal(modal);
    }


    /**
     *
     * @param modalData
     */
    renderDeleteModal(modalData) {
        const modal = new DeleteModal(modalData);
        this.#renderModal(modal);

        // Focus on the first input field (improves the UX)
        this.dialog.querySelector('.delete-modal input').focus()
    }


    /**
     *
     * @param modalData
     */
    renderStickyBoardModal(modalData) {
        const modal = new StickyBoardModel(modalData);
        this.#renderModal(modal);

        // Focus on the first input field (improves the UX)
        this.dialog.querySelector('.new-sticky-board-modal input').focus()
    }


    /**
     *
     */
    renderSearchModal() {
        const modal = new SearchModal()
        toolbar.appendChild(modal);

        // Mak the modal appear with a slight animation
        modal.MODAL.querySelector('.search-function-modal input').focus()
        modal.MODAL.style.opacity = '1';
        modal.MODAL.style.transform = 'translateY(0px)';
    }


    /**
     *
     * @param modalData
     */
    renderFolderModal(modalData) {
        const modal = new FolderModal(modalData);
        this.#renderModal(modal);

        // Focus on the first input field (improves the UX)
        this.dialog.querySelector('.edit-folder-modal input').focus()
    }


    /**
     *
     * @param modalData
     */
    renderCategoryModal(modalData) {
        const modal = new FolderModal(modalData);
        this.#renderModal(modal);

        // Focus on the first input field (improves the UX)
        this.dialog.querySelector('.edit-folder-modal input').focus()
    }
}


/**
 * Custom event function that'll close the dialog.
 * And remove any content that was on the modal at the moment of the event call.
 */
export function closeDialogEvent(modal) {
    modal.dispatchEvent(new CustomEvent('CloseDialog', {bubbles: true}))
}


/**
 * Custom event function that'll open the dialog.
 */
export function openDialogEvent() {
    document.dispatchEvent(new CustomEvent('CloseDialog', {bubbles: true}))
}