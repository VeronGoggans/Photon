import { categoryModalTemplate } from "../../constants/modalTemplates.js";
import { closeDialogEvent } from "../../util/dialog.js";




export class CategoryModal {
    /**
     * Constructs a FolderModal instance.
     *
     * @param {Object} modalData             - Data required for the modal.
     * @param {Object|null} modalData.category - The category to edit (if applicable). If null, a new category is being created.
     * @param {Function} modalData.callBack  - A callback function to handle saving category data.
     * @returns {HTMLElement} The modal DOM element.
     */
    constructor(modalData) {
        this.modalData = modalData;
        this.category = modalData.category;
        this.preferredCategoryColor = null;

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
        this.modal.classList.add('category-modal');
        this.modal.innerHTML = categoryModalTemplate;

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

        this.categoryNameInput = this.modal.querySelector('input');
        this.saveButton = this.modal.querySelector('.save-btn');
        this.cancelButton = this.modal.querySelector('.cancel-btn');
        this.emojiButton = this.modal.querySelector('#open-emoji-picker-btn');
        this.colorOptions = this.modal.querySelectorAll('.category-color-options div');

        if (this.category !== null) {
            this.#loadCategory();
            return
        }

        this.#showActiveCategoryColor('color-original');
    }


    /**
     * Loads the category's data into the modal for editing.
     *
     * @private
     * @description This method will render the current data from the category the user wants to edit on the
     * `CategoryModal`.
     */
    #loadCategory() {
        this.modal.querySelector('h2').textContent = 'Edit category';
        this.modal.querySelector('.save-btn').textContent = 'Save changes';
        this.modal.querySelector('input').value = this.category.name;
        const categoryCSSClass = this.category.color;

        this.#showActiveCategoryColor(categoryCSSClass);
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
            this.categoryNameInput.value = this.categoryNameInput.value + emoji;
        });


        /**
         *
         */
        this.colorOptions.forEach(colorOption => {
            const categoryCSSClass = colorOption.getAttribute('data-category-css-class');

            colorOption.addEventListener('click', () => {
                this.#showActiveCategoryColor(categoryCSSClass)
            });
        });


        /**
         *
         */
        this.saveButton.addEventListener('click', async () => {

            if (this.category !== null) {
                await this.modalData.callBack({
                    'id': this.category.id,
                    'name': this.categoryNameInput.value,
                    'color': this.preferredCategoryColor
                })
            }

            else {
                await this.modalData.callBack({
                    'name': this.categoryNameInput.value || 'Untitled',
                    'color': this.preferredCategoryColor
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
     * The `#showActiveCategoryColor` method updates the visual state of category color options
     * in the UI by highlighting the currently selected color and storing it as the preferred
     * category color. It iterates over an array of color options, modifies their classes to
     * reflect the active selection, and updates the internal state.
     *
     * @private
     * @method
     * @name #showActivecategoryColor
     * @description This method ensures that only the category color option matching the
     * given `styleClass` is highlighted by adding the `selected-category-color` class to it.
     * Other color options have the `selected-category-color` class removed. The selected
     * color is saved as `this.preferredCategoryColor`.
     *
     * @param {string} categoryCSSClass   - The CSS class corresponding to the selected category color.
     */
    #showActiveCategoryColor(categoryCSSClass) {
        for (let colorOption of this.colorOptions) {
            if(colorOption.getAttribute('data-category-css-class') !== categoryCSSClass) {
                colorOption.classList.remove('selected-category-color');
                continue
            }
            this.preferredcategoryColor = categoryCSSClass;
            colorOption.classList.add('selected-category-color');
        }
    }
}