import { editFolderModalTemplate } from "../../constants/modalTemplates.js";
import { closeDialogEvent } from "../../util/dialog.js";




export class FolderModal {
    /**
     * Constructs a FolderModal instance.
     *
     * @param {Object} modalData             - Data required for the modal.
     * @param {Object|null} modalData.folder - The folder to edit (if applicable). If null, a new folder is being created.
     * @param {Function} modalData.callBack  - A callback function to handle saving folder data.
     * @returns {HTMLElement} The modal DOM element.
     */
    constructor(modalData) {
        this.modalData = modalData;
        this.folder = modalData.folder;
        this.eventTriggeredInsideFolder = modalData.eventTriggeredInsideFolder;
        this.preferredFolderColor = null;

        this.#initElements();
        this.#eventListeners();
        return this.modal
    }


    /**
     * Initializes the modal DOM elements and sets the initial state of the modal.
     *
     * @private
     */
    #initElements() {
        this.modal = document.createElement('div');
        this.modal.classList.add('edit-folder-modal');
        this.modal.innerHTML = editFolderModalTemplate;

        this.emojiPickerContainer = document.createElement('div');
        this.emojiPickerContainer.classList.add('emoji-picker-container');

        this.picker = document.createElement('emoji-picker');
        this.picker.categories = [
            'smileys-emotion',
            'people-body',
            'animals-nature',
            'food-drink',
            'travel-places',
            'activities',
            'objects',
            'symbols'
        ];
        this.emojiPickerContainer.appendChild(this.picker);
        this.modal.appendChild(this.emojiPickerContainer);

        this.folderNameInput = this.modal.querySelector('input');
        this.saveButton = this.modal.querySelector('.save-btn');
        this.cancelButton = this.modal.querySelector('.cancel-btn');
        this.emojiButton = this.modal.querySelector('#open-emoji-picker-btn');
        this.colorOptions = this.modal.querySelectorAll('.folder-color-options div');

        if (this.folder !== null) {
            this.#loadFolder();
            return
        }

        this.#showActiveFolderColor('color-original');
    }


    /**
     * Loads the folder's data into the modal for editing.
     *
     * @private
     * @description This method will render the current data from the folder the user wants to edit on the
     * `FolderModal`.
     */
    #loadFolder() {
        this.modal.querySelector('h2').textContent = 'Edit folder';
        this.modal.querySelector('.save-btn').textContent = 'Save changes';
        this.modal.querySelector('input').value = this.folder.name;
        const folderCSSClass = this.folder.color;

        this.#showActiveFolderColor(folderCSSClass);
    }


    /**
     * Attaches event listeners to modal elements for user interactions.
     *
     * @private
     */
    #eventListeners() {

        /**
         *
         */
        this.modal.addEventListener('click', (event) => {
            const excludedContainers = ['.emoji-picker-container', '#open-emoji-picker-btn'];

            // Check if the clicked target belongs to any excluded container
            if (excludedContainers.some(selector => event.target.closest(selector))) {
                return;
            }
            this.emojiPickerContainer.classList.remove('open-emoji-picker');
        });


        this.picker.addEventListener('emoji-click', event => {
            const emoji = event.detail.unicode;
            this.folderNameInput.value = this.folderNameInput.value + emoji;
        });


        /**
         *
         */
        this.colorOptions.forEach(colorOption => {
            const folderCSSClass = colorOption.getAttribute('data-folder-css-class');

            colorOption.addEventListener('click', () => {
                this.#showActiveFolderColor(folderCSSClass)
            });
        });


        /**
         *
         */
        this.saveButton.addEventListener('click', async () => {

            if (this.folder !== null) {
                await this.modalData.callBack({
                    'id': this.folder.id,
                    'name': this.folderNameInput.value,
                    'color': this.preferredFolderColor,
                    'eventTriggeredInsideFolder': this.eventTriggeredInsideFolder
                })    
            }

            else {
                await this.modalData.callBack({
                    'name': this.folderNameInput.value || 'Untitled',
                    'color': this.preferredFolderColor
                })
            }

            closeDialogEvent(this.modal);
        });

        /**
         *
         */
        this.cancelButton.addEventListener('click', () => {
            closeDialogEvent(this.modal);
        });

        /**
         *
         */
        this.emojiButton.addEventListener('click', () => {
            this.emojiPickerContainer.classList.add('open-emoji-picker');
        })
    }



    /**
     * The `#showActiveFolderColor` method updates the visual state of folder color options
     * in the UI by highlighting the currently selected color and storing it as the preferred
     * folder color. It iterates over an array of color options, modifies their classes to
     * reflect the active selection, and updates the internal state.
     *
     * @private
     * @method
     * @name #showActiveFolderColor
     * @description This method ensures that only the folder color option matching the
     * given `styleClass` is highlighted by adding the `selected-folder-color` class to it.
     * Other color options have the `selected-folder-color` class removed. The selected
     * color is saved as `this.preferredFolderColor`.
     *
     * @param {string} folderCSSClass   - The CSS class corresponding to the selected folder color.
     */
    #showActiveFolderColor(folderCSSClass) {
        for (let colorOption of this.colorOptions) {
            if(colorOption.getAttribute('data-folder-css-class') !== folderCSSClass) {
                colorOption.classList.remove('selected-folder-color');
                continue
            }
            this.preferredFolderColor = folderCSSClass;
            colorOption.classList.add('selected-folder-color');
        }
    }  
}