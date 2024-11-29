import { AnimationHandler } from "../handlers/animationHandler.js";
import { createListItemType1 } from "../util/ui/components.js";
import { Dialog } from "../util/dialog.js";


export class StickyWallHomeView {
    constructor(controller, applicationController) {
        this.controller = controller;
        this.applicationController = applicationController;

        this.dialog = new Dialog();
        this.#initElements();
        this.#eventListeners();
        AnimationHandler.fadeInFromBottom(this.viewElement);
    }


    renderAll(stickyWalls) {
        const contentFragment = document.createDocumentFragment();

        for (let i = 0; i < stickyWalls.length; i++) {
            const stickyWall = createListItemType1(stickyWalls[i], 'stickyWall');
            AnimationHandler.fadeInFromBottom(stickyWall);
            contentFragment.appendChild(stickyWall);
        }
        this._stickyWallsList.append(contentFragment);
    }


    renderOne(stickyWall) {
        const stickyWallCard = createListItemType1(stickyWall, 'stickyWall');
        AnimationHandler.fadeInFromBottom(stickyWallCard);
        this._stickyWallsList.appendChild(stickyWallCard);
    }


    renderDelete(stickyWallId) {
        const stickyWalls = this._stickyWallsList.children 
        
        for (let i = 0; i < stickyWalls.length; i++) {
            if (stickyWalls[i].id == stickyWallId) {
                AnimationHandler.fadeOutCard(stickyWalls[i])
            }
        }
    }


    renderUpdate(stickyWall) {
        const stickyWalls = this._stickyWallsList.children; 

        for (let i = 0; i < stickyWalls.length; i++) {
            if (stickyWalls[i].id == stickyWall.id) {    

                stickyWalls[i].setAttribute('list-item', JSON.stringify(stickyWall));
            }
        }
    }


    #eventListeners() {
        this._addNewstickyWallButton.addEventListener('click', () => {this.dialog.renderNewCollectionModal(this.controller, 'stickyWall');});

        this._stickyWallsList.addEventListener('ListItemCardClick', (event) => {
            const { listItem } = event.detail;        
            this.applicationController.initView('stickyWall', 
                {
                    stickyWall: listItem,
                    previousView: 'stickyWallHome', 
                }
            )
        })

        this._stickyWallsList.addEventListener('DeleteListItem', (event) => {
            const { listItem } = event.detail
            this.renderDeleteModal(listItem.id, listItem.name);
        })

        this._stickyWallsList.addEventListener('UpdateListItem', (event) => {
            const { listItem, listItemType } = event.detail
            this.dialog.renderNewCollectionModal(this.controller, listItemType, listItem)
        })
    }

    #initElements() {
        this.viewElement = document.querySelector('.sticky-home-view');
        this._stickyWallsList = document.querySelector('.sticky-wall-cards');
        this._addNewstickyWallButton = document.querySelector('.add-sticky-wall-btn');  
    }
}