import { AnimationHandler } from "../handlers/animationHandler.js";
import { Dialog } from "../util/dialog.js";
import { StickyBoardTypes } from "../constants/constants.js";


export class StickyWallHomeView {
    constructor(controller, applicationController) {
        this.controller = controller;
        this.applicationController = applicationController;

        this.dialog = new Dialog();
        this.#initElements();
        this.#eventListeners();
        AnimationHandler.fadeInFromBottom(this.viewElement);

    }



    /**
     * This method will render an array of sticky board objects in their dedicated section
     * e.g. standard or column boards
     * 
     * @param { Array[Object] } stickyBoards 
     */
    renderAll(stickyBoards) {
        const { standardStickyBoards, columnStickyBoards } = stickyBoards;

        if (standardStickyBoards.length > 0) {
            // Show the standard sticky boards title 
            this._standardBlockTitle.style.display = '';
            this._standardStickyBoardsList.style.display = '';
        }

        if (columnStickyBoards.length > 0) {
            // show the column sticky boards title 
            this._columnBlockTitle.style.display = '';
            this._columnStickyBoardsList.style.display = '';
        }

        // Render the sticky boards 
        const standardContentFragment = document.createDocumentFragment();
        const columnContentFragment = document.createDocumentFragment();

        for (let i = 0; i < standardStickyBoards.length; i++) {

            const stickyBoardCard = this.#createStickyBoardCard(standardStickyBoards[i])
            AnimationHandler.fadeInFromBottom(stickyBoardCard);
            standardContentFragment.appendChild(stickyBoardCard);
        }

        for (let i = 0; i < columnStickyBoards.length; i++) {

            const stickyBoardCard = this.#createStickyBoardCard(columnStickyBoards[i])
            AnimationHandler.fadeInFromBottom(stickyBoardCard);
            columnContentFragment.appendChild(stickyBoardCard); 
        }


        this._standardStickyBoardsList.appendChild(standardContentFragment);
        this._columnStickyBoardsList.appendChild(columnContentFragment);
    }





    /**
     * This method will render a single sticky board
     * on the dedicated boards section e.g. standard or column boards
     * 
     * @param { Object } stickyBoard - Representing the newly created sticky board
     */
    renderOne(stickyBoard) {

        const { type } = stickyBoard;
        const stickyBoardCard = this.#createStickyBoardCard(stickyBoard);

        if (type === StickyBoardTypes.STANDARD && this._standardStickyBoardsList.children.length === 0) {
            // show the standard sticky boards title
            this._standardBlockTitle.style.display = '';
            this._standardStickyBoardsList.style.display = '';
        }

        if (type === StickyBoardTypes.COLUMN && this._columnStickyBoardsList.children.length === 0) {
            // show the column sticky boards title
            this._columnBlockTitle.style.display = '';
            this._columnStickyBoardsList.style.display = '';
        }

        if (type === StickyBoardTypes.STANDARD) {
            this._standardStickyBoardsList.appendChild(stickyBoardCard);
        }

        if (type === StickyBoardTypes.COLUMN) {
            this._columnStickyBoardsList.appendChild(stickyBoardCard);
        }

        AnimationHandler.fadeInFromBottom(stickyBoardCard);
    }




    /**
     * This method will delete a specified sticky board
     * 
     * @param { Number } stickyBoardId - The ID of the sticky board to delete
     */
    renderDelete(stickyBoardId) {
        const standardStickyBoards = this._standardStickyBoardsList.children;
        const columnStickyBoards = this._columnStickyBoardsList.children;
        let stickyBoardFound = false;
        
        for (let i = 0; i < standardStickyBoards.length; i++) {
            if (standardStickyBoards[i].id === String(stickyBoardId)) {

                if (this._standardStickyBoardsList.children.length === 1) {
                    this._standardBlockTitle.style.display = 'none';
                    this._standardStickyBoardsList.style.display = 'none';
                }
                AnimationHandler.fadeOutCard(standardStickyBoards[i]);
                stickyBoardFound = true;
            }
        }

        // If the sticky board is not present in the standard list search through the column list
        if (!stickyBoardFound) {
            for (let i = 0; i < columnStickyBoards.length; i++) {
                if (columnStickyBoards[i].id === String(stickyBoardId)) {

                    if (this._columnStickyBoardsList.children.length === 1) {
                        this._columnBlockTitle.style.display = 'none';
                        this._columnStickyBoardsList.style.display = 'none';
                    }
                    AnimationHandler.fadeOutCard(columnStickyBoards[i])
                }
            }
        }
    }


    /**
     * This method will create a single StickyBoard component.
     *
     * @param stickyBoard        - A sticky board object.
     * @returns { HTMLElement }  - A sticky board component.
     */
    #createStickyBoardCard(stickyBoard) {
        const stickyBoardCard = document.createElement('sticky-board');
        stickyBoardCard.setData(stickyBoard)
        return stickyBoardCard
    }



    #eventListeners() {
        this._addNewstickyWallButton.addEventListener('click', () => {
            this.dialog.renderNewStickyBoardModal(this.controller)
        });

        this.viewElement.addEventListener('StickyBoardClick', (event) => {
            const { stickyBoard } = event.detail;
            this.applicationController.initView('standardStickyBoard',
                {
                    stickyBoard: stickyBoard,
                    previousView: 'stickyWallHome', 
                }
            )
        })

        this.viewElement.addEventListener('DeleteStickyBoard', (event) => {
            const { stickyBoard } = event.detail
            const additionals = { 'boardType': stickyBoard.type }
            this.dialog.renderDeleteModal(this.controller, stickyBoard.id, stickyBoard.name, false, additionals);
        })
    }




    #initElements() {
        this.viewElement = document.querySelector('.sticky-home-view');
        this._standardStickyBoardsList = document.querySelector('#standard-boards');
        this._columnStickyBoardsList = document.querySelector('#column-boards');

        this._standardBlockTitle = document.querySelector('#standard-sticky-boards-block-title');
        this._columnBlockTitle = document.querySelector('#column-sticky-boards-block-title');
        this._addNewstickyWallButton = document.querySelector('.add-sticky-board-btn');

        this._standardBlockTitle.style.display = 'none';
        this._columnBlockTitle.style.display = 'none';
        this._standardStickyBoardsList.style.display = 'none';
        this._columnStickyBoardsList.style.display = 'none';
    }
}