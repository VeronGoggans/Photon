import { AnimationHandler } from "../handlers/animationHandler.js";
import { removeContent } from "../util/ui.js";
import { createCustomElement } from "../util/ui/components.js";
import { DropdownHelper } from "../helpers/dropdownHelper.js";
import { renderEmptyFolderNotification } from "../handlers/notificationHandler.js";
import { Dialog } from "../util/dialog.js";


export class NoteView {
    constructor(controller, applicationController) {
        this.controller = controller;
        this.applicationController = applicationController;

        this.dialog = new Dialog();
        this.#initElements();
        this.#eventListeners();
        new DropdownHelper(
            this.dropdowns, 
            this.dropdownOptions,
            this.viewElement,
            ['.note-view-options-dropdown']
        );
        AnimationHandler.fadeInFromBottom(this.viewElement);
    }



    /**
     * This method will render an array of note objects
     *
     * The "documents" subtitle will appear, if the notes array is not empty.
     *
     * @param notes { Array[Object] } - An array of note objects.
     */
    renderAll(notes) {

        if (notes.length === 0) {
            // remove the notes subtitle
            this._notesBlockTitle.style.display = 'none';
            this.notesContainer.style.display = 'none';
        }

        if (notes.length > 0) {
            // show the notes subtitle
            this._notesBlockTitle.style.display = '';
            this.notesContainer.style.display = '';
        }

        const contentFragment = document.createDocumentFragment();

        for (let i = 0; i < notes.length; i++) {
            const noteCard = createCustomElement(notes[i], 'note-card');

            contentFragment.appendChild(noteCard);
            AnimationHandler.fadeInFromBottom(noteCard);
        }
        this.notesContainer.appendChild(contentFragment);
    }



    /**
     * This method will delete a specified note (document).
     *
     *  The "Documents" subtitle will disappear, if the note being deleted
     * is the last one within the current folder.
     *
     * @param note { Object } - The note to delete.
     */
    renderDelete(note) {
        if (this.notesContainer.children.length === 1) {
            // hide the notes subtitle
            this._notesBlockTitle.style.display = 'none';
            this.notesContainer.style.display = 'none';
        }

        const cards = this.notesContainer.children;
        for (let i = 0; i < cards.length; i++) {
            if (cards[i].id === String(note.id)) {
                AnimationHandler.fadeOutCard(cards[i]);
            }
        }
        renderEmptyFolderNotification(705);
    }




    #initElements() {
        this.createNoteButton = document.querySelector('.add-note-btn');
        this.bookmarkedButton = document.querySelector('.view-bookmarks-btn');
        this.noteViewOptionsButton = document.querySelector('.note-view-options-dropdown'); 
        this.noteViewOptions = document.querySelector('.note-view-options-dropdown ul');

        this.notesContainer = document.querySelector('.notes');
        this._notesBlockTitle = document.querySelector('#notes-block-title');

        this.notesContainer.style.display = 'none';
        this._notesBlockTitle.style.display = 'none';

        this.viewElement = document.querySelector('.notes-view');

        this.dropdowns = [this.noteViewOptionsButton];
        this.dropdownOptions = [this.noteViewOptions];
    }

    #eventListeners() {
        this.viewElement.addEventListener('CreateNewNote', () => {
            this.applicationController.initView('editor', {
                editorObject: null,
                newEditorObject: true, 
                previousView: 'notes', 
                editorObjectLocation: null
            })
        })

        this.notesContainer.addEventListener('DeleteNote', (event) => {
            const { note } = event.detail;
            this.dialog.renderDeleteModal(this.controller, note.id, note.name)
        })

        this.notesContainer.addEventListener('BookmarkNote', async (event) => {
            const { noteId, bookmark } = event.detail;
            await this.controller.patchBookmark(noteId, bookmark);
        })
        
        this.notesContainer.addEventListener('NoteCardClick', (event) => {
            const { note } = event.detail;
            this.applicationController.initView('editor', 
                {
                    editorObject: note,
                    newEditorObject: false, 
                    previousView: 'notes', 
                    editorObjectLocation: null
                }
            );
        })


        this.bookmarkedButton.addEventListener('click', () => {
            removeContent(this.notesContainer);
            const allBookmarks = -1
            this.controller.get(allBookmarks)
        });

        this.createNoteButton.addEventListener('click', () => {
            this.applicationController.initView('editor', {
                editorObject: null,
                newEditorObject: true, 
                previousView: 'notes', 
                editorObjectLocation: null
            })
        })
    }
}