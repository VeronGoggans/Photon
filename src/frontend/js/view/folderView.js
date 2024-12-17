import { AnimationHandler } from "../handlers/animationHandler.js";
import { removeEmptyFolderNotification, renderEmptyFolderNotification } from "../handlers/notificationHandler.js";
import { removeContent } from "../util/ui.js";
import { Dialog } from "../util/dialog.js"


export class FolderView {
    constructor(controller, applicationController) {
        this.controller = controller;
        this.applicationController = applicationController;

        this.dialog = new Dialog();
        this.#initElements();
        this.#eventListeners();
    }

    renderAll(folders) {
        if (folders.length === 0) {
            // hide the folders subtitle
            document.querySelector('#folders-block-title').style.display = 'none';
            this.foldersContainer.style.display = 'none';
        }
        if (folders.length > 0) {
            // show the folders subtitle
            document.querySelector('#folders-block-title').style.display = '';
            this.foldersContainer.style.display = '';
        }

        const contentFragment = document.createDocumentFragment();

        for (let i = 0; i < folders.length; i++) {
            const folderCard = this.#folder(folders[i]);

            contentFragment.appendChild(folderCard);
            AnimationHandler.fadeInFromBottom(folderCard);
        }
        this.foldersContainer.appendChild(contentFragment);
    }


    renderOne(folder) {
        if (this.foldersContainer.children.length === 0) {
            // show the folders subtitle
            document.querySelector('#folders-block-title').style.display = '';
            this.foldersContainer.style.display = '';
        }

        const folderCard = this.#folder(folder);
        this.foldersContainer.appendChild(folderCard);
        AnimationHandler.fadeInFromBottom(folderCard); 
        removeEmptyFolderNotification();  
    }


    renderUpdate(folder) {
        const folderCards = this.foldersContainer.children; 
    
        for (let i = 0; i < folderCards.length; i++) {
            if (folderCards[i].id == folder.id) {
                folderCards[i].setAttribute('folder', JSON.stringify(folder));
            }
        }
    }
    

    renderDelete(folder) {
        if (this.foldersContainer.children.length === 1) {
            // hide the folders subtitle
            document.querySelector('#folders-block-title').style.display = 'none';
            this.foldersContainer.style.display = 'none';
        }  

        const folders = this.foldersContainer.children;
        for (let i = 0; i < folders.length; i++) {
            if (folders[i].id == folder.id && folders[i].tagName === 'FOLDER-CARD') {
                AnimationHandler.fadeOutCard(folders[i]);
            }
        }    
        renderEmptyFolderNotification(705);
    }


    #folder(folder) {
        const folderCard = document.createElement('folder-card');
        folderCard.setAttribute('folder', JSON.stringify(folder));
        return folderCard
    }


    displayFolderName(name) {
        removeContent(this.foldersContainer);
        removeContent(document.querySelector('.notes'));
        this.currentFolderName.textContent = name;
    }


    #initElements() {
        this.foldersContainer = document.querySelector('.folders');
        this.currentFolderName = document.querySelector('.current-folder-name');
        this.backButton = document.querySelector('.exit-folder-btn');
        this.createFolderButton = document.querySelector('.add-folder-btn');
        this.viewElement = document.querySelector('.notes-view');
    }

    
    #eventListeners() {
        this.viewElement.addEventListener('CreateNewFolder', () => {
            this.dialog.renderEditFolderModal(this.controller);
        });

        this.foldersContainer.addEventListener('FolderCardClick', (event) => {
            const { folder } = event.detail;
            this.controller.navigateIntoFolder(folder.id, folder.name);
        });

        document.body.addEventListener('UpdateFolder', (event) => {
            const { folder } = event.detail;
            this.dialog.renderEditFolderModal(this.controller, folder); 
        });
    

        document.body.addEventListener('DeleteFolder', (event) => {
            const { folder } = event.detail;
            this.dialog.renderDeleteModal(this.controller, folder.id, folder.name);
        });

        this.foldersContainer.addEventListener('DroppedItemOnFolder', async (event) => {
            const { folderId, droppedItemId, droppedItemType } = event.detail;
            if (droppedItemType === 'note') {
                await this.applicationController.moveNote(folderId, droppedItemId);
            }
            if (droppedItemType === 'folder') {
                await this.applicationController.moveFolder(folderId, droppedItemId);
            }
        });

        this.backButton.addEventListener('click', async () => {await this.controller.navigateOutofFolder()})
        this.createFolderButton.addEventListener('click', () => {this.dialog.renderEditFolderModal(this.controller)});
    }
}