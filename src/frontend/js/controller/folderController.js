import { FolderModel } from "../model/folderModel.js";
import { FolderView } from "../view/folderView.js";


export class FolderController {
    constructor(applicationController) {
        this.applicationController = applicationController;
        this.homeFolderId = 1;
        this.model = new FolderModel();
    }

    
    init(folderId = null, folderName = null, location = null) {
        this.view = new FolderView(this, this.applicationController)
        
        // If a folder on the home view has been clicked.
        if (folderId === null) {
            this.model.emptyFolders();
        }
        if (location !== null) {
            this.model.addHierarcyPath(location)
        } 
        this.navigateIntoFolder(folderId, folderName, true)
    }


    async add(object) {
        const { name, color } = object
        const { id } = this.model.getCurrentFolder();
        const { folder } = await this.model.add('/folder', {'parent_id': id, 'color': color, 'name': name});
        this.view.renderOne(folder);
    }


    async get() {
        const { id } = this.model.getCurrentFolder();
        const { folders } = await this.model.get(`/folders/${id}`);
        this.view.renderAll(folders);
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

    getCurrentFolder() {
        return this.model.getCurrentFolder();
    }
    
    getParentFolder() {
        return this.model.getParentFolder();
    }
    
    async navigateOutofFolder() {
        const { id, name } = this.model.getParentFolder();
        await this.navigateIntoFolder(id, name);
    }

    /**
     * @param {*} init - Indicating if this method is called by the init method
     * or by the folder view.
     */
    async navigateIntoFolder(folderId, name, init = false) {
        // If the home button inside the notes view is clicked 
        if (folderId === this.homeFolderId) this.model.emptyFolders();

        this.view.displayFolderName(name);
        this.model.patch(`/viewedFolderTime/${folderId}`);
        this.model.addFolder(folderId, name);

        await this.get();
        if (!init) {
            await this.applicationController.getNotes(folderId);    
        }
    }

    clearFolderHistory() {
        this.model.emptyFolders();
    }

    setNoteLocation(location) {
        this.model.addHierarcyPath(location)
    }
}