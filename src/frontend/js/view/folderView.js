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



    /**
     * This method will render an array of folder objects
     *
     * The "folders" subtitle will appear, if the folders array is not empty.
     *
     * @param folders { Array[Object] } - An array of folder objects.
     */
    renderAll(folders) {

        if (folders.length === 0) {
            // remove the folders subtitle
            this._foldersBlockTitle.style.display = 'none';
            this.foldersContainer.style.display = 'none';
        }

        if (folders.length > 0) {
            // show the folders subtitle
            this._foldersBlockTitle.style.display = '';
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



    /**
     * This method will render a single folder.
     *
     * The "folders" subtitle will appear, if the folder being rendered
     * is the first one within the current folder.
     *
     * @param folder { Object } - Representing the newly created folder.
     */
    renderOne(folder) {
        // show the folders subtitle if this is the first folder
        if (this.foldersContainer.children.length === 0) {
            this._foldersBlockTitle.style.display = '';
            this.foldersContainer.style.display = '';
        }

        const folderCard = this.#folder(folder);
        this.foldersContainer.appendChild(folderCard);
        AnimationHandler.fadeInFromBottom(folderCard); 
        removeEmptyFolderNotification();  
    }



    /**
     * This method will update the visual representation of a folder.
     *
     * @param folder { Object } - The updated folder.
     */
    renderUpdate(folder) {
        const folderCards = this.foldersContainer.children; 
    
        for (let i = 0; i < folderCards.length; i++) {
            if (folderCards[i].id === String(folder.id)) {
                folderCards[i].setAttribute('folder', JSON.stringify(folder));
            }
        }
    }



    /**
     * This method will delete a specified folder.
     *
     * The "folders" subtitle will disappear, if the folder being deleted
     * is the last one within the current folder.
     *
     * @param folder { Object } The folder to delete
     */
    renderDelete(folder) {
        // remove the folders subtitle if this was the last folder
        if (this.foldersContainer.children.length === 1) {
            this._foldersBlockTitle.style.display = 'none';
            this.foldersContainer.style.display = 'none';
        }  

        const folders = this.foldersContainer.children;
        for (let i = 0; i < folders.length; i++) {
            if (folders[i].id === String(folder.id) && folders[i].tagName === 'FOLDER-CARD') {
                AnimationHandler.fadeOutCard(folders[i]);
            }
        }    
        renderEmptyFolderNotification(705);
    }



    /**
     * This method will display the name of the folder the user is currently in.
     *
     * @param name -  The name of the current folder.
     */
    displayFolderName(name) {
        removeContent(this.foldersContainer);
        removeContent(document.querySelector('.notes'));
        this.currentFolderName.textContent = name;
    }



    /**
     * This method will create a single FolderCard component.
     *
     * @param folder             - A folder object.
     * @returns { HTMLElement }  - A folder card component.
     */
    #folder(folder) {
        const folderCard = document.createElement('folder-card');
        folderCard.setAttribute('folder', JSON.stringify(folder));
        return folderCard
    }



    #resizeFolderName() {
        const folderNameRect = this.currentFolderName.getBoundingClientRect();
        const searchbarRect = document.querySelector('.searchbar').getBoundingClientRect();

        if (folderNameRect.right >= searchbarRect.left) {
            // If folder name touches the searchbar, reduce font size
            this.currentFolderName.style.fontSize = '30px';
            console.log('reduce fontsize')
        } else {
            // Revert to the original size when there's enough space
            this.currentFolderName.style.fontSize = '45px';
        }
    }




    #initElements() {
        this.foldersContainer = document.querySelector('.folders');
        this._foldersBlockTitle = document.querySelector('#folders-block-title');

        this._foldersBlockTitle.style.display = 'none';
        this.foldersContainer.style.display = 'none';

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

        // window.addEventListener('resize', this.#resizeFolderName)
        this.backButton.addEventListener('click', async () => {await this.controller.navigateOutofFolder()})
        this.createFolderButton.addEventListener('click', () => {this.dialog.renderEditFolderModal(this.controller)});
    }
}