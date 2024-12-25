import { HttpModel } from "./httpModel.js";
import { Stack } from "../datastuctures/stack.js";



export class FolderModel extends HttpModel {
    constructor() {
        super();
        this.stack = new Stack()                       // To keep track of the order in which folders are visited
        this.homeFolder = { id: 1, name: 'Home' }      // A representation of the home folder (root folder)
    }



    /**
     * This method removes every item within the stack
     * which keeps track of the folder hierarchy
     */
    emptyFolders() {
        this.stack.clear();
        this.stack.push(this.homeFolder);
    }



    /**
     * This method returns an object containing the name and ID
     * of the folder the user is currently within.
     *
     * @returns { {id: number, name: string} } - Metadata of the current folder
     */
    getCurrentFolder() {
        const folder = this.stack.peek();
        return folder ? folder : this.homeFolder;
    }



    /**
     * This method returns an object containing the name and ID
     * of the parent folder relative to the current folder the user is currently within.
     *
     * @returns { {id: number, name: string} } - Metadata of the parent folder
     */
    getParentFolder() {
        this.stack.pop();
        const folder = this.stack.peek();
        return folder ? folder : this.homeFolder;
    }



    /**
     * This method returns a complete representation of the folder hierarchy.
     *
     * @returns { Array[{ id: number, name: string }] } - The array containing all the metadata of each folder
     *                                                    within the stack.
     */
    getBreadCrumbs() {
        return this.stack.view();
    }



    /**
     * This method will add a new folder object to the stack,
     * if the provided ID isn't already within the folder object at the top of the stack.
     *
     * @param id    - The ID of the visited folder
     * @param name  - The name of the visited folder
     */
    addFolder(id, name) {
        const folder = { 'id': id, 'name': name };
        const topFolder = this.stack.peek();

        if (this.stack.isEmpty() || id !== topFolder.id) {
            this.stack.push(folder);
        } 
    }



    /**
     * This method will add an array of metadata folder object that represent the
     * path of a given note (document)
     *
     * @param folders - The array of folders (path to a note e.g. editor object)
     */
    addHierarchyPath(folders) {
        this.stack.clear();
        for (let i = 0; i < folders.length; i++) {
            const { id, name } = folders[i]
            this.addFolder(id, name)
        }
    }
}