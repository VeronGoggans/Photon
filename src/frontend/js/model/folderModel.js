import { HttpModel } from "./httpModel.js";
import { Stack } from "../datastuctures/stack.js";

export class FolderModel extends HttpModel {
    constructor() {
        super();
        this.stack = new Stack()
        this.homeFolder = { id: 1, name: 'Home' }
    }

    emptyFolders() {
        this.stack.clear();
    }

    getCurrentFolder() {
        const folder = this.stack.peek();
        return folder ? folder : this.homeFolder;
    }
    
    getParentFolder() {
        this.stack.pop();
        const folder = this.stack.peek();
        return folder ? folder : this.homeFolder;
    }

    getAllFolders() {
        return this.stack.stack
    }

    addFolder(id, name) {
        const folder = { 'id': id, 'name': name };
        const topFolder = this.stack.peek();

        if (this.stack.isEmpty() || id !== topFolder.id) {
            this.stack.push(folder);
        } 
    }

    addHierarcyPath(folders) {
        this.stack.clear();
        for (let i = 0; i < folders.length; i++) {
            const { id, name } = folders[i]
            console.log('adding ' + name);
            this.addFolder(id, name)
        }
    }
}