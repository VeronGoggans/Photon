import { newStickyBoardModalTemplate } from "../../constants/modalTemplates.js";
import { closeDialogEvent } from "../../util/dialog.js";



export class StickyBoardModel {
    constructor(modalData) {
        this.modalData = modalData;
        this.modal = document.createElement('div');
        this.modal.classList.add('new-sticky-board-modal');
        this.modal.innerHTML = newStickyBoardModalTemplate;

        this.boardType = 'standard';
        this.#eventListeners();
        return this.modal
    }



    #eventListeners() {
        /**
         * Event listener for adding a new sticky board
         */
        this.modal.querySelector('.save-btn').addEventListener('click', (e) => {
            this.modalData.callBack({
                'name': this.modal.querySelector('input').value,
                'type': this.boardType
            })
            closeDialogEvent(this.modal);
        })


        /**
         * Event listener for closing the new sticky board modal
         */
        this.modal.querySelector('.cancel-btn').addEventListener('click', (e) => {
            closeDialogEvent(this.modal);
        })


        /**
         * Event listener for toggling the sticky board type
         */
        this.modal.querySelector('.board-types').addEventListener('click', (e) => {
            if (e.target.closest('.type-one')) {
                this.modal.querySelector('.type-one').classList.add('selected-board-type');
                this.modal.querySelector('.type-two').classList.remove('selected-board-type');
                this.boardType = 'standard'
            }
            else if (e.target.closest('.type-two')) {
                this.modal.querySelector('.type-two').classList.add('selected-board-type');
                this.modal.querySelector('.type-one').classList.remove('selected-board-type');
                this.boardType = 'column'
            }
        })
    }
}