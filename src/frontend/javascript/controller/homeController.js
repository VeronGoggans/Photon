import { HomeView } from "../view/homeView.js";
import { HttpModel } from "../model/httpModel.js";
import { Searchbar } from "../view/searchbar.js";
import { viewToLoad } from "../helpers/random.js";
import {
    FETCH_FOLDER_BY_ID_EVENT, FETCH_FOLDER_SEARCH_ITEMS_EVENT,
    FETCH_NOTE_BY_ID_EVENT, FETCH_NOTE_SEARCH_ITEMS_EVENT,
    FETCH_RECENT_FOLDERS_EVENT, FETCH_RECENT_NOTES_EVENT,
    INIT_VIEW_EVENT
} from "../components/eventBus.js";


export class HomeController {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.model = new HttpModel()
    }



    async init() {
        this.searchbar = new Searchbar(this);        
        this.view = new HomeView(this, this.eventBus);

        await this.#initSearchbar();
        await this.getRecentFolders();
        await this.getRecentNotes();
    }



    /**
     * Fetches the most recently accessed folders and renders them using the view.
     *
     * This method emits the `FETCH_RECENT_FOLDERS_EVENT` through the `eventBus` to request the recent folders' data.
     * The event listeners are expected to return the folders as a result. Once the folders are retrieved,
     * they are passed to the view for rendering.
     *
     * @async
     * @returns {Promise<void>} - Resolves when the recent folders have been successfully fetched and rendered.
     */
    async getRecentFolders() {
        const folders = await this.eventBus.asyncEmit(FETCH_RECENT_FOLDERS_EVENT);
        this.view.renderRecentFolders(folders);
    }



    /**
     * Fetches the most recently changed notes (documents) and renders them using the view.
     *
     * This method emits the `FETCH_RECENT_NOTES_EVENT` through the `eventBus` to request the recent notes' data.
     * The event listeners are expected to return the notes as a result. Once the notes are retrieved,
     * they are passed to the view for rendering.
     *
     * @async
     * @returns {Promise<void>} - Resolves when the recently changed notes have been successfully fetched and rendered.
     */
    async getRecentNotes() {
        const notes = await this.eventBus.asyncEmit(FETCH_RECENT_NOTES_EVENT);
        this.view.renderRecentNotes(notes);
    }



    /**
     *
     * @param searchItemId
     * @param searchType
     */
    async handleSearch(searchItemId, searchType) {
        const viewId = viewToLoad(searchType)
        if (viewId === 'editor') {
            if (searchType === 'note') {
                const { note, location } = await this.eventBus.asyncEmit(FETCH_NOTE_BY_ID_EVENT, searchItemId);
                this.eventBus.emit(INIT_VIEW_EVENT, {
                    viewId: viewId,
                    editorObject: note,
                    newEditorObject: false,
                    previousView: 'home',
                    editorObjectLocation: location
                })
            }
        }
        if (viewId === 'notes') {
            const { folder, location } = await this.eventBus.asyncEmit(FETCH_FOLDER_BY_ID_EVENT, searchItemId);
            this.eventBus.emit(INIT_VIEW_EVENT, {
                folder: folder,
                location: location
            });
        }
    }



    async #initSearchbar() {
        const notes = await this.eventBus.asyncEmit(FETCH_NOTE_SEARCH_ITEMS_EVENT);
        const folders = await this.eventBus.asyncEmit(FETCH_FOLDER_SEARCH_ITEMS_EVENT);

        this.searchbar.fillSearchbar('note', notes);
        this.searchbar.fillSearchbar('folder', folders);
    }
}