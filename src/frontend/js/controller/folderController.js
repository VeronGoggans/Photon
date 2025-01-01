import { FolderModel } from "../model/folderModel.js";
import { FolderView } from "../view/folderView.js";
import { renderEmptyFolderNotification } from "../handlers/notificationHandler.js";
import {
    GET_CURRENT_FOLDER_EVENT,
    GET_PARENT_FOLDER_EVENT,
    FETCH_FOLDER_SEARCH_ITEMS_EVENT,
    FETCH_FOLDER_BY_ID_EVENT,
    FETCH_NOTES_EVENT,
    SET_NOTE_LOCATION_EVENT,
    FETCH_RECENT_FOLDERS_EVENT,
    GET_BREAD_CRUMBS_EVENT, UPDATE_FOLDER_LOCATION_EVENT
} from "../components/eventBus.js";



export class FolderController {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.homeFolderId = 1;
        this.model = new FolderModel();


        // Listening for custom events
        this.eventBus.registerEvents({
            [GET_CURRENT_FOLDER_EVENT]: () => this.model.getCurrentFolder(),
            [GET_PARENT_FOLDER_EVENT]: () => this.model.peekParentFolder(),
            [GET_BREAD_CRUMBS_EVENT]: () => this.model.getBreadCrumbs(),
            [SET_NOTE_LOCATION_EVENT]: (location) => this.model.addHierarchyPath(location),
            [FETCH_FOLDER_BY_ID_EVENT]: async (folderId) => await this.getFolderById(folderId),
            [FETCH_RECENT_FOLDERS_EVENT]: async () => await this.getFolders({recent: true}),
            [FETCH_FOLDER_SEARCH_ITEMS_EVENT]: async () => await this.getFolders({ searchItems: true }),
            [UPDATE_FOLDER_LOCATION_EVENT]: async (params) => await this.updateFolderLocation(params.parentFolderId, params.droppedEntityId)
        });
    }



    async init(folderId = null, folderName = null, location = null) {
        this.view = new FolderView(this, this.eventBus);
        const homeFolderId = 1;
        // If a folder on the home view has been clicked.
        if (folderId === homeFolderId) this.model.emptyFolders();
        if (location !== null) this.model.addHierarchyPath(location);

        await this.navigateIntoFolder(folderId, folderName)
    }



    /**
     *
     * @param newFolderData
     */
    async addFolder(newFolderData) {
        const { name, color } = newFolderData
        const currentFolder = this.model.getCurrentFolder();

        const route = '/folders'
        const postFolderRequest = {
            'parent_id': currentFolder.id,
            'color': color,
            'name': name
        }

        const response = await this.model.add(route, postFolderRequest)
        const folder = response.content.folder;

        this.view.renderOne(folder);
    }



    /**
     *
     *
     * @param childFolders
     * @param folderId
     * @param searchItems
     */
    async getFolders({ childFolders = false, searchItems = false, recent = false } = {}) {
        let route = null;
        let parentFolderId = null;

        if (childFolders) {
            parentFolderId = this.model.getCurrentFolder().id;
            route = `/folders?parent_id=${parentFolderId}&recent=false&search_items=false`
        }

        else if (searchItems) {
            route = `/folders?recent=false&search_items=true`
        }

        else if (recent) {
            route = `/folders?recent=true&search_items=false`
        }

        const response = await this.model.get(route);
        const folders = response.content.folders;

        if (childFolders) {
            this.view.renderAll(folders);
        }

        else {
            return folders
        }
    }



    async getFolderById(folderId) {
        const route = `/folders/${folderId}`;
        const response = await this.model.get(route);
        return response.content;
    }



    async updateFolder(updatedFolderData) {
        const route = `/folders/${updatedFolderData.id}`;
        const putFolderRequest = {
            'name': updatedFolderData.name,
            'color': updatedFolderData.color
        }

        const response = await this.model.update(route, putFolderRequest);
        const folder = response.content.folder;

        this.view.renderUpdate(folder);
    }



    async updateFolderLocation(parentFolderId, droppedEntityId) {
        const route = `/folders/${droppedEntityId}/location`;
        const patchFolderLocationRequest = { 'parent_id': parentFolderId };

        const response = await this.model.patch(route, patchFolderLocationRequest);
        const folder = response.content.folder;

        this.view.renderDelete(folder);
    }



    async deleteFolder(folderId) {
        const route = `/folders/${folderId}`;

        const response = await this.model.delete(route);
        const folder = response.content.folder;

        this.view.renderDelete(folder);
    }



    /**
     *
     *
     */
    async navigateOutOfFolder() {
        const { id, name } = this.model.getParentFolder();
        await this.navigateIntoFolder(id, name);
    }



    /**
     * This method will load the content (e.g. notes, templates, subfolders) of a specified folder ID
     *
     * @param folderId - The ID of the folder
     * @param name     - The name of the folder
     */
    async navigateIntoFolder(folderId, name) {
        this.view.displayFolderName(name);
        this.model.addFolder(folderId, name);

        if (folderId === this.homeFolderId) {
            this.model.emptyFolders();
        }

        await this.model.patch(`/folders/${folderId}/view-time`);
        await this.getFolders({childFolders: true});
        await this.eventBus.asyncEmit(FETCH_NOTES_EVENT, {
            'folderId': folderId,
            'render': true,
            'storeResultInMemory': true
        });

        renderEmptyFolderNotification();   
    }
}