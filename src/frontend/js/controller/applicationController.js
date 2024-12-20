import { NoteController } from "./noteController.js";
import { HomeController } from "./homeController.js";
import { FolderController } from "./folderController.js";
import { ApplicationModel } from "../model/applicationModel.js";
import { SidebarView } from "../view/sideBarView.js";
import { TextEditorController } from "./textEditorController.js"
import { SettingController } from "./settingController.js";
import { templates } from "../constants/templates.js";
import { StickyWallHomeController } from "./stickyWallHomeController.js";
import { StickWallController } from "./stickyWallController.js";




export class ApplicationController {
    constructor() {
        this.sidebarView = new SidebarView(this);
        this.model = new ApplicationModel();
        this.noteController = new NoteController(this);
        this.homeController = new HomeController(this);
        this.folderController = new FolderController(this)
        this.textEditorController = new TextEditorController(this);
        this.stickyWallController = new StickWallController(this);
        this.settingController = new SettingController(this);
        this.stickyWallHomeController = new StickyWallHomeController(this);
        this.viewContainer = document.querySelector('.content .view');

        this.settingController.loadSettings();
        this.initView('home');
    }

    initView(viewId, viewParameters = {}) {
        // Rendering the correct view template on the screen
        this.viewContainer.innerHTML = templates[viewId];

        setTimeout(() => {

            if (viewId === 'home') {
                this.folderController.clearFolderHistory();
                this.sidebarView.setActiveTab('home');
                this.homeController.init();
            }

            else if (viewId === 'notes') {
                const { folder, location } = viewParameters;

                this.folderController.init(folder.id, folder.name, location);
                this.noteController.init(folder.id);

                this.sidebarView.setActiveTab('notes');
            }

            else if (viewId === 'editor') {
                const { editorObjectType, editorObject, newEditorObject, previousView, editorObjectLocation } = viewParameters;

                this.textEditorController.init();

                if (editorObjectLocation !== null) {
                    this.folderController.setNoteLocation(editorObjectLocation);
                }

                else if (newEditorObject) {
                    this.openTextEditor(editorObjectType)
                }

                else if (!newEditorObject) {
                    this.openInTextEditor(editorObject, editorObjectType);
                    this.noteController.patchLastViewTime(editorObject.id);
                }

                this.model.setPreviousView(previousView);
                this.sidebarView.setActiveTab('notes');
            }

            else if (viewId === 'standardStickyBoard') {
                const { stickyBoard, previousView } = viewParameters;
                this.stickyWallController.initStandardStickyBoard(stickyBoard);

                this.model.setPreviousView(previousView)
                this.sidebarView.setActiveTab('sticky-wall-home')
            }

            else if (viewId === 'columnStickyBoard') {
                const { stickyBoard, previousView } = viewParameters;
                this.stickyWallController.initColumnStickyBoard(stickyBoard);

                this.model.setPreviousView(previousView)
                this.sidebarView.setActiveTab('sticky-wall-home')
            }

            else if (viewId === 'settings') {
                this.sidebarView.setActiveTab('settings')
                this.settingController.init();
            }

            else if (viewId === 'stickyWallHome') {
                this.sidebarView.setActiveTab('sticky-wall-home');
                this.stickyWallHomeController.init();
            }}, 0);
    }


    getPreviousView() {
        return this.model.getPreviousView();
    }


    /**
     * This opens of a specified editor object within the editor view.
     *
     * When a user clicks on a note or template this method is executed,
     * and will open that note/template in the editor view.
     *
     * @param editorObject         - The editor object that will be loaded in
     * @param editorObjectType     - The type of the object e.g. note or template (future markdown)
     */
    async openInTextEditor(editorObject, editorObjectType) {
        const allFolderNames = this.folderController.getAllFolderNames();
        this.textEditorController.openInTextEditor(editorObject, editorObjectType, allFolderNames);
    }



    /**
     * This method will open the text editor view.
     *
     * Side effect - Clears the text editor model from any previously held note data
     *
     * @param editorObjectType - The type of the object e.g. note or template (future markdown)
     */
    async openTextEditor(editorObjectType) {
        this.clearEditorObject();
        const allFolderNames = this.folderController.getAllFolderNames();
        this.textEditorController.showTextEditor(editorObjectType, allFolderNames);
    }



    /**
     * This method ensures that the text editor model does not
     * Remember anything from a previous note or template. 
     */
    clearEditorObject() {
        this.textEditorController.clearStoredObject();
    }

    // Note methods

    async addNote(name, content, notify) {
        const { id } = this.folderController.getCurrentFolder();
        const note = await this.noteController.add(id, name, content, notify);
        this.textEditorController.storeEditorObject(note, 'note');
    }

    async getNotes(folderId) {
        await this.noteController.get(folderId);
    }

    async getNoteById(noteId) {
        return await this.noteController.getById(noteId)
    }

    async getNoteSearchItems() {
        return await this.noteController.getSearchItems();
    }

    async updateNote(note, notify) {
        await this.noteController.update(note, notify);
    }   

    async moveNote(folderId, droppedNoteId) {
        await this.noteController.move(folderId, droppedNoteId);
    }

    // Folder methods

    async getFolderById(folderId) {
        return await this.folderController.getById(folderId);
    }

    async getFolderSearchItems() {
        return await this.folderController.getSearchItems();
    }

    getCurrentFolder() {
        return this.folderController.getCurrentFolder();
    }

    getParentFolder() {
        return this.folderController.getParentFolder();
    }

    async moveFolder(newParentFolderId, droppedFolderId) {
        await this.folderController.move(newParentFolderId, droppedFolderId)
    }

}