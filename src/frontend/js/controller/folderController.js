import { FolderModel } from "../model/folderModel.js";
import { FolderView } from "../view/folderView.js";


export class FolderController {
    constructor(applicationController) {
        this.applicationController = applicationController;
        this.homeFolderId = 1;
        this.model = new FolderModel();
    }

    /**
     * 
     * @param {String} folderId 
     * @param {String} folderName 
     * @param {Array} location - Hierarcical array of folder objects. 
     */
    init(folderId = null, folderName = null, location = null) {
        this.view = new FolderView(this, this.applicationController)
        
        // If a folder on the home view has been clicked.
        if (folderId === null) {
            this.model.clearFolderIdlist();
        }
        if (location !== null) {
            this.model.addHierarcyPath(location)
        } 
        this.navigateIntoFolder(folderId, folderName, true)
    }


    async add(object) {
        const { name, color } = object
        const parentFolderId = this.model.getCurrentFolderID();

        const { folder } = await this.model.add('/folder', {'parent_id': parentFolderId, 'color': color, 'name': name});
        this.view.renderOne(folder);
    }


    async get() {
        const parentFolderId = this.model.getCurrentFolderID();

        const { folders } = await this.model.get(`/folders/${parentFolderId}`);
        this.view.renderAll(folders);
        return true
    }


    async getById(folderId) {
        return await this.model.get(`/folderById/${folderId}`);
    }


    async getSearchItems() {
        const { folders } = await this.model.get('/folderSearchItems');        
        return folders 
    }


    async update(object) {
        const { folder } = await this.model.update('/folder', {'folder_id': object.id, 'name': object.name, 'color': object.color});
        this.view.renderUpdate(folder);
    }


    async move(newParentFolderId, droppedFolderId) {
        const { folder } = await this.model.update('/moveFolder', {'parent_id': newParentFolderId, 'folder_id': droppedFolderId});
        this.view.renderDelete(folder);
    }


    async delete(folderId) {
        const { folder } = await this.model.delete(`/folder/${folderId}`);
        this.view.renderDelete(folder);
    }


    getAllFolderNames() {
        return this.model.getAllFolders()
    }

    getCurrentFolderObject() {
        return this.model.getCurrentFolderObject();
    }
    
    getPreviousFolderObject() {
        return this.model.getPreviousFolderObject();
    }
    
    async navigateOutofFolder() {
        const parentFolder = this.model.removeFolderIdFromList();
        await this.navigateIntoFolder(parentFolder.id, parentFolder.name);
    }

    /**
     * @param {*} init - Indicating if this method is called by the init method
     * or by the folder view.
     */
    async navigateIntoFolder(folderId, name, init = false) {
        // If the home button inside the notes view is clicked 
        if (folderId === this.homeFolderId) this.model.clearFolderIdlist();

        this.view.displayFolderName(name);
        this.model.patch(`/viewedFolderTime/${folderId}`);
        this.model.addFolderIdToList(folderId, name);

        const foldersFetched = await this.get();
        if (!init && foldersFetched) {
            await this.applicationController.getNotes(folderId);    
        }
    }

    clearFolderHistory() {
        this.model.clearFolderIdlist();
    }

    setNoteLocation(location) {
        this.model.addHierarcyPath(location)
    }
}