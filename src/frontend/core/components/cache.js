import {ArrayNavigator} from "../datastuctures/array.js";

/**
 * NotesCache is a simple caching utility for managing a collection of notes.
 * It provides methods to add, update, and delete notes efficiently.
 */
export class EditorNotesCache extends ArrayNavigator {
    /**
     * Constructs a new NotesCache instance.
     *
     */
    constructor() {
        /**
         * The array that holds all cached notes.
         *
         * @type {Array<Object>}
         */
        super();
    }

    /**
     * Adds a new note to the cache.
     *
     * @param {Object} note - The note object to be added.
     * The note should have a unique `id` property.
     */
    addNote(note) {
        this.array.push(note);
        console.log('added a note to the cache: ')
        console.log(note)
    }

    /**
     * Updates an existing note in the cache.
     * If a note with the same `id` is found, it is replaced with the provided note.
     *
     * @param {Object} note - The updated note object.
     * The note must have an `id` property that matches an existing cached note.
     */
    updateNote(note) {
        const index = this.array.findIndex(cachedNote => cachedNote.id === note.id);

        if (index !== -1) {
            // Update the note at the found index
            this.array[index] = note;
        }
    }

    /**
     * Deletes a note from the cache.
     * If a note with the matching `id` is found, it is removed from the cache.
     *
     * @param {Object} note - The note object to be deleted.
     * The note must have an `id` property that matches an existing cached note.
     */
    deleteNote(note) {
        const index = this.array.findIndex(cachedNote => cachedNote.id === note.id);

        if (index !== -1) {
            // Remove the note at the found index
            this.array.splice(index, 1);
            console.log(`Deleted note with id ${note.id} from the cache.`);
            console.log(this.array);
        }
    }
}
