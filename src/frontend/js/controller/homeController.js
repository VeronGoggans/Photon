import { HomeView } from "../view/homeView.js";
import { HttpModel } from "../model/httpModel.js";
import { Searchbar } from "../view/searchbar.js";
import { viewToLoad } from "../helpers/random.js";


export class HomeController {
    constructor(applicationController) {
        this.applicationController = applicationController;
        this.model = new HttpModel()
    }

    async init() {
        this.searchbar = new Searchbar(this);        
        this.view = new HomeView(this, this.applicationController);

        await this.#initSearchbar();
        await this.getRecentFolders();
        await this.getRecentNotes();
    }

    async getRecentFolders() {
        const { folders } = await this.model.get('/recentFolders');
        this.view.renderRecentFolders(folders);
    }


    async getRecentNotes() {
        const { notes } = await this.model.get('/recentNotes');
        this.view.renderRecentNotes(notes);
    }



    async handleSearch(searchItemId, searchType) {
        const viewId = viewToLoad(searchType)
        if (viewId === 'editor') {
            if (searchType === 'note') {
                const { note, location } = await this.applicationController.getNoteById(searchItemId);
                this.applicationController.initView(viewId, {
                    editorObject: note,
                    newEditorObject: false, 
                    previousView: 'home',
                    editorObjectLocation: location 
                })
            }
        }
        if (viewId === 'notes') {
            const { folder, location } = await this.applicationController.getFolderById(searchItemId);            
            this.applicationController.initView(viewId, {
                folder: folder,
                location: location
            });
        }

        if (viewId === 'flashcardsPractice') {
            const deck = await this.applicationController.getDeckById(searchItemId);
            this.applicationController.initView(viewId, {
                deck: deck,
                previousView: 'home'
            })
        }
    }

    async #initSearchbar() {
        const [notes, folders] = await Promise.all([
            this.applicationController.getNoteSearchItems(),
            this.applicationController.getFolderSearchItems(),
        ]);
        this.searchbar.fillSearchbar('note', notes);
        this.searchbar.fillSearchbar('folder', folders);
    }
}