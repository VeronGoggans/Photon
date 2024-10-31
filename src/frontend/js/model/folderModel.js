import { HttpModel } from "./httpModel.js";

export class FolderModel extends HttpModel {
    constructor() {
        super();
        this.folderObjects = []
    }

    clearFolderIdlist() {
        this.folderObjects = [];
    }

    getCurrentFolderObject() {
        const lastFolder = this.folderObjects[this.folderObjects.length - 1];
        return lastFolder ? lastFolder : {id: 1, name: 'Home'};
    }
    
    getPreviousFolderObject() {
        const lastFolder = this.folderObjects[this.folderObjects.length - 2];
        return lastFolder ? lastFolder : {id: 1, name: 'Home'};
    }
    
    /** 
     * @returns {String} The ID of the current folder, 
     * or the home folder id if the stack is empty.
     */
    getCurrentFolderID() {
        const lastFolder = this.folderObjects[this.folderObjects.length - 1];
        return lastFolder ? lastFolder.id : 1;
    }


    getAllFolders() {
        let folders = []
        this.folderObjects.forEach(folderObject => {
            folders.push(folderObject)
        })
        return folders
    }


    addFolderIdToList(id, name) {
        if (this.folderObjects.length > 0) {
            // if the id is not already in the last index of the array, push.
            if (id !== this.folderObjects[this.folderObjects.length - 1].id) {
                this.folderObjects.push({'id': id, 'name': name});
            } else {
                console.log('Push rejected: ID already present in the list!');
            }
        } else {
            this.folderObjects.push({'id': id, 'name': name});
        }
    }

    addHierarcyPath(folders) {
        this.folderObjects = []
        for (let i = 0; i < folders.length; i++) {
            const folder = folders[i]
            console.log('adding ' + folder.name);
            
            this.addFolderIdToList(folder.id, folder.name)
        }
    }

    /**
     * This method returns the parent folder ID of the folder
     * the user is currently in. 
     * 
     * @returns {Object} id: folder id, name: folder name
     */
    removeFolderIdFromList() {
        this.folderObjects.pop();
        const previousFolder = this.folderObjects[this.folderObjects.length - 1];
        return previousFolder ? previousFolder: {id: 1, name: 'Home'};
    }
}