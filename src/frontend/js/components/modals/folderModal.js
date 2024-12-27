import { editFolderModalTemplate } from "../../constants/modalTemplates.js";
import { closeDialogEvent } from "../../util/dialog.js";




export class FolderModal {
    constructor(modalData) {
        this.modalData = modalData;
        this.folder = modalData.folder;
        this.preferedFolderColor = null;

        this.#initElements();
        this.#eventListeners();
        return this.modal
    }


    #initElements() {
        this.modal = document.createElement('div');
        this.modal.classList.add('edit-folder-modal');
        this.modal.innerHTML = editFolderModalTemplate;
        this.colorsArray = this.modal.querySelectorAll('.folder-color-options div');

        if (this.folder !== null) {
            this.#loadFolder();
            return
        }

        this.#showActiveFolderColor('rgb(255, 255, 255)');
    }


    #loadFolder() {
        this.modal.querySelector('h2').textContent = 'Edit folder';
        this.modal.querySelector('.save-btn').textContent = 'Save changes';
        this.modal.querySelector('input').value = this.folder.name;
        this.#showActiveFolderColor(this.folder.color);
    }


    #eventListeners() {
        this.colorsArray.forEach(colorElement => {
            const color = colorElement.style.backgroundColor;
            colorElement.addEventListener('click', () => {this.#showActiveFolderColor(color)});
        });


        /**
         *
         */
        this.modal.querySelector('.save-btn').addEventListener('click', async () => {

            if (this.folder !== null) {
                await this.modalData.callBack({
                    'id': this.folder.id,
                    'name': this.modal.querySelector('input').value,
                    'color': this.preferedFolderColor
                })    
            }

            else {
                await this.modalData.callBack({
                    'name': this.modal.querySelector('input').value || 'Untitled',
                    'color': this.preferedFolderColor
                })
            }

            closeDialogEvent(this.modal);
        });

        this.modal.querySelector('.cancel-btn').addEventListener('click', () => {
            closeDialogEvent(this.modal);
        });
    }



    #showActiveFolderColor(color) {
        for (let i = 0; i < this.colorsArray.length; i++) {
            const colorDiv = this.colorsArray[i];

            if (colorDiv.style.backgroundColor !== color) {
                colorDiv.classList.remove('selected-folder-color');                
                continue
            }
            this.preferedFolderColor = color;
            colorDiv.classList.add('selected-folder-color');
        }
    }  
}