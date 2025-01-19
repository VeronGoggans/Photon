import { AnimationHandler } from "../handlers/animationHandler.js";
import { greetBasedOnTime } from "../util/date.js";
import { createCustomElement } from "../util/ui/components.js";
import { FETCH_FOLDER_BY_ID_EVENT, FETCH_NOTE_BY_ID_EVENT, INIT_VIEW_EVENT } from "../components/eventBus.js";
import { handleSearch} from "./viewFunctions.js";



export class HomeView {
    constructor(controller, eventBus) {
        this.controller = controller;
        this.eventBus = eventBus;

        this.#initElements();
        this.#eventListeners();

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
        const contentFragment = document.createDocumentFragment();

        for (let i = 0; i < folders.length; i++) {
            const folderCard = this.#recentFolder(folders[i]);

            contentFragment.appendChild(folderCard);
            AnimationHandler.fadeInFromBottom(folderCard);
        }
        this._recentFolderList.appendChild(contentFragment); 
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
        const contentFragment = document.createDocumentFragment();

        for (let i = 0; i < notes.length; i++) {
            const noteCard = createCustomElement(notes[i], 'recently-changed-note-card');

            contentFragment.appendChild(noteCard);
            AnimationHandler.fadeInFromBottom(noteCard);
        }
        this._recentNoteList.appendChild(contentFragment); 
    }



    #recentFolder(folder) {
        const recentFolderCard = document.createElement('recent-folder-card');
        recentFolderCard.setAttribute('folder', JSON.stringify(folder));
        return recentFolderCard
    }



    #eventListeners() {
        this._recentNoteList.addEventListener('RecentNoteCardClick', async (event) => {
            const { noteId } = event.detail;
            const { note, location } = await this.eventBus.asyncEmit(FETCH_NOTE_BY_ID_EVENT, noteId);

            this.eventBus.emit(INIT_VIEW_EVENT,
                {
                    viewId: 'editor',
                    editorObject: note,
                    newEditorObject: false, 
                    previousView: 'home',
                    editorObjectLocation: location 
                }
            );
        })

        this._recentFolderList.addEventListener('RecentFolderCardClick', async (event) => {
            const { folderId } = event.detail;            
            const { folder, location } = await this.eventBus.asyncEmit(FETCH_FOLDER_BY_ID_EVENT, folderId);
            this.eventBus.emit(INIT_VIEW_EVENT, {
                viewId: 'notes',
                folder: folder,
                location: location
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
        this._viewElement = document.querySelector('.home');
    }
}