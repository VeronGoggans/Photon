import { closeDialogEvent } from "../../util/dialog.js";
import {
    organisationModalContextText, organisationModalEntityNameText, organisationModalIcons,
    organisationModalNewButtonText,
    organisationModalNewTitleText, organisationModalUpdateButtonText, organisationModalUpdateTitleText
} from "../../constants/constants.js";




class OrganisationModal extends HTMLElement {
    constructor() {
        super();
        this.selectedFolderAppearance = null;
    }

    /**
     *
     * @param { Object } modalData                   - Data required for the modal.
     * @param { string } modalData.entityType        - The type of entity ("Folder" or "Category").
     * @param { Object|null } modalData.entity       - The entity to edit (if applicable). If null, a new entity is being created.
     * @param { string } modalData.eventTriggeredInsideFolder
     * @param { Function } modalData.callBack        - A callback function to handle saving entity data.
     *
     *
     * @param { string } modalData.entity.id        - The ID of the entity e.g. folder or category
     * @param { string } modalData.entity.name      - The name of the entity e.g. folder or category
     * @param { string } modalData.entity.color     - The color of the entity e.g. folder or category
     */
    setData(modalData) {
        this.modalData = modalData;
        this.entity = modalData.entity;
        this.entityType = modalData.entityType;
        this.eventTriggeredInsideFolder = modalData.eventTriggeredInsideFolder;
    }


    connectedCallback() {
        this.render();
        this.addEventListeners();
    }


    render() {
        this.innerHTML = `
            <h2><i class="${organisationModalIcons[this.entityType]}"></i>${organisationModalNewTitleText[this.entityType]}</h2>
            <div class="folder-settings">
                <p>${organisationModalContextText[this.entityType]}</p>
                <span id="title">${organisationModalEntityNameText[this.entityType]}</span>
                <input type="text" placeholder="Untitled" spellcheck="false">
                <i id="open-emoji-picker-btn" class="bi bi-emoji-grin"></i>
                <span id="title">Appearance</span>
                
                <appearance-options entity-name=${this.entityType}></appearance-options>
                
                <div class="buttons-container">
                    <button class="modal-cancel-button cancel-btn dialog-button">Cancel</button>
                    <button class="modal-confirm-button save-btn dialog-button">${organisationModalNewButtonText[this.entityType]}</button>
                </div>
                
                <div class="emoji-picker-container">
                    <emoji-picker></emoji-picker>
                </div>
            </div>
        `

        this.entityNameInput = this.querySelector('input');
        this.saveButton = this.querySelector('.save-btn');
        this.cancelButton = this.querySelector('.cancel-btn');
        this.emojiButton = this.querySelector('#open-emoji-picker-btn');
        this.appearanceComponent = this.querySelector('appearance-options');
        this.emojiPickerContainer = this.querySelector('.emoji-picker-container');
        this.emojiPicker = this.querySelector('emoji-picker');

        if (this.entity !== null) {
            this.#loadEntity();
            return
        }

        this.appearanceComponent.showSelectedAppearance('color-original');
    }



    /**
     * Loads the entity's data into the modal for editing.
     *
     * @private
     */
    #loadEntity() {
        this.querySelector('h2').innerHTML = `<i class="${organisationModalIcons[this.entityType]}"></i>${organisationModalUpdateTitleText[this.entityType]}`;
        this.querySelector('.save-btn').textContent = organisationModalUpdateButtonText[this.entityType];
        this.querySelector('input').value = this.entity.name;
        this.appearanceComponent.showSelectedAppearance(this.entity.color);
        this.selectedFolderAppearance = this.entity.color;
    }


    /**
     * Attaches event listeners to modal elements for user interactions.
     *
     * @private
     */
    addEventListeners() {

        /**
         *
         */
        this.addEventListener('click', (event) => {
            const excludedContainers = ['.emoji-picker-container', '#open-emoji-picker-btn'];

            // Check if the clicked target belongs to any excluded container
            if (excludedContainers.some(selector => event.target.closest(selector))) {
                return;
            }
            this.emojiPickerContainer.classList.remove('open-emoji-picker');
        });


        /**
         *
         */
        this.emojiPicker.addEventListener('emoji-click', event => {
            const emoji = event.detail.unicode;
            this.entityNameInput.value = this.entityNameInput.value + emoji;
        });


        /**
         * This event listener will listen for clicks on the  color options for that entity.
         */
        this.addEventListener('appearance-option-click', (event) => {
            this.selectedFolderAppearance = event.detail.color;
        })


        /**
         * This event listener will save the new or updated entity (folder or category)
         * to the backend.
         *
         * After it'll close the dialog by emitting a closeDialogEvent.
         */
        this.saveButton.addEventListener('click', async () => {

            if (this.entity !== null) {
                await this.modalData.callBack({
                    'id': this.entity.id,
                    'name': this.entityNameInput.value,
                    'color': this.selectedFolderAppearance,
                    'eventTriggeredInsideFolder': this.eventTriggeredInsideFolder
                })    
                
            }

            else {
                await this.modalData.callBack({
                    'name': this.entityNameInput.value || 'Untitled',
                    'color': this.selectedFolderAppearance
                })
            }

            closeDialogEvent(this);
        });

        /**
         * This event listener will close the dialog by emitting a closeDialogEvent
         */
        this.cancelButton.addEventListener('click', () => {
            closeDialogEvent(this);
        });

        /**
         * This event listener will open the emoji container by adding the
         * open-emoji-picker css class to the element
         */
        this.emojiButton.addEventListener('click', () => {
            this.emojiPickerContainer.classList.add('open-emoji-picker');
        })
    }
}


customElements.define('organisation-modal', OrganisationModal);
