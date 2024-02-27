import { Note } from "../components/note.js";
import { DeleteContainer } from "../components/deleteContainer.js";
import { ListNote, NoNoteMessage } from "../components/listNote.js";
import { HTMLArray, NoteObjectArray } from "../util/array.js";
import { UserFeedbackHandler } from "../handlers/notificationHandler.js";
import { dateFormat } from "../util/date.js";
import { formatName } from "../util/formatters.js";

export class NoteView {
    constructor(noteController, dialog) {
        this.noteController = noteController;
        this._content = document.querySelector('.content-view');
        this._list = document.querySelector('.list-content-notes');
        this._cover = document.querySelector('.cover');
        this.userFeedbackHandler = new UserFeedbackHandler();
        this.dialog = dialog;
        this.noteObjects = new NoteObjectArray();
    }

    /** 
     * This method renders an array of note objects to the UI
     * and adds a note object to the noteObjects array for each note.
     * 
     * This method is called by the noteController 
     * when a user clicks on a folder card. 
     * 
     * @param {Array} notes 
     */
    renderNoteCards(notes) {
        // clear the array everytime this method gets called.
        this.noteObjects.clear();
        if (notes.length > 0) {
            for (let i = 0; i < notes.length; i++) {
                const LIST_NOTE_CARD = this.listNote(notes[i]);
                const NOTE_CARD = this.note(notes[i]);

                this._content.appendChild(NOTE_CARD);
                this._list.appendChild(LIST_NOTE_CARD);
            }
            console.log(this.noteObjects);
        } else {
            this.userFeedbackHandler.noNotes(new NoNoteMessage());
        }
    }

    /**
     * This method renders a single note card to the UI
     * and adds a note object to the noteObjects array.
     * 
     * This method is called by the noteController 
     * when a note has been made.
     * 
     * @param {Dict} note 
     */
    renderNoteCard(note) {
        // Checking if the list-view html element currently says "no notes"
        if (this.noteObjects.size() === 0) {
            this.userFeedbackHandler.removeNoNotesMessage();
        }
        // Creating the html for the note
        const LIST_NOTE_CARD = this.listNote(note);
        const NOTE_CARD = this.note(note);

        // Adding the note html cards to the screen
        this._content.appendChild(NOTE_CARD);
        this._list.appendChild(LIST_NOTE_CARD);
    }

    /** 
     * This method updates a note card and the linked note object
     * in the noteObjects array.
     * 
     * @param {dict} note
     */
    renderNoteUpdate(note) {
        const NOTE_CARDS = new HTMLArray(this._content.children, 'note'); 
        const NOTE_LIST_CARDS = this._list.children;

        for (let i = 0; i < NOTE_CARDS.length; i++) {
            if (NOTE_CARDS[i].id === note.id) {
                // updating the h4 element inside the note card.
                const H4 = NOTE_CARDS[i].querySelector('h4');
                H4.textContent = formatName(note.title);

                // updating the p element inside the note card.
                const P_ELEMENT = NOTE_CARDS[i].querySelector('p');
                P_ELEMENT.innerHTML = note.content;

                // updating the span element inside the note list card
                const SPAN = NOTE_LIST_CARDS[i].querySelector('span');
                SPAN.textContent = formatName(note.title);

                NOTE_CARDS[i].setAttribute("data-info", `${dateFormat(note.creation)}--${dateFormat(note.last_edit)}`);

                // updating the note object 
                this.noteObjects.update(note);
            }
        }
    }

    /**
     * Removes a specific note from the UI.
     * 
     * @param {String} id
     */
    removeNote(note) {
        const ALL_NOTES = new HTMLArray(this._content.children, 'note');
        const ALL_LIST_NOTES = this._list.children;

        for (let i = 0; i < ALL_NOTES.length; i++) {
            if (ALL_NOTES[i].id === note.id) {
                // Removing the html related to the given note 
                this._content.removeChild(ALL_NOTES[i]);
                this._list.removeChild(ALL_LIST_NOTES[i]);
                // Removing the note object 
                this.noteObjects.remove(note);
                // Checking if the note object array is empty
                if (this.noteObjects.size() === 0) {
                    this.userFeedbackHandler.noNotes(new NoNoteMessage());
                }
            }
        }
        this.dialog.hide();
    }

    /**
     * This method creates a note card component 
     * And adds a note object to the noteObjects array. 
     * 
     * @param {Dict} note 
     * @returns A note card component.
     */
    note(note) {
        this.noteObjects.add(note);
        return new Note(note, this);
    }

    /**
     * This method creates a ListNote component and returns it
     * 
     * @param {Dict} note
     * @returns {ListNote} 
     */
    listNote(note) {
        return new ListNote(note, this);
    }

    /**
     * This method renders a confirmation container telling the user if they want to delete the note.
     * 
     * @param {String} id 
     * @param {String} name
     */
    renderDeleteContainer(id, name) {
        this.dialog.addChild(new DeleteContainer(id, name, this));
        this.dialog.show();
    }

    /**
     * This method updates a note
     * 
     * This method will communicate with the note controller 
     * to update a note
     * 
     * @param {String} id 
     * @param {String} name
     */
    async updateNote(id, name, content, bookmark) {
        await this.noteController.updateNote(id, name, content, bookmark);
    }

    /**
     * This method deletes a note.
     * 
     * This method communicates with the note controller
     * to delete the specified note.
     * 
     * @param {String} id
     */
    async handleConfirmButtonClick(id) {
        await this.noteController.deleteNote(id);
    }

    /**
     * This method opens up the text editor
     * And puts the note the user clicked on, in the text editor.
     * 
     * @param {String} content
     * @param {String} name
     */
    handleNoteCardClick(noteId, creation) {
        const NOTE = this.noteObjects.get(noteId);
        const LAST_EDIT = dateFormat(NOTE.last_edit);
        const NAME = NOTE.title;
        const CONTENT = NOTE.content;
        const BOOKMARK = NOTE.bookmark;
        this.noteController.handleNoteCardClick(CONTENT, NAME, creation, LAST_EDIT, noteId, BOOKMARK);
    }
}