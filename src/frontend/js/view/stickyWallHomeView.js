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


    renderAll(stickyBoards) {
        const contentFragment = document.createDocumentFragment();

        for (let i = 0; i < stickyBoards.length; i++) {
            const stickyBoardCard = this.#createStickyBoardCard(stickyBoards[i])
            AnimationHandler.fadeInFromBottom(stickyBoardCard);
            contentFragment.appendChild(stickyBoardCard);
        }
        this._stickyBoardsList.append(contentFragment);
    }


    renderOne(stickyBoard) {
        const stickyBoardCard = this.#createStickyBoardCard(stickyBoard);
        AnimationHandler.fadeInFromBottom(stickyBoardCard);
        this._stickyBoardsList.appendChild(stickyBoardCard);
    }


    renderDelete(stickyWallId) {
        const stickyWalls = this._stickyBoardsList.children 
        
        for (let i = 0; i < stickyWalls.length; i++) {
            if (stickyWalls[i].id == stickyWallId) {
                AnimationHandler.fadeOutCard(stickyWalls[i])
            }
        }
    }


    renderUpdate(stickyWall) {
        const stickyWalls = this._stickyBoardsList.children; 

        for (let i = 0; i < stickyWalls.length; i++) {
            if (stickyWalls[i].id == stickyWall.id) {    

                stickyWalls[i].setAttribute('list-item', JSON.stringify(stickyWall));
            }
        }
    }


    #createStickyBoardCard(stickyBoard) {
        const stickyBoardCard = document.createElement('sticky-board');
        stickyBoardCard.setData(stickyBoard)
        return stickyBoardCard
    }


    #filterBoards(type) {

        const standardBoards = this._stickyBoardsList.querySelectorAll('sticky-board[data-type="board"]');
        const columnBoards = this._stickyBoardsList.querySelectorAll('sticky-board[data-type="column"]');
        
        if (type === 'column') {
            if (this.activeFilter !== 'column') {
                this.activeFilter = 'column';

                columnBoards.forEach(board => {
                    board.style.display = '';
                })

                standardBoards.forEach(board => {
                    board.style.display = 'none';
                })
            } else {
                standardBoards.forEach(board => {
                    board.style.display = '';
                })
            }   
        }

        else if (type === 'board') {
            if (this.activeFilter !== 'board') {
                this.activeFilter = 'board';

                standardBoards.forEach(board => {
                    board.style.display = '';
                })
                columnBoards.forEach(board => {
                    board.style.display = 'none';
                })
            } else {
                columnBoards.forEach(board => {
                    board.style.display = '';
                })
            }   
        }
    }



    #eventListeners() {
        this._addNewstickyWallButton.addEventListener('click', () => {
            this.dialog.renderNewStickyBoardModal(this.controller)
        });

        this._stickyBoardsList.addEventListener('ListItemCardClick', (event) => {
            const { listItem } = event.detail;        
            this.applicationController.initView('stickyWall', 
                {
                    stickyWall: listItem,
                    previousView: 'stickyWallHome', 
                }
            )
        })

        this._stickyBoardsList.addEventListener('DeleteListItem', (event) => {
            const { listItem } = event.detail
            this.dialog.renderDeleteModal(listItem.id, listItem.name);
        })

        this._stickyBoardsList.addEventListener('UpdateListItem', (event) => {
            this.dialog.renderNewStickyBoardModal(this.controller)
        })

        this._filterContainer.addEventListener('click', (e) => {
            if (e.target.closest('#filter-standard-boards')) {
                if (this._filterBoardButton.classList.contains('selected-board-filter')) {
                    this._filterBoardButton.classList.remove('selected-board-filter');
                } else {
                    this._filterBoardButton.classList.add('selected-board-filter');
                    this._filterColumnButton.classList.remove('selected-board-filter');
                }
                this.#filterBoards('board')
            }
            else if (e.target.closest('#filter-column-boards')) {
                if (this._filterColumnButton.classList.contains('selected-board-filter')) {
                    this._filterColumnButton.classList.remove('selected-board-filter');
                } else {
                    this._filterColumnButton.classList.add('selected-board-filter');
                    this._filterBoardButton.classList.remove('selected-board-filter');
                }
                this.#filterBoards('column')
            }
        })
    }

    #initElements() {
        this.viewElement = document.querySelector('.sticky-home-view');
        this._stickyBoardsList = document.querySelector('.sticky-boards');
        this._addNewstickyWallButton = document.querySelector('.add-sticky-board-btn');
        this._filterContainer = document.querySelector('.sticky-board-filter-container');
        this._filterBoardButton = document.querySelector('#filter-standard-boards');
        this._filterColumnButton = document.querySelector('#filter-column-boards');
    }
}