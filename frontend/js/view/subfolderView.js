import { Folder } from "../components/folder.js";
import { ListFolder, NoFolderMessage } from "../components/listFolder.js";
import { DeleteContainer } from '../components/deleteContainer.js';
import { SubfolderObjectArray } from "../util/array.js";
import { Dialog } from "../util/dialog.js";
import { UserFeedbackHandler } from "../handlers/notificationHandler.js";



export class SubfolderView {
    constructor(controller) {
        this.subfolderController = controller;
        this.dialog = new Dialog();
        this.userFeedbackHandler = new UserFeedbackHandler();
        this._content = document.querySelector('.content-view');
        this._list = document.querySelector('.list-content-folders');
        this.subfoldersObjects = new SubfolderObjectArray();
    }
    /**
     * This method renders a array of subfolders.
     * 
     * This method renders a array of subfolders and adds them to the UI.
     * If the array is empty this method does nothing.
     * 
     * @param {Array} subfolders is an array of subfolders.
     */
    renderSubfolders(subfolders) {
        if (subfolders.length > 0) {
            for (let i = 0; i < subfolders.length; i++) {
                const SUBFOLDER = subfolders[i];
                const SUBFOLDER_LIST_CARD = this.listSubfolder(SUBFOLDER);
                const SUBFOLDER_CARD = this.subfolder(SUBFOLDER);

                this._content.appendChild(SUBFOLDER_CARD);
                this._list.appendChild(SUBFOLDER_LIST_CARD);
            }
        } else {
            // give user feedback that this folder is empty
            this.userFeedbackHandler.noFolders(new NoFolderMessage());
        }
    }

    /**
     * This method adds a single subfolder to the UI.
     * 
     * This method adds the subfolder to the content div and list div.
     * 
     * @param {dict} subfolder The subfolder that needs to be added to the UI. 
     */
    renderSubfolder(subfolder) {
        // Checking if the list-view html element currently says "no folders"
        if (this.subfoldersObjects.size() === 0) {
            this.userFeedbackHandler.removeNoFoldersMessage();
        }
        // Creating the html for the subfolder
        const SUBFOLDER_CARD = this.subfolder(subfolder);
        const SUBFOLDER_LIST_CARD = this.listSubfolder(subfolder);

        // Adding the note html cards to the screen
        this._content.insertBefore(SUBFOLDER_CARD, this._content.firstChild);
        this._list.appendChild(SUBFOLDER_LIST_CARD);
        this.dialog.hide();
    }

    /**
     * This method updates the subfolder card inside the list div.
     * 
     * @param {dict} subfolder the updated subfolder.
     */
    renderSubfolderUpdate(subfolder) {
        const ID = subfolder.id;
        const NAME = subfolder.name;
        const SUBFOLDER_LIST_CARDS = this._list.children;
        for (let i = 0; i < SUBFOLDER_LIST_CARDS.length; i++) {
            if (SUBFOLDER_LIST_CARDS[i].id === ID) {
                const SPAN = SUBFOLDER_LIST_CARDS[i].querySelector('span');
                SPAN.textContent = NAME;
            }
        }
    }

    /**
     * Removes a specific subfolder from the UI.
     *
     * This method removes the subfolder from the UI that it has been given.
     * @param {dict} subfolder 
     */
    removeSubfolder(subfolder) {
        const ALL_SUBFOLDERS = this._content.children;
        const ALL_LIST_SUBFOLDERS = this._list.children;
        const ID = subfolder.id

        for (let i = 0; i < ALL_SUBFOLDERS.length; i++) {
            if (ALL_SUBFOLDERS[i].id === ID) {
                // Removing the html related to the given subfolder 
                this._content.removeChild(ALL_SUBFOLDERS[i]);
                this._list.removeChild(ALL_LIST_SUBFOLDERS[i]);
                // Removing the subfolder object 
                this.subfoldersObjects.remove(subfolder);
                // Checking if there are no subfolder cards inside the list-view html element
                if (this._list.children.length === 0) {
                    this.userFeedbackHandler.noFolders(new NoFolderMessage());
                }
            }
        }
        this.dialog.hide();
    }

    /**
     * This method creates a ListFolder component and returns it.
     * 
     * @param {Dict} subfolder
     * @returns {ListFolder}
     */
    listSubfolder(subfolder) {
        return new ListFolder(subfolder, this);
    }

    /**
     * This method creates a Folder component and returns it.
     * 
     * @param {Dict} subfolder
     * @returns {Folder}
     */
    subfolder(subfolder) {
        this.subfoldersObjects.add(subfolder);
        return new Folder(subfolder, this);
    }

    /**
     * This method renders a confirmation container telling the user if they want to delete the subfolder.
     * 
     * @param {String} id The ID of the subfolder wished to be deleted.
     * @param {String} name The name of the subfolder wished to be deleted.
     */
    renderDeleteContainer(id, name) {
        this.dialog.addChild(new DeleteContainer(id, name, this));
        this.dialog.show();
    }

    /**
     * This method updates a subfolder
     * 
     * This method will communicate to the subfolder controller 
     * to update a subfolder.
     * 
     * @param {String} id The ID of the subfolder wished to be updated.
     * @param {String} name The new name for the subfolder.
     */
    async updateFolder(id, name, color) {
        this.subfolderController.updateSubfolder(id, name, color);
    }

    /**
     * This method deletes a subfolder.
     * 
     * This method communicates with the subfolder controller
     * to delete the specified subfolder.
     * 
     * @param {String} id The ID of the subfolder wished to be updated
     */
    async handleConfirmButtonClick(id) {
        this.subfolderController.deleteSubfolder(id);
    }


    /**
     * Takes the user into a folder and displays the notes inside it.
     * 
     * This method is triggered when a folder card is clicked. It removes all existing folders from the screen
     * using {@link navigateIntoFolder}.
     * 
     * @param {string} id - The ID of the folder to navigate into.
     */
    handleFolderCardClick(id) {
        this.subfolderController.navigateIntoFolder(id);
    }
}