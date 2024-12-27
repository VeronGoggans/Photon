import { AnimationHandler } from "../handlers/animationHandler.js";
import { removeContent } from "../util/ui.js";
import { createCustomElement } from "../util/ui/components.js";
import { DropdownHelper } from "../helpers/dropdownHelper.js";
import { renderEmptyFolderNotification } from "../handlers/notificationHandler.js";
import {INIT_VIEW_EVENT, RENDER_DELETE_MODAL_EVENT} from "../components/eventBus.js";


export class NoteView {
    constructor(controller, eventBus) {
        this.controller = controller;
        this.eventBus = eventBus;

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

        /**
         * Creating a new note by emitting an EVENT to open a blank editor.
         * The ApplicationController will listen for this event and initialize the editor view.
         */
        this.viewElement.addEventListener('CreateNewNote', () => {
            this.eventBus.emit(INIT_VIEW_EVENT, {
                viewId: 'editor',
                editorObject: null,
                newEditorObject: true, 
                previousView: 'notes', 
                editorObjectLocation: null
            })
        })


        /**
         * This custom event listener will listen for the DeleteNote event
         * When this event happens the DeleteModal is rendered to the dialog
         *
         * When the user fills in a complete match with the name of the note they are trying to delete,
         * the callback function will tell the controller to confirm the deletion of that note
         */
        this.notesContainer.addEventListener('DeleteNote', (event) => {
            const { note } = event.detail;

            // The callback function that'll delete the note when the user types in the full name
            const deleteCallBack = async (deleteDetails) => {
                await this.controller.deleteNote(deleteDetails.id, deleteDetails.notifyUser);
            }

            // Event to tell the dialog class to render the delete modal.
            this.eventBus.emit(RENDER_DELETE_MODAL_EVENT, {
                'id': note.id,
                'name': note.name,
                'notifyUser': false,
                'callBack': deleteCallBack
            })
        })


        /**
         * This custom event listener will listen for the BookmarkNote event
         * When this event happens the notes bookmark value will be set to it's opposite boolean value.
         */
        this.notesContainer.addEventListener('BookmarkNote', async (event) => {
            const { noteId, bookmark } = event.detail;
            await this.controller.updateNoteBookmark(noteId, bookmark);
        })


        /**
         * This custom event listener will listen for the NoteCardClick event
         * When this event happens the note will be loaded within the text editor view.
         */
        this.notesContainer.addEventListener('NoteCardClick', (event) => {
            const { note } = event.detail;

            // Event to tell the ApplicationController to initialize the editor view
            // and load the specified note within the editor.
            this.eventBus.emit(INIT_VIEW_EVENT, {
                viewId: 'editor',
                editorObject: note,
                newEditorObject: false,
                previousView: 'notes',
                editorObjectLocation: null
            });
        })


        /**
         * This event listener will listen for click events on the bookmark option button
         * When this button is clicked all the bookmarked notes will be rendered to the view.
         */
        this.bookmarkedButton.addEventListener('click', async () => {
            removeContent(this.notesContainer);
            await this.controller.getNotes({ bookmarks: true })
        });


        /**
         * This event listener will listen for click events on the new note option button
         * When this button is clicked a blank editor is opened up.
         */
        this.createNoteButton.addEventListener('click', () => {

            // Event to tell the ApplicationController to initialize the editor view
            this.eventBus.emit(INIT_VIEW_EVENT, {
                viewId: 'editor',
                editorObject: null,
                newEditorObject: true, 
                previousView: 'notes', 
                editorObjectLocation: null
            })
        })
    }
}