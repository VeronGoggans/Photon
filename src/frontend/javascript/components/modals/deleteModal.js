import { deleteModalTemplate } from "../../constants/modalTemplates.js";
import { closeDialogEvent } from "../../util/dialog.js";




export class DeleteModal {
    constructor(modalData) {
        this.modalData = modalData;

        // The modal UI element
        this.modal = document.createElement('div');
        this.modal.classList.add('delete-modal');
        this.modal.innerHTML = deleteModalTemplate;


        this.handleDelete = async () => { await this.#deleteItem() };
        this.#initElements();
        this.#eventListeners();
        return this.modal;
    }



    #initElements() {
        this.modal.querySelector('b').textContent = `"${this.modalData.name}"`;

        this.cancelButton = this.modal.querySelector('.cancel-btn');
        this.confirmButton = this.modal.querySelector('.delete-btn');
        this.input = this.modal.querySelector('input');
    }


    /**
     * This method will Permanently delete the specified item
     */
    async #deleteItem() {
        // Double check because why not
        if (this.input.value !== this.modalData.name) {
            return;
        }

        // Executing the provided callback function.
        await this.modalData.callBack(this.modalData);
        closeDialogEvent(this.modal);
    }



    #eventListeners() {

        // Cancel the delete process e.g. close the modal.
        this.cancelButton.addEventListener('click', () => {
            closeDialogEvent(this.modal);
        })


        // Only add the delete event listener if the input value matches the name
        // of the specified item e.g. folder, note, template, sticky board.
        this.input.addEventListener('input', () => {

            if (this.input.value === this.modalData.name) {
                // Visual feedback that the user can now click on the confirm button
                this.input.style.borderColor = '#5c7fdd';

                // Add an event listener to delete the specified ( folder, note, template, sticky board )
                this.confirmButton.addEventListener('click', this.handleDelete);

                console.log('add listener')

            }

            else  {
                // Visual feedback that the user has not matched the input value
                // with the specified item name.
                this.input.style.borderColor = 'var(--inactive-border)';

                // Remove the event listener to delete the specified ( folder, note, template, sticky board )
                this.confirmButton.removeEventListener('click', this.handleDelete);
                console.log('remove listener')
            }

        })
    }
}