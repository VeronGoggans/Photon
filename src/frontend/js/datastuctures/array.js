/**
 * The ArrayNavigator class provides a way to navigate through an array
 * using `getNext()` and `getPrevious()` methods. It maintains an internal
 * index to track the current position in the array.
 */
export class ArrayNavigator {
    /**
     * Constructs an ArrayNavigator instance.
     * Initializes an empty array and sets the current index to -1.
     */
    constructor(array = null) {
        /**
         * The internal array to navigate.
         * @type {Array<*>}
         */
        this.array = array;

        /**
         * The current index in the array. Starts at -1 (before the first element).
         * @type {number}
         */
        this.index = 0;

    }


    /**
     * Retrieves the next element in the array.
     * Advances the current index by one.
     *
     * @returns {*} The next element in the array, or `undefined` if at the end.
     */
    getNext() {
        if (this.index < this.array.length - 1) {
            this.index++;
            return this.array[this.index];
        }
        // Move to the start of the list
        this.index = 0;
        return this.array[this.index];
    }


    /**
     * Retrieves the previous element in the array.
     * Decreases the current index by one.
     *
     * @returns {*} The previous element in the array, or `undefined` if at the beginning.
     */
    getPrevious() {
        if (this.index > 0) {
            this.index--;
            return this.array[this.index];
        }
        // Move to the end of the list
        this.index = this.array.length - 1;
        return this.array[this.index];
    }


    setIndex(noteId) {
        this.index = this.array.findIndex(note => note.id === noteId);
    }


    /**
     *
     * @param array
     */
    setArray(array) {
        console.log(array)
        // Empty arrays will trigger this condition.
        if (array.length === 0) {
            this.array = array;
            console.log('empty array loaded')
        }

        else if (this.array === null) {
            this.array = array;
            console.log('array loaded from home screen')
        }

        else if (this.array.length === 0) {
            this.array = array;
            console.log('new array loaded')
        }

        // First check if both arrays are not empty
        else if (this.array.length > 0 && array.length > 0) {
            // If the ID of the first note in the provided array, is NOT the same as the ID of the first note in the stored array,
            // the new array will be loaded.
            const storedFirstNote = this.array[0];
            const providedFirstNote = array[0];

            if (storedFirstNote.id !== providedFirstNote.id) {
                this.array = array;
                console.log('new array loaded')
            }

            // If the ID's of the first indexes are the same, nothing happens.
            // Else the same array would be loaded which is a waste of resources.
            else {
                console.log('Skipping storing array, as it is already loaded')
            }
        }
    }
}
