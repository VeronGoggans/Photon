import { AnimationHandler } from "../../handlers/animationHandler.js";
import { removeEmptyFolderNotification } from "../../handlers/notificationHandler.js";
import {
    CREATE_CATEGORY_EVENT,
    GET_CURRENT_FOLDER_EVENT,
    RENDER_DELETE_MODAL_EVENT,
    RENDER_ORGANISATION_MODAL_EVENT,
    UPDATE_FOLDER_LOCATION_EVENT,
    UPDATE_FOLDER_PIN_VALUE_EVENT,
    UPDATE_NOTE_LOCATION_EVENT
} from "../../components/eventBus.js";
import { UIWebComponentFactory } from "../../patterns/factories/webComponentFactory.js";
import { UIWebComponentNames } from "../../constants/constants.js";
import { removeBlockTitle, showBlockTitle, removeContent } from "./viewFunctions.js";


export class FolderView {
    constructor(controller, eventBus) {
        this.controller = controller;
        this.eventBus = eventBus;

        this.#defineElements();
        this.#defineEvents();
    }





    renderAll(folders) {

        if (folders.length === 0) removeBlockTitle(this._foldersBlockTitle, this.foldersContainer);
        if (folders.length > 0) showBlockTitle(this._foldersBlockTitle, this.foldersContainer);

        UIWebComponentFactory.
        createUIWebComponentCollection(folders, UIWebComponentNames.FOLDER, this.foldersContainer)
    }





    renderOne(folder) {
        if (this.foldersContainer.children.length === 0) {
            showBlockTitle(this._foldersBlockTitle, this.foldersContainer);
        }

        const folderCard = UIWebComponentFactory.createUIWebComponent(folder, UIWebComponentNames.FOLDER);
        this.foldersContainer.appendChild(folderCard);
        AnimationHandler.fadeInFromBottom(folderCard); 
        removeEmptyFolderNotification();  
    }





    renderUpdate(folder) {
        const folderCards = this.foldersContainer.children;

        for (const folderCard of folderCards) {
            if (folderCard.id === String(folder.id)) {                
                folderCard.setAttribute(UIWebComponentNames.FOLDER, JSON.stringify(folder));
                this.#updatePinnedFolder(folder);
            }
        }
    }





    renderDelete(folder) {
        if (this.foldersContainer.children.length === 1) {
            removeBlockTitle(this._foldersBlockTitle, this.foldersContainer);
        }  

        const folders = this.foldersContainer.children;
        for (const folderCard of folders) {
            if (folderCard.id === String(folder.id)) {
                AnimationHandler.fadeOutCard(folderCard);
            }
        }
    }





    renderOnePinnedFolder(folder) {
        const pinnedFolderCard = UIWebComponentFactory.createUIWebComponent(folder, UIWebComponentNames.PINNED_FOLDER);
        this._pinnedFolders.appendChild(pinnedFolderCard);
        AnimationHandler.fadeInFromBottom(pinnedFolderCard);
    }


    removePinnedFolder(folder) {
        const pinnedFolders = this._pinnedFolders.children;

        for (const pinnedFolder of pinnedFolders) {
            if (pinnedFolder.id === String(folder.id)) {
                AnimationHandler.fadeOutCard(pinnedFolder);
            }
        }
    }



    
    displayFolderName(name) {
        removeContent(this.foldersContainer);
        removeContent(document.querySelector('.notes'));
        this.currentFolderName.textContent = name;
    }


    
    updateFolderNameDisplay(folder) {
        this.currentFolderName.textContent = folder.name;
        this.#updatePinnedFolder(folder);
    }



    displayFolderColorCircle(folderCSSClass) {
        this._folderColorCircle.classList.remove(...this._folderColorCircle.classList);

        if (folderCSSClass !== 'color-original') {
            this._folderColorCircle.classList.add(folderCSSClass);
        }
    }


    #updatePinnedFolder(folder) {
        const pinnedFolderCards = this._pinnedFolders.children;

        if (folder.pinned) {
            for (const pinnedFolderCard of pinnedFolderCards) {
                if (pinnedFolderCard.id === String(folder.id)) {
                    pinnedFolderCard.setAttribute(UIWebComponentNames.PINNED_FOLDER, JSON.stringify(folder));
                }
            }
        }
    }




    #defineElements() {
        this.foldersContainer = document.querySelector('.folders');
        this._pinnedFolders = document.querySelector('.pinned-folders');
        this._foldersBlockTitle = document.querySelector('#folders-block-title');

        this._foldersBlockTitle.style.display = 'none';
        this.foldersContainer.style.display = 'none';

        this.currentFolderName = document.querySelector('.current-folder-name');
        this._folderColorCircle = document.querySelector('#folder-color-circle');
        this.backButton = document.querySelector('.exit-folder-btn');
        this.viewElement = document.querySelector('.notes-view');


        // Notes view options menu buttons
        this._createFolderButton = document.querySelector('.add-folder-btn');
        this._createCategoryButton = document.querySelector('.add-category-btn');
        this._editCurrentFolderButton = document.querySelector('.edit-current-folder-btn');
        this._pinCurrentFolderButton = document.querySelector('.pin-current-folder-btn');
    }

    
    #defineEvents() {

        /**
         * Creating a new folder by emitting an EVENT to open de Folder modal.
         * The Dialog class will listen for this event and render the Folder modal on the screen.
         */
        this.viewElement.addEventListener('CreateNewFolder', () => {

            // The callback function that'll create the folder when the user confirms the folder creation
            const addFolderCallBack = async (newFolderData) => {
                this.controller.addFolder(newFolderData);
            }

            // Event to tell the dialog to render the folder modal.
            this.eventBus.emit(RENDER_ORGANISATION_MODAL_EVENT, {
                'entity': null,
                'entityType': 'folder',
                'callBack': addFolderCallBack
            });
        });


        /**
         * This custom event listener will listen for the FolderCardClick event
         * When this event happens the folder will be loaded in the current view.
         */
        this.foldersContainer.addEventListener('FolderCardClick', async (event) => {
            await this.controller.navigateIntoFolder(event.detail.folder);
        });


        /**
         * This custom event listener will listen for the EditFolderClick event
         * When this event happens the FolderModal is rendered to the dialog.
         *
         * When the user confirms the changes made to the folder,
         * the callback will confirm the changes mad to the folder.
         */
        this.viewElement.addEventListener('EditFolder', (event) => {
            // If the EditFolder event was triggered from a folder's context menu
            let folder = event.detail.folder;

            // Will result in true if the EditFolder event was triggered from the notes view options menu.
            // Will stay false if the EditFolder event was triggered from a folders context menu,
            // thus outside the folder that's being updated
            let eventTriggeredInsideFolder = false;

            // Will result true, if the EditFolder event was triggered from the notes tab options menu
            if (folder === null) {
                folder = this.eventBus.emit(GET_CURRENT_FOLDER_EVENT);
                eventTriggeredInsideFolder = true;
            }

            // The callback function that'll update the folder when the user confirms the folder changes
            const updateCallBack = async (updatedFolderData) => {
                await this.controller.updateFolder(updatedFolderData);
            }

            // Event to tell the dialog to render the folder modal.
            this.eventBus.emit(RENDER_ORGANISATION_MODAL_EVENT, {
                'entity': folder,
                'entityType': 'folder',
                'callBack': updateCallBack,
                'eventTriggeredInsideFolder': eventTriggeredInsideFolder
            })
        });


        /**
         * This custom event listener will listen for the PinFolder event
         * When this event is triggered the corresponding folder's pin value will
         * be updated.
         *
         * This event can be triggered by a folder's context menu and also by the note
         * view's options menu.
         */
        this.viewElement.addEventListener('PinFolder', async (event) => {
            // If the PinFolder event was triggered from a folder's context menu
            let folder = event.detail.folder;

            // Will result true, if the PinFolder event was triggered from the notes tab options menu
            if (folder === null) {
                folder = this.eventBus.emit(GET_CURRENT_FOLDER_EVENT)
            }

            // Update the folders pin value accordingly
            await this.eventBus.asyncEmit(UPDATE_FOLDER_PIN_VALUE_EVENT, {
                'folder': folder,
            })
        });


        /**
         * This custom event listener will listen for the DeleteFolder event
         * When this event happens the DeleteModal is rendered to the dialog
         *
         * When the user fills in a complete match with the name of the folder they are trying to delete,
         * the callback function will tell the controller to confirm the deletion of that folder.
         */
        this.foldersContainer.addEventListener('DeleteFolder', (event) => {
            const { folder } = event.detail;

            // The callback function that'll delete the folder when the user types in the full name.
            const deleteCallBack = async (deleteDetails) => {
                await this.controller.deleteFolder(deleteDetails.id);
            }

            // Event to tell the dialog to render the delete modal.
            this.eventBus.emit(RENDER_DELETE_MODAL_EVENT, {
                'id': folder.id,
                'name': folder.name,
                'callBack': deleteCallBack
            });
        });


        /**
         * This event listener will listen for clicks on the create new folder option button.
         * When this button is clicked the FolderModal is rendered to the dialog.
         *
         * When the user confirms the creation of the folder within the folder modal,
         * the callback function will tell the controller to confirm the creation of a new folder.
         */
        this._createFolderButton.addEventListener('click', () => {

            // The callback function that'll create the folder when the user confirms the creation in the modal.
            const addFolderCallBack = async (newFolderData) => {
                await this.controller.addFolder(newFolderData);
            }

            //  Event to tell the dialog to render the folder modal.
            this.eventBus.emit(RENDER_ORGANISATION_MODAL_EVENT, {
                'entity': null,
                'entityType': 'folder',
                'callBack': addFolderCallBack
            })
        });


        
        this._pinCurrentFolderButton.addEventListener('click', () => {
            // Dispatch the PinFolder custom event
            this.viewElement.dispatchEvent(new CustomEvent('PinFolder', {detail: {folder: null}, bubbles: true}));
        })


        
        this._editCurrentFolderButton.addEventListener('click', () => {
            // Dispatch the PinFolder custom event
            this.viewElement.dispatchEvent(new CustomEvent('EditFolder', {detail: {folder: null}, bubbles: true}));
        })


        
        this._createCategoryButton.addEventListener('click', async () => {
            // The callback function that'll create the category when the user confirms the creation in the modal.
            const addCategoryCallBack = async (newCategoryData) => {
                await this.eventBus.asyncEmit(CREATE_CATEGORY_EVENT, newCategoryData);
            }

            //  Event to tell the dialog to render the category modal.
            this.eventBus.emit(RENDER_ORGANISATION_MODAL_EVENT, {
                'entity': null,
                'entityType': 'category',
                'callBack': addCategoryCallBack
            })
        })



        this.foldersContainer.addEventListener('DroppedItemOnFolder', async (event) => {
            const { parentFolderId, droppedEntityId, droppedEntityName } = event.detail;
            if (droppedEntityName === 'note') {
                await this.eventBus.asyncEmit(UPDATE_NOTE_LOCATION_EVENT, {
                    parentFolderId: parentFolderId,
                    droppedEntityId: droppedEntityId,
                });
            }

            else if (droppedEntityName === 'folder') {
                await this.eventBus.asyncEmit(UPDATE_FOLDER_LOCATION_EVENT, {
                    parentFolderId: parentFolderId,
                    droppedEntityId: droppedEntityId,
                });
            }
        });

        // window.addEventListener('resize', this.#resizeFolderName)
        this.backButton.addEventListener('click', async () => {await this.controller.navigateOutOfFolder()})

    }
}