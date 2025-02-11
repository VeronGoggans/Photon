import { AnimationHandler } from "../../handlers/animationHandler.js";
import { greetBasedOnTime } from "../../util/date.js";
import { FETCH_FOLDER_BY_ID_EVENT, FETCH_NOTE_BY_ID_EVENT, INIT_VIEW_EVENT } from "../../components/eventBus.js";
import { handleSearch, showBookmarkedNotes} from "./viewFunctions.js";
import { UIWebComponentFactory } from "../../patterns/factories/webComponentFactory.js";
import { UIWebComponentNames, ViewRouteIDs } from "../../constants/constants.js";



export class HomeView {
    constructor(controller, eventBus) {
        this.controller = controller;
        this.eventBus = eventBus;

        this.#initElements();
        this.#eventListeners();

        this.homeFolder = {'id': 1, 'name': 'Home', 'color': 'color-original', 'parent_id': null}

        AnimationHandler.fadeInFromBottom(this._viewElement)
    }



    /**
     * Renders a list of recently accessed folders in the view.
     *
     * This method takes an array of folder objects, creates a visual representation for each folder
     * using the private `#recentFolder` method, and appends them to the recent folder list container.
     * It also applies a fade-in animation to each folder card as it is added.
     *
     * @param { Array<Object> } folders - An array of folder objects to render.
     *
     * @returns { void }
     */
    renderRecentFolders(folders) {
        UIWebComponentFactory.
        createUIWebComponentCollection(folders, UIWebComponentNames.RECENT_FOLDER, this._recentFolderList);
    }



    /**
     * Renders a list of recently changed notes in the view.
     *
     * This method takes an array of note objects, creates a visual representation for each note
     * using the imported createCustomElement method, and appends them to the recent notes list container.
     * It also applies a fade-in animation to each note card as it is added.
     *
     * @param { Array<Object> } notes - An array of note objects to render.
     *
     * @returns { void }
     */
    renderRecentNotes(notes) {
        UIWebComponentFactory.
        createUIWebComponentCollection(notes, UIWebComponentNames.RECENTLY_CHANGED_NOTE, this._recentNoteList, false)
    }




    #eventListeners() {
        
        this._showBookmarkedNotesButton.addEventListener('click', async () => {
            // Event that tells the ApplicationController to initialize the notes view
            // and load the home folder (root folder).
            await this.eventBus.asyncEmit(INIT_VIEW_EVENT, {
                viewId: ViewRouteIDs.NOTES_VIEW_ID,
                folder: this.homeFolder,
                location: [this.homeFolder],
                clearFilters: true
            }).then(async () => {
                await showBookmarkedNotes(this.eventBus)
            });
        })



        this._recentNoteList.addEventListener('RecentNoteCardClick', async (event) => {
            const { noteId } = event.detail;
            const { note, location } = await this.eventBus.asyncEmit(FETCH_NOTE_BY_ID_EVENT, noteId);

            this.eventBus.asyncEmit(INIT_VIEW_EVENT,
                {
                    viewId: ViewRouteIDs.EDITOR_VIEW_ID,
                    editorObject: note,
                    newEditorObject: false, 
                    previousView: ViewRouteIDs.HOME_VIEW_ID,
                    editorObjectLocation: location 
                }
            );
        })

        this._recentFolderList.addEventListener('RecentFolderCardClick', async (event) => {
            const { folderId } = event.detail;            
            const { folder, location } = await this.eventBus.asyncEmit(FETCH_FOLDER_BY_ID_EVENT, folderId);
            this.eventBus.asyncEmit(INIT_VIEW_EVENT, {
                viewId: ViewRouteIDs.NOTES_VIEW_ID,
                folder: folder,
                location: location,
                clearFilters: true
            })
        })


        this._viewElement.addEventListener('SearchBarItemClick', async (event) => {
            const { searchType, searchItem } = event.detail;
            await handleSearch(searchItem.id, searchType, this.eventBus);
        })
    }

    #initElements() {
        document.querySelector('.view-title').textContent = greetBasedOnTime();
        this._recentFolderList = document.querySelector('.recent-folders');
        this._recentNoteList = document.querySelector('.recent-notes');
        this._viewElement = document.querySelector('.home-view');
        this._showBookmarkedNotesButton = document.querySelector('.show-bookmarks-patch');
    }
}