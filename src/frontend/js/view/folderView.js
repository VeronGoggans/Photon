import { AnimationHandler } from "../handlers/animation/animationHandler.js";
import { removeContent, addEmptyMessage, removeEmptyMessage } from "../util/ui.js";
import { BaseView } from "./baseView.js";

export class FolderView extends BaseView {
    constructor(controller, applicationController) {
        super(controller);
        this.controller = controller;
        this.applicationController = applicationController;

        this.#initElements();
        this.#eventListeners();
    }

    renderAll(folders) {
        if (folders.length === 0) {
            document.querySelector('#folders-block-title').style.display = 'none';
            this._content.style.display = 'none'
        }

        if (folders.length > 0) {
            document.querySelector('#folders-block-title').style.display = '';
            this._content.style.display = ''
        }

        for (let i = 0; i < folders.length; i++) {
            const folderCard = this.#folder(folders[i]);
            this._content.appendChild(folderCard);
            AnimationHandler.fadeInFromBottom(folderCard);
        }
    }

    renderOne(folder) {
        if (this._content.children.length === 0) {
            document.querySelector('#folders-block-title').style.display = '';
            this._content.style.display = ''
        }
        const folderCard = this.#folder(folder);
        this._content.insertBefore(folderCard, this._content.firstChild);
        AnimationHandler.fadeInFromBottom(folderCard);
    }

    renderUpdate(folder) {
        const folderCards = this._content.children; 
    
        for (let i = 0; i < folderCards.length; i++) {
            if (folderCards[i].id == folder.id) {
                folderCards[i].setAttribute('folder', JSON.stringify(folder));
            }
        }
    }
    
    renderDelete(folder) {      
        const folders = this._content.children;
        
        for (let i = 0; i < folders.length; i++) {
            if (folders[i].id == folder.id && folders[i].tagName === 'FOLDER-CARD') {
                AnimationHandler.fadeOutCard(folders[i]);
            }
        }
    }


    #folder(folder) {
        const folderCard = document.createElement('folder-card');
        folderCard.setAttribute('folder', JSON.stringify(folder));
        return folderCard
    }


    displayFolderName(name) {
        removeContent(this._content);
        removeContent(document.querySelector('.notes'));
        this.currentFolderName.textContent = name;
    }


    #initElements() {
        this._content = document.querySelector('.folders');
        this.currentFolderName = document.querySelector('.current-folder-name');
        this.backButton = document.querySelector('.exit-folder-btn');
        this.createFolderButton = document.querySelector('.create-folder-btn');
        this.homeButton = document.querySelector('.home-folder-btn');
    }

    
    #eventListeners() {
        this._content.addEventListener('FolderCardClick', (event) => {
            const { folder } = event.detail;
            this.controller.navigateIntoFolder(folder.id, folder.name);
        })

        this._content.addEventListener('UpdateFolder', (event) => {
            const { folder } = event.detail;
            this.dialog.renderEditFolderModal(this.controller, folder); 
        })

        this._content.addEventListener('DeleteFolder', (event) => {
            const { folder } = event.detail;
            this.dialog.renderDeleteModal(this.controller, folder.id, folder.name);
        })

        this._content.addEventListener('DroppedItemOnFolder', async (event) => {
            const { folderId, droppedItemId, droppedItemType } = event.detail;
            if (droppedItemType === 'note') {
                await this.applicationController.moveNote(folderId, droppedItemId);
            }
            if (droppedItemType === 'folder') {
                await this.applicationController.moveFolder(folderId, droppedItemId);
            }
        })

        this.backButton.addEventListener('click', async () => {await this.controller.navigateOutofFolder()})
        this.createFolderButton.addEventListener('click', () => {this.dialog.renderEditFolderModal(this.controller)});
        this.homeButton.addEventListener('click', async () => {await this.controller.navigateIntoFolder(1, 'Home')})
    }
}