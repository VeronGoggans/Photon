import { CNode } from "../../util/CNode.js";
import { modalPlaceholderText, modalNewTitleText, modalUpdateTitleText, modalButtonText } from "../../constants/constants.js";
import { dialogEvent } from "../../util/dialog.js";


export class NewCollectionModal {
    constructor(controller, entity, entityData = null) {
        this.controller = controller;
        this.entityData = entityData;
        this.entity = entity;

        this.action = 'add';
        
        this.HOST = CNode.create('div', {'class': 'new-collection-modal'});
        this.DIV = document.createElement('div');
        this.MODAL_TITLE = CNode.create('h2', {'textContent': modalNewTitleText[entity]});
        this.NAME = CNode.create('input', {'type': 'text', 'placeholder': modalPlaceholderText[entity], 'spellCheck': false});
        this.DESCRIPTION = CNode.create('textarea', {'placeholder': 'Type something here...', 'spellCheck': false});
        this.SAVE_BTN = CNode.create('button', {'class': 'save-btn', 'textContent': modalButtonText[entity]});

        if (entityData !== null) {
            this.#setEntity();
        }

        this.#eventListeners();
        return this.#render();
    }

    #setEntity() {
        this.HOST.id = this.entityData.id;
        this.action = 'update';
        this.MODAL_TITLE.textContent =  modalUpdateTitleText[this.entity];
        this.SAVE_BTN.textContent = 'Save'
        this.NAME.value = this.entityData.name;        
        this.DESCRIPTION.value = this.entityData.description;
    }


    #eventListeners() {
        this.SAVE_BTN.addEventListener('click', async () => {
            if (this.action == 'add') {
                await this.controller.add({
                    'name': this.NAME.value,
                    'description': this.DESCRIPTION.value
                })
            }
            else {
                await this.controller.update({
                    "id": this.HOST.id,
                    "name": this.NAME.value,
                    "description": this.DESCRIPTION.value
                })
            } 
            dialogEvent(this.HOST, 'close');
        })
    }


    #render() {
        this.DIV.append(this.NAME, this.DESCRIPTION)
        this.HOST.append(this.MODAL_TITLE, this.DIV, this.SAVE_BTN);
        return this.HOST;
    }
}