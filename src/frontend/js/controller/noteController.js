import { HttpModel } from "../model/httpModel.js";
import { NoteView } from "../view/noteView.js";
import { Searchbar } from "../view/searchbar.js";
import { viewToLoad } from "../helpers/random.js";
import { pushNotification } from "../handlers/notificationHandler.js"
import {
    CREATE_NOTE_EVENT,
    FETCH_FOLDER_BY_ID_EVENT,
    FETCH_FOLDER_SEARCH_ITEMS_EVENT,
    FETCH_NOTE_BY_ID_EVENT,
    FETCH_NOTE_SEARCH_ITEMS_EVENT, FETCH_NOTES_EVENT,
    FETCH_RECENT_NOTES_EVENT,
    INIT_VIEW_EVENT,
    PATCH_NOTE_NAME_EVENT,
    PATCH_NOTE_CONTENT_EVENT
} from "../components/eventBus.js";



export class NoteController {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.model = new HttpModel();

        this.eventBus.registerEvents({
            [FETCH_RECENT_NOTES_EVENT]: async () => await this.getNotes({recent: true}),
            [FETCH_NOTE_BY_ID_EVENT]: async (noteId) => await this.getNoteById(noteId),
            [FETCH_NOTES_EVENT]: async (folderId) => await this.getNotes({folderId: folderId}),
            [FETCH_NOTE_SEARCH_ITEMS_EVENT]: async () => await this.getNotes({searchItems: true}),
            [CREATE_NOTE_EVENT]: async (noteId) => await this.addNote(noteId),
            [PATCH_NOTE_NAME_EVENT]: async (updatedNoteData) => await this.updateNoteName(updatedNoteData),
            [PATCH_NOTE_CONTENT_EVENT]: async (updatedNoteData) => await this.updateNoteContent(updatedNoteData)
        });
    }

    

    async init() {
        this.searchbar = new Searchbar(this);
        this.view = new NoteView(this, this.eventBus);
        await this.#initSearchbar();
    }



    async addNote(newNoteData) {
        const { folderId, name, content, notify } = newNoteData;
        const route = `/notes`;
        const postNoteRequest = {
            'folder_id': folderId,
            'name': name,
            'content': content
        }

        const response = await this.model.add(route, postNoteRequest);
        const note = response.content.note;
        
        if (notify) {
            pushNotification('saved');
        }

        return note
    }


    /**
     *
     * @param folderId
     * @param bookmarks
     * @param recent
     * @param recentlyViewed
     * @param searchItems
     */
    async getNotes(
        { folderId = undefined, bookmarks = false,
            recent = false, recentlyViewed = false,
            searchItems = false
        } = {}) {

        // Construct query parameters dynamically
        const params = new URLSearchParams({
            folder_id: folderId,
            bookmarks,
            recent,
            recently_viewed: recentlyViewed,
            search_items: searchItems,
        });

        if (folderId === undefined) params.delete('folder_id')


        const route = `/notes?${params.toString()}`;
        const response = await this.model.get(route);
        const notes = response.content.notes;

        // Render notes if necessary
        if (folderId || bookmarks) {
            this.view.renderAll(notes);
        }

        else {
            return notes;
        }
    }



    async getNoteById(noteId) {
        const route = `/notes/${noteId}`;
        const response = await this.model.get(route);
        return response.content;
    }



    async updateNoteName(updatedNoteData) {
        const { noteId, updatedName } = updatedNoteData;
        const patchNoteContentRequest = { 'name': updatedName };
        const route = `/notes/${noteId}/name`;
        await this.model.patch(route, patchNoteContentRequest);
    }



    async updateNoteContent(updatedNoteData) {
        const { noteId, updatedContent } = updatedNoteData;
        const patchNoteContentRequest = { 'content': updatedContent };
        const route = `/notes/${noteId}/content`;
        await this.model.patch(route, patchNoteContentRequest);
    }

    

    async updateNoteBookmark(noteId, newBookmarkValue) {
        const route = `/notes/${noteId}/bookmark`;
        const patchNoteBookmarkRequest = { 'bookmark': newBookmarkValue }
        await this.model.patch(route, patchNoteBookmarkRequest);
    }



    async updateNoteLastViewTime(noteId) {
        const route = `/notes/${noteId}/view-time`;
        await this.model.patch(route);
    }



    async updateNoteLocation(folderId, droppedNoteId) {
        const route = `/notes/${droppedNoteId}/location`;
        const patchNoteLocationRequest = { 'folder_id': folderId }

        const response = await this.model.patch(route, patchNoteLocationRequest);
        const note = response.content.note;
        this.view.renderDelete(note);
    }



    async deleteNote(noteId, notify) {
        const route = `/notes/${noteId}`
        const response = await this.model.delete(route);
        const note = response.content.note;
                
        this.searchbar.deleteSearchItem(noteId);
        this.view.renderDelete(note);
        
        if (notify) {
            pushNotification('deleted', note.name)
        }
    }



    async handleSearch(searchItemId, searchType) {
        const viewId = viewToLoad(searchType)
        if (viewId === 'editor') {
            const { note, location } = await this.getNoteById(searchItemId)
            this.eventBus.emit(INIT_VIEW_EVENT, {
                viewId: viewId,
                editorObject: note,
                newEditorObject: false, 
                previousView: 'notes', 
                editorObjectLocation: location
            })
        }

        if (viewId === 'notes') {
            const { folder, location } = await this.eventBus.asyncEmit(FETCH_FOLDER_BY_ID_EVENT, searchItemId);
            this.eventBus.emit(INIT_VIEW_EVENT, {
                viewId: viewId,
                folder: folder,
                location: location
            });
        }
    }


    
    async #initSearchbar() {
        const [noteSearchItems, folderSearchItems] = await Promise.all([
            this.getNotes({ searchItems: true }),
            this.eventBus.asyncEmit(FETCH_FOLDER_SEARCH_ITEMS_EVENT)
        ]);
        this.searchbar.fillSearchbar('note', noteSearchItems);
        this.searchbar.fillSearchbar('folder', folderSearchItems);
    }
}