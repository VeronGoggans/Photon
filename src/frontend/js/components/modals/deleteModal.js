import { dialogEvent } from "../../util/dialog.js";




export class DeleteModal {
    constructor(controller, id, name, notify, additionals) {
        this.id = id;
        this.notify = notify;
        this.controller = controller;
        this.additionals = additionals;
        this.modal = document.createElement('div');
        this.modal.classList.add('delete-modal');
        this.modal.innerHTML = `
            <p class="delete-warning">Press Confirm to delete</p>
            <strong class="deleted-item-name">${name}</strong>
            <button>Confirm</button>
        `
        this.#eventListeners();
        return this.modal;
    }

    #eventListeners() {
        this.modal.querySelector('button').addEventListener('click', () => {

            const { boardType } = this.additionals;
                        

            if (this.notify) {
                this.controller.handleDeleteButtonClick(this.id);
                dialogEvent(this.modal, 'close');
                return
            }

            if (boardType !== null) {
                this.controller.delete(this.id, boardType);
                dialogEvent(this.modal, 'close');
                return    
            }

            this.controller.delete(this.id);
            dialogEvent(this.modal, 'close');
        })
    }
}