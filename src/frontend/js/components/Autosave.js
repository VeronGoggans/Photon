/**
 * A class for implementing automatic saving functionality for a `contenteditable` element.
 *
 * The `AutoSave` class listens for changes in a `contenteditable` element and saves the
 * content after a specified delay, ensuring that saving operations are not triggered
 * excessively during rapid input events. This is achieved through debouncing.
 *
 * Features:
 * - Detects user input events such as typing, deleting, pasting or formatting.
 * - Delays save operations to avoid unnecessary processing.
 * - Executes a user-defined callback function to handle saving.
 *
 * Example Usage:
 * ```javascript
 * const saveCallback = (content) => {
 *     console.log("Saved content:", content);
 *     // Implement your save logic here, e.g., send an API request.
 * };
 *
 * const autoSave = new AutoSave('.editable', saveCallback, 2000);
 * ```
 */
export class AutoSave {
    constructor(contentEditableSelector, saveCallback, delay = 1000) {
        this.contentEditable = document.querySelector(contentEditableSelector); // Select the contenteditable element
        this.saveCallback = saveCallback;                                       // Callback function to save content
        this.delay = delay;                                                     // Delay in milliseconds
        this.timeoutId = null;                                                  // Timeout ID for debouncing

        // Bind event listener
        this.init();
    }



    /**
     * Delays the execution of the given callback function until after a specified
     * delay period has elapsed since the last time this method was invoked. This is
     * useful for limiting the rate at which a function is executed (e.g., to avoid
     * excessive calls during rapid input events).
     *
     * @param { Function } callback - The function to be executed after the delay.
     * @param { Number } delay      - The delay period in milliseconds.
     */
    debounce(callback, delay) {

        clearTimeout(this.timeoutId); // Clear the previous timeout
        this.timeoutId = setTimeout(() => {
            callback();
        }, delay);
    }



    /**
     *
     */
    saveContent() {
        const content = this.contentEditable.innerHTML; // Get the content
        this.saveCallback(content); // Call the save callback
    }



    /**
     * Initializes the AutoSave instance by attaching an `input` event
     * listener to the contenteditable element specified by the selector.
     *
     * The event listener is triggered whenever the user modifies the content
     * (e.g., typing, deleting, or pasting text). Each input event invokes the
     * `debounce` method, which delays the execution of the `saveContent` method
     * until the specified delay period has passed without further input.
     *
     * This ensures that saving is only triggered after the user stops typing
     * for the configured delay, reducing unnecessary save operations.
     */
    init() {
        this.contentEditable.addEventListener('input', () => {
            this.debounce(() => this.saveContent(), this.delay);
        });
    }
}