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

        const { Object } = await this.model.add('/folder', {'parent_id': parentFolderId, 'color': color, 'name': name});
        this.view.renderOne(Object);
    }


    async get() {
        const parentFolderId = this.model.getCurrentFolderID();

        const { Objects } = await this.model.get(`/folders/${parentFolderId}`);
        this.view.renderAll(Objects);
    }


    async getById(folderId) {
        return await this.model.get(`/folderById/${folderId}`);
    }


    async getSearchItems() {
        const { Objects } = await this.model.get('/folderSearchItems');        
        return Objects 
    }


    async update(object) {
        const { Object } = await this.model.update('/folder', {'folder_id': object.id, 'name': object.name, 'color': object.color});
        this.view.renderUpdate(Object);
    }


    async move(newParentFolderId, droppedFolderId) {
        const { Object } = await this.model.update('/moveFolder', {'parent_id': newParentFolderId, 'folder_id': droppedFolderId});
        this.view.renderDelete(Object);
    }


    async delete(folderId) {
        const { Object } = await this.model.delete(`/folder/${folderId}`);
        this.view.renderDelete(Object);
    }


    getAllFolderNames() {
        return this.model.getAllFolderNames()
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

        await this.get();
        if (!init) {
            // This timeout is used to combat the Race condition
            // Where the folders would take
            setTimeout(async () => {
                await this.applicationController.getNotes(folderId);    
            }, 20);
        }
    }

    clearFolderHistory() {
        this.model.clearFolderIdlist();
    }

    setNoteLocation(location) {
        this.model.addHierarcyPath(location)
    }
}