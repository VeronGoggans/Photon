import { dialogEvent } from "../../util/dialog.js";
import { newStickyBoardModalTemplate } from "../../constants/modalTemplates.js";


export class NewStickyBoardModel {
    constructor(controller = null) {
        this.controller = controller;

        this.HOST = document.createElement('div');
        this.HOST.classList.add('new-sticky-board-modal');
        this.HOST.innerHTML = newStickyBoardModalTemplate;

        this.boardType = 'board';
        this.#eventListeners();
        return this.HOST
    }



    #eventListeners() {
        /**
         * Event listener for adding a new sticky board
         */
        this.HOST.querySelector('.save-btn').addEventListener('click', (e) => {
            this.controller.add({
                'name': this.HOST.querySelector('input').value,
                'description': '',
                'type': this.boardType
            })
            dialogEvent(this.HOST, 'close');
        })


        /**
         * Event listener for closing the new sticky board modal
         */
        this.HOST.querySelector('.cancel-btn').addEventListener('click', (e) => {
            dialogEvent(this.HOST, 'close');
        })


        /**
         * Event listener for toggling the sticky board type
         */
        this.HOST.querySelector('.board-types').addEventListener('click', (e) => {
            if (e.target.closest('.type-one')) {
                this.HOST.querySelector('.type-one').classList.add('selected-board-type');
                this.HOST.querySelector('.type-two').classList.remove('selected-board-type');
            }
            else if (e.target.closest('.type-two')) {
                this.HOST.querySelector('.type-two').classList.add('selected-board-type');
                this.HOST.querySelector('.type-one').classList.remove('selected-board-type');
            }
        })
    }
}