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
    GET_BREAD_CRUMBS_EVENT, UPDATE_FOLDER_LOCATION_EVENT, FETCH_PINNED_FOLDERS_EVENT, UPDATE_FOLDER_PIN_VALUE_EVENT
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
            [FETCH_PINNED_FOLDERS_EVENT]: async () => await this.getFolders({ pinned: true }),
            [UPDATE_FOLDER_LOCATION_EVENT]: async (params) => await this.updateFolderLocation(params.parentFolderId, params.droppedEntityId),
            [UPDATE_FOLDER_PIN_VALUE_EVENT]: async (params) => await this.updateFolderPinValue(params.folder)
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
     * Adds a new folder to the server under the current folder and updates the view with the new folder.
     *
     * @param { Object } newFolderData          - An object containing the data for the new folder.
     * @param { string } newFolderData.name     - The name of the new folder.
     * @param { string } newFolderData.color    - The color of the new folder.
     * @returns { Promise<void> }               - Resolves when the folder is successfully added and the view is updated.
     *
     * The function performs the following steps:
     * 1. Retrieves the current folder's ID to use as the parent folder for the new folder.
     * 2. Constructs a `POST` request payload containing the new folder's `name`, `color`, and `parent_id`.
     * 3. Sends the `POST` request to create the folder using `this.model.add`.
     * 4. Extracts the newly created folder's data from the server's response.
     * 5. Renders the new folder in the UI by calling `this.view.renderOne` with the new folder data.
     *
     * @example
     * const newFolderData = {
     *   name: "New Folder",
     *   color: "#FF5733"
     * };
     * await addFolder(newFolderData);
     *
     * // A new folder is added under the current folder, and the UI is updated to reflect the new folder.
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
     * Fetches folders from the server based on the specified options and either renders them
     * or returns them, depending on the context.
     *
     * @param { Object } options                          - Options to determine the type of folders to retrieve.
     * @param { boolean } [options.childFolders=false]    - If `true`, fetches child folders of the current folder.
     * @param { boolean } [options.searchItems=false]     - If `true`, fetches folders containing search results.
     * @param { boolean } [options.recent=false]          - If `true`, fetches recently accessed folders.
     * @param { boolean } [options.pinned=false]          - If `true`, fetches pinned folders.
     * @returns { Promise<Array<Object>|void> }           - Returns an array of folder objects if not rendering; otherwise, renders the folders.
     *
     * The function performs the following steps:
     * 1. Determines the appropriate API route based on the provided options:
     *    - `childFolders`: Fetches child folders for the current folder.
     *    - `searchItems` : Fetches folders containing search items.
     *    - `recent`      : Fetches recently accessed folders.
     *    - `pinned`      : Fetches pinned folders.
     *
     * 2. Fetches the folders using the `this.model.get` method, which sends a GET request to the determined route.
     *
     * 3. Depending on the `childFolders` option:
     *    - If `childFolders` is `true`, renders the folders using `this.view.renderAll`.
     *    - Otherwise, returns the fetched folders for further processing.
     *
     * @example
     * // Fetch and render child folders of the current folder
     * await getFolders({ childFolders: true });
     *
     * @example
     * // Fetch and return recent folders without rendering
     * const recentFolders = await getFolders({ recent: true });
     * console.log(recentFolders);
     *
     * @example
     * // Fetch pinned folders and log them
     * const pinnedFolders = await getFolders({ pinned: true });
     * console.log(pinnedFolders);
     */
    async getFolders({
            childFolders = false,
            searchItems = false,
            recent = false,
            pinned = false
        } = {}) {

        let route = null;
        let parentFolderId = null;

        if (childFolders) {
            parentFolderId = this.model.getCurrentFolder().id;
            route = `/folders?parent_id=${parentFolderId}&recent=false&search_items=false`;
        }

        else if (searchItems) {
            route = `/folders?recent=false&search_items=true`;
        }

        else if (recent) {
            route = `/folders?recent=true&search_items=false`;
        }

        else if (pinned) {
            route = `/folders?recent=false&search_items=false&pinned=true`;
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



    /**
     * Fetches a folder's details from the server by its ID.
     *
     * @param { Number } folderId   - The unique identifier of the folder to fetch.
     * @returns { Promise<Object> } - A promise that resolves to the folder's details.
     *
     * The function performs the following steps:
     * 1. Constructs an API route using the provided `folderId`.
     * 2. Sends a GET request to the constructed route using the `this.model.get` method.
     * 3. Extracts and returns the `content` property from the server's response,
     *    which contains the folder's details e.g. folder object and folder location object.
     *
     * @example
     * // Fetch a folder by its ID and log its details
     * const { folder, location } = await getFolderById(12345);
     * console.log(folder);
     * console.log(location);
     */
    async getFolderById(folderId) {
        const route = `/folders/${folderId}`;
        const response = await this.model.get(route);
        return response.content;
    }



    /**
     * Updates a folder's details on the server and updates the view with the new data.
     *
     * @param { Object } updatedFolderData          - An object containing the folder's updated data.
     * @param { Number } updatedFolderData.id       - The unique identifier of the folder to update.
     * @param { string } updatedFolderData.name     - The new name for the folder.
     * @param { string } updatedFolderData.color    - The new color for the folder (optional).
     * @returns { Promise<void> }                   - Resolves when the folder is successfully updated and the view is refreshed.
     *
     * The function performs the following steps:
     * 1. Constructs an API route using the `id` from the `updatedFolderData`.
     * 2. Creates a request payload containing the folder's `name` and `color`.
     * 3. Sends an `update` request (PUT request) using the `this.model.update` method.
     * 4. Extracts the updated folder data from the server's response.
     * 5. Updates the UI to reflect the changes using the `this.view.renderUpdate` method.
     *
     * @example
     * const updatedFolderData = {
     *   id: 12345,
     *   name: "New Folder Name",
     *   color: "#FFFFFF"
     * };
     *
     * await updateFolder(updatedFolderData);
     *
     * // The folder's new name and color are sent to the server,
     * // and the view is updated to reflect the changes.
     */
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



    /**
     * Updates the location of a folder by modifying its `parent_id` on the server.
     *
     * @param { Number } parentFolderId     - The unique identifier of the new parent folder to which the folder will be moved.
     * @param { Number } droppedEntityId    - The unique identifier of the folder whose location is being updated.
     * @returns { Promise<void> }           - Resolves when the folder's location is successfully updated and the view is refreshed.
     *
     * The function performs the following steps:
     * 1. Constructs an API route using the `droppedEntityId` to target the specific folder's location.
     * 2. Creates a request payload that contains the `parent_id` (the new parent folder's ID).
     * 3. Sends a `PATCH` request to update the folder's location using the `this.model.patch` method.
     * 4. Extracts the updated folder data from the server's response.
     * 5. Updates the UI by rendering the changes, typically by removing or updating the folder's position in the view using `this.view.renderDelete`.
     *
     * @example
     * const parentFolderId = 10;
     * const droppedEntityId = 20;
     * await updateFolderLocation(parentFolderId, droppedEntityId);
     *
     * // The folder with ID 20 is moved to the parent folder with ID 10,
     * // and the view is updated to reflect the new folder structure.
     */
    async updateFolderLocation(parentFolderId, droppedEntityId) {
        const route = `/folders/${droppedEntityId}/location`;
        const patchFolderLocationRequest = { 'parent_id': parentFolderId };

        const response = await this.model.patch(route, patchFolderLocationRequest);
        const folder = response.content.folder;

        this.view.renderDelete(folder);
    }



    async updateFolderPinValue(folder) {
        const route = `/folders/${folder.id}/pin-folder`;
        const response = await this.model.patch(route);
    }



    /**
     * Deletes a folder from the server and updates the view to reflect the change.
     *
     * @param { Number } folderId   - The unique identifier of the folder to be deleted.
     * @returns {Promise<void>}     - Resolves when the folder is successfully deleted and the view is updated.
     *
     * The function performs the following steps:
     * 1. Constructs an API route using the provided `folderId` to target the folder for deletion.
     * 2. Sends a `DELETE` request to remove the folder from the server using `this.model.delete`.
     * 3. Extracts the deleted folder's data from the server's response.
     * 4. Updates the UI by rendering the folder removal using the `this.view.renderDelete` method.
     *
     * @example
     * const folderId = 12345;
     * await deleteFolder(folderId);
     *
     * // Deletes the folder with ID 12345 from the server and removes it from the UI.
     */
    async deleteFolder(folderId) {
        const route = `/folders/${folderId}`;

        const response = await this.model.delete(route);
        const folder = response.content.folder;

        this.view.renderDelete(folder);
    }



    /**
     * Navigates out of the current folder by going to its parent folder.
     *
     * This method retrieves the parent folder’s ID and name and then triggers a navigation to that parent folder
     * using the `navigateIntoFolder` method.
     *
     * @returns { Promise<void> } - Resolves when the navigation process is complete.
     *
     * @example
     * // Navigates to the parent folder of the current folder
     * await navigateOutOfFolder();
     */
    async navigateOutOfFolder() {
        const { id, name } = this.model.getParentFolder();
        await this.navigateIntoFolder(id, name);
    }



    /**
     * Navigates into a specified folder by its ID and name, updates the view and data models,
     * and loads the folder’s child folders and associated notes.
     *
     * @param { Number } folderId   - The unique identifier of the folder to navigate into.
     * @param { string } name       - The name of the folder to display in the view.
     * @returns { Promise<void> }   - Resolves when the folder navigation and related actions are complete.
     *
     * The function performs the following steps:
     * 1. Displays the folder's name using `this.view.displayFolderName`.
     * 2. Adds the folder to the model with `this.model.addFolder`.
     * 3. If the target folder is the home folder (based on `folderId`), empties the folder list.
     * 4. Sends a `PATCH` request to update the view-time of the folder.
     * 5. Retrieves and renders the child folders of the specified folder.
     * 6. Triggers an event to fetch and render notes for the folder.
     * 7. Optionally renders an empty folder notification if there are no notes in the folder.
     *
     * @example
     * const folderId = 12345;
     * const folderName = "Important Documents";
     * await navigateIntoFolder(folderId, folderName);
     *
     * // Navigates into the folder with ID 12345, updates the UI,
     * // fetches child folders and notes, and handles any folder-specific notifications.
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