import { AnimationHandler } from "../handlers/animationHandler.js";
import { removeEmptyFolderNotification, renderEmptyFolderNotification } from "../handlers/notificationHandler.js";
import { removeContent } from "../util/ui.js";
import {
    RENDER_CATEGORY_MODAL_EVENT,
    RENDER_DELETE_MODAL_EVENT,
    RENDER_FOLDER_MODAL_EVENT, UPDATE_FOLDER_LOCATION_EVENT, UPDATE_FOLDER_PIN_VALUE_EVENT,
    UPDATE_NOTE_LOCATION_EVENT
} from "../components/eventBus.js";


export class FolderView {
    constructor(controller, eventBus) {
        this.controller = controller;
        this.eventBus = eventBus;

        this.#initElements();
        this.#eventListeners();
    }



    /**
     * Renders a collection of folders in the folders container, updating the UI accordingly.
     *
     * If there are no folders, it hides the folders subtitle and the container. If folders do exist,
     * it ensures the subtitle and container are visible, creates folder cards for each folder,
     * and animates their appearance.
     *
     * @param {Array<Object>} folders               - An array of folder objects to be rendered. Each object represents a folder.
     *
     * @requires createCustomElement                - A utility function to create a DOM element for a folder.
     * @requires AnimationHandler.fadeInFromBottom  - A utility method that animates the fade-in effect for a folder card.
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
     * Renders a single folder in the UI and updates the container's visibility if needed.
     *
     * If this is the first folder being added, the method ensures the folder subtitle and container
     * are made visible. It then creates a folder card, appends it to the container, applies an
     * animation effect, and removes any "empty folder" notifications.
     *
     * @param {Object} folder                       - The folder object to be rendered.
     *
     * @requires AnimationHandler.fadeInFromBottom  - Animates the appearance of the newly added folder card.
     * @requires removeEmptyFolderNotification      - Removes any "empty folder" notification displayed in the UI.
     * @method #folder                              - A private method that creates a DOM element for the folder card.
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
     * Updates the attributes of a folder card in the UI when the folder data is modified.
     *
     * This method iterates through the folder cards in the folder container to find the one
     * matching the given folder's ID. Once found, it updates the `folder` attribute of the
     * folder card with the serialized folder data.
     *
     * @param {Object} folder            - The folder object containing updated data.
     * @param {number|string} folder.id  - The unique identifier of the folder to be updated.
     *
     * @requires JSON.stringify          - Converts the folder object to a JSON string for storage as an attribute.
     */
    renderUpdate(folder) {
        const folderCards = this.foldersContainer.children;

        for (const folderCard of folderCards) {
            if (folderCard.id === String(folder.id)) {
                folderCard.setAttribute('folder', JSON.stringify(folder));
            }
        }
    }



    /**
     * Handles the deletion of a folder by updating the UI and removing its visual representation.
     *
     * If the folder container contains only one folder, it hides the folder subtitle and container.
     * The method then finds and animates the removal of the folder that matches the given folder ID.
     * Finally, it displays a notification for an empty folder, if empty.
     *
     * @param {Object} folder                   - The folder object to be deleted.
     * @param {number|string} folder.id         - The unique identifier of the folder to be removed.
     *                                            This must match the ID of a folder card in the container.
     *
     * @requires AnimationHandler.fadeOutCard   - A utility method to animate the fade-out of an element.
     * @requires renderEmptyFolderNotification  - A function that displays a notification for an empty folder.
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




    #initElements() {
        this.foldersContainer = document.querySelector('.folders');
        this._foldersBlockTitle = document.querySelector('#folders-block-title');

        this._foldersBlockTitle.style.display = 'none';
        this.foldersContainer.style.display = 'none';

        this.currentFolderName = document.querySelector('.current-folder-name');
        this.backButton = document.querySelector('.exit-folder-btn');
        this.createFolderButton = document.querySelector('.add-folder-btn');
        this._createCategoryButton = document.querySelector('.add-category-btn');
        this.viewElement = document.querySelector('.notes-view');
    }

    
    #eventListeners() {

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
            this.eventBus.emit(RENDER_FOLDER_MODAL_EVENT, {
                'folder': null,
                'callBack': addFolderCallBack
            });
        });


        /**
         * This custom event listener will listen for the FolderCardClick event
         * When this event happens the folder will be loaded in the current view.
         */
        this.foldersContainer.addEventListener('FolderCardClick', async (event) => {
            const { folder } = event.detail;
            await this.controller.navigateIntoFolder(folder.id, folder.name);
        });


        /**
         * This custom event listener will listen for the EditFolderClick event
         * When this event happens the FolderModal is rendered to the dialog.
         *
         * When the user confirms the changes made to the folder,
         * the callback will confirm the changes mad to the folder.
         */
        this.foldersContainer.addEventListener('EditFolder', (event) => {
            const { folder } = event.detail;

            // The callback function that'll update the folder when the user confirms the folder changes
            const updateCallBack = async (updatedFolderData) => {
                await this.controller.updateFolder(updatedFolderData);
            }

            // Event to tell the dialog to render the folder modal.
            this.eventBus.emit(RENDER_FOLDER_MODAL_EVENT, {
                'folder': folder,
                'callBack': updateCallBack
            })
        });



        this.foldersContainer.addEventListener('PinFolder', async (event) => {
            await this.eventBus.asyncEmit(UPDATE_FOLDER_PIN_VALUE_EVENT, {
                'folder': event.detail.folder,
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
        this.createFolderButton.addEventListener('click', () => {

            // The callback function that'll create the folder when the user confirms the creation in the modal.
            const addFolderCallBack = async (newFolderData) => {
                await this.controller.addFolder(newFolderData);
            }

            //  Event to tell the dialog to render the folder modal.
            this.eventBus.emit(RENDER_FOLDER_MODAL_EVENT, {
                'folder': null,
                'callBack': addFolderCallBack
            })
        });



        this._createCategoryButton.addEventListener('click', () => {
            // The callback function that'll create the category when the user confirms the creation in the modal.
            const addCategoryCallBack = async (newCategoryData) => {
                console.log('New Category')
            }

            //  Event to tell the dialog to render the category modal.
            this.eventBus.emit(RENDER_CATEGORY_MODAL_EVENT, {
                'category': null,
                'folder': null,
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