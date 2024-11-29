import { CNode } from "../../util/CNode.js";
import { dialogEvent } from "../../util/dialog.js";

export class DeleteModal {
    constructor(controller, id, name, notify) {
        this.id = id;
        this.notify = notify;
        this.controller = controller;
        this.HOST = CNode.create('div', {'class': 'delete-modal'});
        this.HOST.innerHTML = `
            <p class="delete-warning">Press Confirm to delete</p>
            <strong class="deleted-item-name">${name}</strong>
            <button>Confirm</button>
        `
        this.#eventListeners();
        return this.HOST;
    }

    #eventListeners() {
        this.HOST.querySelector('button').addEventListener('click', () => {

            if (this.notify) {
                this.controller.handleDeleteButtonClick(this.id);
                dialogEvent(this.HOST, 'close');
                return
            }
            this.controller.delete(this.id);
            dialogEvent(this.HOST, 'close');
        })
    }
}