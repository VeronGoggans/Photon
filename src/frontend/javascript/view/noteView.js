import { AnimationHandler } from "../handlers/animationHandler.js";
import { createCustomElement } from "../util/ui/components.js";
import { DropdownHelper } from "../helpers/dropdownHelper.js";
import { renderEmptyFolderNotification } from "../handlers/notificationHandler.js";
import { INIT_VIEW_EVENT, RENDER_DELETE_MODAL_EVENT } from "../components/eventBus.js";
import { handleSearch, showBookmarkedNotes } from "./viewFunctions.js";


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
     * Renders a collection of notes in the notes container, updating the UI accordingly.
     *
     * If there are no notes, it hides the notes subtitle and the container. If notes do exist,
     * it ensures the subtitle and container are visible, creates note cards for each note,
     * and animates their appearance.
     *
     * @param {Array<Object>} notes                 - An array of note objects to be rendered. Each object represents a note.
     *
     * @requires createCustomElement                - A utility function to create a DOM element for a note.
     * @requires AnimationHandler.fadeInFromBottom  - A utility method that animates the fade-in effect for a note card.
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
     * Handles the deletion of a note by removing its visual representation and updating the UI.
     *
     * If the notes container has only one child, it hides the notes subtitle and the notes container.
     * The method then finds and animates the removal of the note that matches the given note ID.
     * Finally, it displays a notification for an empty folder, if empty.
     *
     * @param {Object} note                     - The note object that is being deleted.
     * @param {number|string} note.id           - The unique identifier of the note to be removed. It must match the ID
     *                                            of a child element in the notes' container.
     *
     * @requires AnimationHandler.fadeOutCard   - A utility method that animates the fade-out of an element.
     * @requires renderEmptyFolderNotification  - A function that displays a notification for an empty folder.
     */
    renderDelete(note) {
        if (this.notesContainer.children.length === 1) {
            // hide the notes subtitle & container
            this._notesBlockTitle.style.display = 'none';
            this.notesContainer.style.display = 'none';
        }

        // Search for the specified note card
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


        this.viewElement.addEventListener('SearchBarItemClick', async (event) => {
            const { searchType, searchItem } = event.detail;
            await handleSearch(searchItem.id, searchType, this.eventBus);
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
                await this.controller.deleteNote(
                    {
                        noteId: deleteDetails.id,
                        notifyUser: deleteDetails.notifyUser,
                        render: true
                    }
                );
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
         * This event listener will listen for click events on the bookmark option button
         * When this button is clicked all the bookmarked notes will be rendered to the view.
         */
        this.bookmarkedButton.addEventListener('click', async () => {
            await showBookmarkedNotes(this.eventBus);
        });


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