import { AnimationHandler } from "../handlers/animationHandler.js";
import { Dialog } from "../util/dialog.js";


export class StickyWallHomeView {
    constructor(controller, applicationController) {
        this.controller = controller;
        this.applicationController = applicationController;

        this.activeFilter = null;

        this.dialog = new Dialog();
        this.#initElements();
        this.#eventListeners();
        AnimationHandler.fadeInFromBottom(this.viewElement);

    }



    /**
     * This method will render an array of stickyboard objects in their dedicated section
     * e.g. standard or column boards
     * 
     * @param { Array[Object] } stickyBoards 
     */
    renderAll(stickyBoards) {

        if (stickyBoards.length > 0) {
            // Show the standard sticky boards title 
            this._standardBlockTitle.style.display = '';
            this._standardStickyBoardsList.style.display = '';
        }

        if (stickyBoards.length > 0) {
            // show the column sticky boards title 
            this._columnBlockTitle.style.display = '';
            this._columnStickyBoardsList.style.display = '';
        }

        // Render the sticky boards 
        const standardContentFragment = document.createDocumentFragment();
        const columnContentFragment = document.createDocumentFragment();

        for (let i = 0; i < stickyBoards.length; i++) {

            const stickyBoardCard = this.#createStickyBoardCard(stickyBoards[i])
            AnimationHandler.fadeInFromBottom(stickyBoardCard);

            const { type } = stickyBoards[i];

            if (type === 'board') {
                standardContentFragment.appendChild(stickyBoardCard);
            }

            else if (type === 'column') {
                columnContentFragment.appendChild(stickyBoardCard); 
            }
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
        AnimationHandler.fadeInFromBottom(stickyBoardCard);

        if (type === 'board') {
            this._standardStickyBoardsList.appendChild(stickyBoardCard);
        }

        else if (type === 'column') {
            this._columnStickyBoardsList.appendChild(stickyBoardCard);
        }
    }




    /**
     * This method will delete a specified stickyboard
     * 
     * @param { Number } stickyBoardId - The ID of the stickyboard to delete 
     */
    renderDelete(stickyBoardId) {
        const stickyBoards = this._stickyBoardsList.children 
        
        for (let i = 0; i < stickyWalls.length; i++) {
            if (stickyWalls[i].id == stickyWallId) {
                AnimationHandler.fadeOutCard(stickyWalls[i])
            }
        }
    }





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
        this._filterContainer = document.querySelector('.sticky-board-filter-container');
        this._filterBoardButton = document.querySelector('#filter-standard-boards');
        this._filterColumnButton = document.querySelector('#filter-column-boards');

        this._standardBlockTitle.style.display = 'none';
        this._columnBlockTitle.style.display = 'none';
        this._standardStickyBoardsList.style.display = 'none';
        this._columnStickyBoardsList.style.display = 'none';
    }
}