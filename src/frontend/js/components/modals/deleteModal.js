import { dialogEvent } from "../../util/dialog.js";
import { deleteModalTemplate } from "../../constants/modalTemplates.js";



export class DeleteModal {
    constructor(controller, id, name, notify, additions) {
        this.id = id;
        this.notify = notify;
        this.name = name;
        this.controller = controller;
        this.additions = additions;
        this.modal = document.createElement('div');
        this.modal.classList.add('delete-modal');
        this.modal.innerHTML = deleteModalTemplate;

        this.handleDelete = () => { this.#deleteItem() };
        this.#initElements();
        this.#eventListeners();
        return this.modal;
    }



    #initElements() {
        this.modal.querySelector('b').textContent = `"${this.name}"`;

        this.cancelButton = this.modal.querySelector('.cancel-btn');
        this.confirmButton = this.modal.querySelector('.delete-btn');
        this.input = this.modal.querySelector('input');
    }


    /**
     * This method will Permanently delete the specified item
     */
    #deleteItem() {
        const { boardType } = this.additions;

        // Double check because why not
        if (this.input.value !== this.name) {
            return;
        }

        else if (this.notify) {
            this.controller.handleDeleteButtonClick(this.id);
        }

        else if (boardType !== null) {
            this.controller.delete(this.id, boardType);
        }

        else {
            this.controller.delete(this.id);
        }

        dialogEvent(this.modal, 'close');
    }



    #eventListeners() {

        // Cancel the delete process e.g. close the modal.
        this.cancelButton.addEventListener('click', () => {
            dialogEvent(this.modal, 'close');
        })


        // Only add the delete event listener if the input value matches the name
        // of the specified item e.g. folder, note, template, sticky board.
        this.input.addEventListener('input', () => {

            if (this.input.value === this.name) {
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