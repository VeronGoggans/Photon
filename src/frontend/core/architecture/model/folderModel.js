import { HttpModel } from "./httpModel.js";
import { Stack } from "../../datastuctures/stack.js";



export class FolderModel extends HttpModel {
    constructor() {
        super();
        this.stack = new Stack()                  // To keep track of the order in which folders are visited
        this.homeFolder = { id: 1, name: 'Home' } // A representation of the home folder (root folder)
        this.isFilterActive = false;              // Could be an active category/tag/bookmarks
        this.filterEntity = null;                 // The actual filter object e.g. Category/Tag
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
        if (this.isFilterActive) {
            this.removeFilter();
            return this.getCurrentFolder();
        }
        this.stack.pop(); // Pop the current folder
        const folder = this.stack.peek(); // Peek the parent folder (now the current folder)
        return folder ? folder : this.homeFolder;
    }


    /**
     * This method returns an object containing the name and ID
     * of the parent folder relative to the current folder the user is currently within.
     *
     * The difference between this method and the getParentFolder method is that this method returns
     * the parent folder while keeping the current folder on the stack.
     *
     * Useful for if you want to see the parent folder without having to remove (pop) the current (top) folder
     *
     * @returns { {id: number, name: string} } - Metadata of the parent folder
     */
    peekParentFolder() {
        const currentFolder = this.stack.pop(); // Pop the current folder
        const parentFolder = this.stack.peek(); // Peek the parent folder
        this.stack.push(currentFolder);         // Push the current folder back
        return parentFolder ? parentFolder : this.homeFolder;
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
     * @param folder    - An object containing the data representing a folder.
     */
    addFolder(folder) {
        this.removeFilter()
        const topFolder = this.stack.peek();

        if (this.stack.isEmpty() || folder.id !== topFolder.id) {
            this.stack.push(folder);
        } 
    }


    /**
     * This method will update the specified folder in the stack.
     *
     * @param folder    - An object containing the data representing the updated folder.
     */
    updateFolder(folder) {
        const stackArray = this.stack.getArrayInstance();
        const index = stackArray.findIndex(storedFolder => storedFolder.id === folder.id);
        const notFound = -1;

        if (index !== notFound) {
            stackArray[index] = folder; // Update the folder at the found index
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

        for (const folder of folders) {
            this.addFolder(folder);
        }
    }


    /**
     * This method will set the isFilterActive parameter to true
     */
    applyFilter(filterEntity = null) {
        this.filterEntity = filterEntity;
        this.isFilterActive = true;
    }


    getActiveFilter() {
        return {
            isFilterActive: this.isFilterActive,
            filterEntity: this.filterEntity,
        }
    }


    removeFilter() {
        this.isFilterActive = false;
        this.filterEntity = null;
    }
}