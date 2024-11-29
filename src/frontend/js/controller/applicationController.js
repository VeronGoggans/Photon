import { NoteController } from "./noteController.js";
import { HomeController } from "./homeController.js";
import { FolderController } from "./folderController.js";
import { TemplateController } from "./templateController.js";
import { ApplicationModel } from "../model/applicationModel.js";
import { SidebarView } from "../view/sideBarView.js";
import { TextEditorController } from "./textEditorController.js"
import { SettingController } from "./settingController.js";
import { FlashcardPracticeController } from "./flashcardPracticeController.js";
import { FlashcardEditController } from "./flashcardEditController.js";
import { templates } from "../constants/templates.js";
import { FlashcardHomeController } from "./flashcardHomeController.js";
import { StickyWallHomeController } from "./stickyWallHomeController.js";
import { StickWallController } from "./stickyWallController.js";




export class ApplicationController {
    constructor() {
        this.sidebarView = new SidebarView(this);
        this.model = new ApplicationModel();
        this.noteController = new NoteController(this);
        this.homeController = new HomeController(this);
        this.folderController = new FolderController(this)
        this.templateController = new TemplateController(this);
        this.flashcardDeckController = new FlashcardHomeController(this);
        this.flashcardPracticeController = new FlashcardPracticeController(this);
        this.flashcardEditController = new FlashcardEditController(this);
        this.textEditorController = new TextEditorController(this);
        this.stickyWallController = new StickWallController(this);
        this.settingController = new SettingController(this);
        this.stickyWallHomeController = new StickyWallHomeController(this);
        this.viewContainer = document.querySelector('.content .view');
        this.controllers = {
            home: this.homeController,
            notes: this.noteController,
            flashcardsHome: this.flashcardDeckController,
            flashcardsPractice: this.flashcardPracticeController,
            flashcardEdit: this.flashcardEditController,
            templates: this.templateController,
            stickyWall: this.stickyWallController,
            settings: this.settingController,
            editor: this.textEditorController,
            stickyWallHome: this.stickyWallHomeController
        }
        this.settingController.loadSettings();
        this.initView('home');
    }

    initView(viewId, viewParameters = {}) {
        const controller = this.controllers[viewId];
        if (controller) {
            // Putting the view template on the screen
            this.viewContainer.innerHTML = templates[viewId];
            setTimeout(() => {

                if (viewId === 'home') {
                    this.folderController.clearFolderHistory();
                    this.sidebarView.setActiveTab('home');
                }

                if (viewId === 'notes') {
                    const { folder, location } = viewParameters; 
                    
                    this.folderController.init(folder.id, folder.name, location);
                    // note controller 
                    controller.init(folder.id);
                    this.sidebarView.setActiveTab('notes');
                    return;
                }

                if (viewId === 'editor') {
                    controller.init();
                    const { 
                        editorObjectType, 
                        editorObject, 
                        newEditorObject, 
                        previousView, 
                        editorObjectLocation
                    } = viewParameters;

                    this.model.setPreviousView(previousView);

                    if (editorObjectLocation !== null) {
                        this.folderController.setNoteLocation(editorObjectLocation);
                    }
                    
                    if (newEditorObject) {
                        this.openTextEditor(editorObjectType)
                    } 

                    if (!newEditorObject) {
                        this.openInTextEditor(editorObject, editorObjectType);
                        this.noteController.patchLastViewTime(editorObject.id);
                    }
                    // EditorObjectType can be Template or note.
                    this.sidebarView.setActiveTab(`${editorObjectType}s`);
                    return;
                }

                if (viewId === 'flashcardsHome') {
                    this.sidebarView.setActiveTab('flashcards');
                }

                if (viewId === 'flashcardsPractice') {
                    const {
                        deck,
                        flashcards,
                        previousView
                    } = viewParameters

                    this.model.setPreviousView(previousView);                    

                    controller.init(deck, flashcards);
                    this.sidebarView.setActiveTab('flashcards');
                    return;
                }

                if (viewId === 'flashcardEdit') {
                    const {
                        deck, 
                        flashcards,
                        previousView
                    } = viewParameters

                    this.model.setPreviousView(previousView);

                    controller.init(deck, flashcards);
                    return;
                }

                if (viewId === 'templates') {
                    this.folderController.clearFolderHistory();
                    this.sidebarView.setActiveTab('templates');
                }

                if (viewId === 'stickyWall') {  
                    const { stickyWall, previousView } = viewParameters 
                    controller.init(stickyWall)
                    this.model.setPreviousView(previousView)
                    this.sidebarView.setActiveTab('sticky-wall-home')
                    return;
                }

                if (viewId === 'settings') {
                    this.sidebarView.setActiveTab('settings')
                }

                if (viewId === 'stickyWallHome') {
                    this.sidebarView.setActiveTab('sticky-wall-home')
                }

                controller.init();
            }, 0); 
        }
    }

    getPreviousView() {
        return this.model.getPreviousView();
    }
    
    async openInTextEditor(editorObject, editorObjectType) {
        const allFolderNames = this.folderController.getAllFolderNames();
        this.textEditorController.openInTextEditor(editorObject, editorObjectType, allFolderNames);
    }

    async openTextEditor(editorObjectType) {
        this.clearEditorObject();
        const allFolderNames = this.folderController.getAllFolderNames();
        this.textEditorController.showTextEditor(editorObjectType, allFolderNames);
    }

    /**
     * This method ensures that the text editor model does note
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

    async updateNote(note) {
        await this.noteController.update(note);
    }   

    async moveNote(folderId, droppedNoteId) {
        await this.noteController.move(folderId, droppedNoteId);
    } 

    // Template methods

    async addTemplate(name, content, notify) {
        await this.templateController.add(name, content, notify);
    }

    async getTemplates() {
        await this.templateController.get();
    }

    async getTemplateSearchItems() {
        return await this.templateController.getTemplateNames();
    }

    async getTemplateById(templateId, updateUseCount) {        
        return await this.templateController.getById(templateId, updateUseCount)
    }

    async updateTemplate(template) {
        await this.templateController.update(template);
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

    // Deck methods

    async addDeck(deckName, flashcards) {
        await this.flashcardDeckController.addDeck(deckName, flashcards);
    }

    async getDeckById(deckId) {
        return await this.flashcardDeckController.getDeckById(deckId)
    }

    async getDeckSearchItems() {
        return await this.flashcardDeckController.getSearchItems();
    }

    async getFlashcards(deckId) {
        return await this.flashcardDeckController.getFlashcards(deckId);
    }
}