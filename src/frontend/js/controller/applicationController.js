import { ApplicationModel } from "../model/applicationModel.js";
import { FolderController } from "./folderController.js";
import { NoteController } from "./noteController.js";
import { TemplateController } from "./templateController.js";
import { ApplicationView } from "../view/applicationView.js";
import { TextEditorController } from "./textEditorController.js"
import { SettingController } from "./settingController.js";
import { Dialog } from "../util/dialog.js";
import { NotificationHandler } from "../handlers/userFeedback/notificationHandler.js";
 
export class ApplicationController {
    constructor() {
        this.homeFolderId = 'f-1';
        this.dialog = new Dialog();
        this.notificationHandler = new NotificationHandler();
        this.applicationView = new ApplicationView(this, this.dialog);
        this.applicationModel = new ApplicationModel();
        this.folderController = new FolderController(this, this.dialog, this.notificationHandler);
        this.noteController = new NoteController(this, this.dialog, this.notificationHandler);
        this.templateController = new TemplateController(this, this.dialog, this.notificationHandler);
        this.textEditorController = new TextEditorController(this, this.dialog);
        this.settingController = new SettingController();
    }


    /**
     * This method starts the application by fetching the root folders.
     * 
     * This method is called when the app starts.
     */
    async start() {
        await this.setTheme(true);
        await this.setEditorPageStyle(true);
        await this.folderController.getFolders();
        await this.noteController.getNotes(this.homeFolderId);
        const RESPONSE = await this.getSearchObjects();
        this.applicationView.giveSearchOptions(RESPONSE.Notes);
        this.applicationView.renderSearchOptions(RESPONSE.Notes);
    }


    async handleAddFolder(name) {
        const currentFolderId = this.applicationModel.getCurrentFolderID();
        if (currentFolderId === 'f-1') {
            await this.addFolder(name);
        } else {
            await this.addSubfolder(name, currentFolderId);
        } 
    }

    async navigateToHomescreen() {
        this.applicationView.removeContent();
        await this.folderController.getFolders();
        await this.noteController.getNotes(this.homeFolderId);
        this.applicationModel.clearFolderIdlist();
        this.applicationView.displayFolderName('Home');
    }
    
    async navigateOutofFolder() {
        const parentFolder = this.applicationModel.removeFolderIdFromList();
        if (parentFolder === this.homeFolderId) {
            await this.navigateToHomescreen();
        }
        else {
            await this.navigateIntoFolder(parentFolder.id, parentFolder.name);
        }
    }

    async navigateIntoFolder(folderId, name) {
        this.applicationView.removeContent();
        this.applicationView.displayFolderName(name);

        await this.folderController.getFolders(folderId);
        await this.noteController.getNotes(folderId);

        this.applicationModel.addFolderIdToList(folderId, name);
    }


    showTextEditor() {
        this.textEditorController.showTextEditor();
    }

    /**
     * This method retrieves a spicific note
     * 
     * This method retrieves the note that has been 
     * clicked on in the search bar takes the user to the folder 
     * the searched note is present in and finally opens 
     * that note in the text editor     
     * 
     * @param {String} noteId 
     */
    async getSearchedNote(noteId) {
        const RESPONSE = await this.noteController.getNoteById(noteId);
        const NOTE = await RESPONSE[0];
        const CONTENT = await NOTE.content;
        const NAME = await NOTE.name;
        const CREATION = await NOTE.creation;
        const LAST_EDIT = await NOTE.last_edit;
        const BOOKMARK = await NOTE.bookmark;
        const FAVORITE = await NOTE.favorite;
        const COLOR = await NOTE.color;
        this.openNoteInTextEditor(CONTENT, NAME, CREATION, LAST_EDIT, noteId, BOOKMARK, FAVORITE, COLOR);
        if (RESPONSE[1] !== this.homeFolderId) {
            this.navigateIntoFolder(await RESPONSE[1], await RESPONSE[2]);
        }
    }

    /**
     * This method returns the current folder ID
     * by calling the application model to retrieve it.
     * 
     * This method is called when
     * 
     * @returns {String} The current folder ID.
     */
    getCurrentFolderID() {
        return this.applicationModel.getCurrentFolderID();
    }

    async getSearchObjects() {
        return await this.applicationModel.getSearchOptions('/noteSearchObjects');
    }
    
    /**
     * This method will add a new note to the search bar's options
     * 
     * This method is called everytime a new note is created.
     * 
     * @param {String} noteId 
     * @param {String} name 
     */
    addSearchObject(noteId, name, folderName) {
        this.applicationView.addSearchObject(noteId, name, folderName);
    }

    /**
     * This method will remove a search object from 
     * the search bar options
     * 
     * This method is called everytime a note gets deleted.
     * 
     * @param {String} noteId 
     */
    deleteSearchObject(noteId) {
        this.applicationView.deleteSearchObject(noteId);
    }

    /**
     * This method will update a search object from 
     * the search bar options
     * 
     * This method is called everytime a note gets updated.
     * 
     * @param {String} noteId 
     * @param {String} name 
     */
    updateSearchObject(noteId, name) {
        this.applicationView.updateSearchObject(noteId, name);
    }

    /**
     * This method opens up the text editor
     * And puts the note the user clicked on, in the text editor.
     */
    openNoteInTextEditor(note) {
        this.textEditorController.openNoteInTextEditor(note);
    }

    openTemplateInTextEditor(template) {
        this.textEditorController.openTemplateInTextEditor(template)
    }

    getTemplates() {
        this.templateController.getTemplates();
    }

    /**
     * This method adds a note to the backend.
     * 
     * This method is called when the save button inside the text editor 
     * is clicked for a new note.
     * 
     * @param {String} content 
     * @param {String} name 
     */
    async addNote(name, content) {
        const currentFolderId = this.applicationModel.getCurrentFolderID();
        const note = await this.noteController.addNote(currentFolderId, name, content);
        this.textEditorController.storeNoteData(note)
    }

    /**
     * This method updates a note.
     * 
     * This method is called when the save button inside the text editor
     * is clicked for an existing note 
     * 
     * @param {String} noteId 
     * @param {String} name 
     * @param {String} content 
     * @param {String} bookmark 
     */
    async changeNote(noteId, name, content, bookmark, favorite, color) {
        await this.noteController.updateNote(noteId, name, content, bookmark, favorite, color);
    }

    /**
     * This method moves a given note from it;s current folder into 
     * the given new folder.
     * 
     * This method is called when the user drops a list note into 
     * a list folder. 
     * 
     * @param {String} noteId 
     * @param {String} folderId 
     */
    async moveNote(noteId, folderId) {
        await this.noteController.moveNote(noteId, folderId);
    }

    async updateNoteColor(noteId, color) {
        await this.noteController.updateNoteColor(noteId, color);
    }

    /**
     * This method adds a subfolder to the backend.
     * 
     * This method is called when the add button inside the 
     * create new folder container is clicked, while being inside a parent folder. 
     * 
     * @param {String} name 
     * @param {String} parentID 
     */
    async addSubfolder(name, parentID) {
        await this.folderController.addFolder(name, parentID);
    }

    /**
     * This method adds a folder to the backend.
     * 
     * This method is called when the add button inside the 
     * create new folder container is clicked.
     * 
     * @param {String} name 
     */
    async addFolder(name) {
        await this.folderController.addFolder(name);
    }

    /**
     * This method deletes a specific note from withing 
     * the text editor
     * 
     * This method is called when the confirm button 
     * inside the noteDeleteContainer is clicked.
     * 
     * @param {String} noteId 
     */
    async deleteNote(noteId) {
        await this.noteController.deleteNote(noteId);
    }

    async exportNote(format, name, content) {
        await this.noteController.exportNote(format, name, content);
    }
    
    async setTheme(init) {
        const THEME = await this.settingController.getTheme();
        this.settingController.setTheme(init, THEME);
    }

    async setEditorPageStyle(init) {
        const STYLE = await this.settingController.getEditorPageStyle();
        this.settingController.setEditorPageStyle(init, STYLE);
    }
}