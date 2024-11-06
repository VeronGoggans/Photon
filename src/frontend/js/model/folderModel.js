import { HttpModel } from "./httpModel.js";
import { Stack } from "../datastuctures/stack.js";

export class FolderModel extends HttpModel {
    constructor() {
        super();
        this.folders = new Stack()
        this.homeFolder = { id: 1, name: 'Home' }
    }

    emptyFolders() {
        this.folders.clear();
    }

    getCurrentFolder() {
        const folder = this.folders.peek();
        return folder ? folder : this.homeFolder;
    }
    
    getParentFolder() {
        this.folders.pop();
        const folder = this.folders.peek();
        return folder ? folder : this.homeFolder;
    }

    getAllFolders() {
        return this.folders.items
    }

    addFolder(id, name) {
        const folder = { 'id': id, 'name': name };
        const topFolder = this.folders.peek();

        if (this.folders.isEmpty() || id !== topFolder.id) {
            this.folders.push(folder);
        } 
    }

    addHierarcyPath(folders) {
        this.folders.clear();
        for (let i = 0; i < folders.length; i++) {
            const { id, name } = folders[i]
            console.log('adding ' + name);
            this.addFolder(id, name)
        }
    }
}