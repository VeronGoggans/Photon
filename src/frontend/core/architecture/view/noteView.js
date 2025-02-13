import { AnimationHandler } from "../../handlers/animationHandler.js";
import { DropdownHelper } from "../../helpers/dropdownHelper.js";
import { INIT_VIEW_EVENT, RENDER_DELETE_MODAL_EVENT } from "../../components/eventBus.js";
import { handleSearch, showBookmarkedNotes } from "../controller/controllerFunctions.js";
import { UIWebComponentFactory } from "../../patterns/factories/webComponentFactory.js";
import { UIWebComponentNames, ViewRouteIDs } from "../../constants/constants.js";
import { removeBlockTitle, showBlockTitle } from "./viewFunctions.js";


export class NoteView {
    constructor(controller, eventBus) {
        this.controller = controller;
        this.eventBus = eventBus;

        this.#defineElements();
        this.#defineEvents();

        new DropdownHelper(
            this.dropdowns, 
            this.dropdownOptions,
            this.viewElement,
            ['.note-view-options-dropdown']
        );
        AnimationHandler.fadeInFromBottom(this.viewElement);
    }




    
    renderAll(notes) {

        if (notes.length === 0) removeBlockTitle(this._notesBlockTitle, this.notesContainer);
        if (notes.length > 0) showBlockTitle(this._notesBlockTitle, this.notesContainer);

        UIWebComponentFactory.
        createUIWebComponentCollection(notes, UIWebComponentNames.NOTE, this.notesContainer, false)
    }





    
    renderDelete(note) {
        if (this.notesContainer.children.length === 1) {
            removeBlockTitle(this._notesBlockTitle, this.notesContainer);
        }

        const noteCards = this.notesContainer.children;
        for (const noteCard of noteCards) {
            if (noteCard.id === String(note.id)) {
                AnimationHandler.fadeOutCard(noteCard);
            }   
        }
    }





    #defineElements() {
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



    #defineEvents() {

        /**
         * Creating a new note by emitting an EVENT to open a blank editor.
         * The ApplicationController will listen for this event and initialize the editor view.
         */
        this.viewElement.addEventListener('CreateNewNote', () => {
            this.eventBus.asyncEmit(INIT_VIEW_EVENT, {
                viewId: ViewRouteIDs.EDITOR_VIEW_ID,
                editorObject: null,
                newEditorObject: true, 
                previousView: ViewRouteIDs.NOTES_VIEW_ID, 
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
            this.eventBus.asyncEmit(INIT_VIEW_EVENT, {
                viewId: ViewRouteIDs.EDITOR_VIEW_ID,
                editorObject: note,
                newEditorObject: false,
                previousView: ViewRouteIDs.NOTES_VIEW_ID,
                editorObjectLocation: null
            });
        })



        /**
         * This event listener will listen for click events on the new note option button
         * When this button is clicked a blank editor is opened up.
         */
        this.createNoteButton.addEventListener('click', () => {

            // Event to tell the ApplicationController to initialize the editor view
            this.eventBus.asyncEmit(INIT_VIEW_EVENT, {
                viewId: ViewRouteIDs.EDITOR_VIEW_ID,
                editorObject: null,
                newEditorObject: true, 
                previousView: ViewRouteIDs.NOTES_VIEW_ID, 
                editorObjectLocation: null
            })
        })
    }
}