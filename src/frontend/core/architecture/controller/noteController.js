import { HttpModel } from "../model/httpModel.js";
import { NoteView } from "../view/noteView.js";
import { pushNotification } from "../../handlers/notificationHandler.js"
import {
    CREATE_NOTE_EVENT,
    FETCH_FOLDER_SEARCH_ITEMS_EVENT,
    FETCH_NOTE_BY_ID_EVENT,
    FETCH_NOTE_SEARCH_ITEMS_EVENT,
    FETCH_NOTES_EVENT,
    FETCH_RECENT_NOTES_EVENT,
    PATCH_NOTE_NAME_EVENT,
    PATCH_NOTE_CONTENT_EVENT,
    LOAD_NOTES_IN_MEMORY_EVENT,
    CLEAR_STORED_NOTE_EVENT,
    DELETE_NOTE_EVENT,
    UPDATE_NOTE_LOCATION_EVENT,
    FETCH_TEMPLATE_SEARCH_ITEMS_EVENT
} from "../../components/eventBus.js";



export class NoteController {
    constructor(eventBus) {
        this.eventBus = eventBus;

        this.eventBus.registerEvents({
            [FETCH_RECENT_NOTES_EVENT]: async () => await this.getNotes({recent: true}),
            [FETCH_NOTE_BY_ID_EVENT]: async (noteId) => await this.getNoteById(noteId),
            [FETCH_NOTES_EVENT]: async (params) => await this.getNotes({folderId: params.folderId, bookmarks: params.bookmarks, recent: params.recent, recentlyViewed: params.recentlyViewed, searchItems: params.searchItems, render: params.render, storeResultInMemory: params.storeResultInMemory}),
            [FETCH_NOTE_SEARCH_ITEMS_EVENT]: async () => await this.getNotes({noteSearchItems: true}),
            [FETCH_TEMPLATE_SEARCH_ITEMS_EVENT]: async () => await this.getNotes({templateSearchItems: true}),
            [CREATE_NOTE_EVENT]: async (noteId) => await this.addNote(noteId),
            [PATCH_NOTE_NAME_EVENT]: async (updatedNoteData) => await this.updateNoteName(updatedNoteData),
            [PATCH_NOTE_CONTENT_EVENT]: async (updatedNoteData) => await this.updateNoteContent(updatedNoteData),
            [DELETE_NOTE_EVENT]: async (noteId) => await this.deleteNote(noteId),
            [UPDATE_NOTE_LOCATION_EVENT]: async (params) => await this.updateNoteLocation(params.parentFolderId, params.droppedEntityId)
        });
    }

    

    async init() {
        this.view = new NoteView(this, this.eventBus);

        // Event that'll notify the TextEditorController to clear any previously loaded note
        // This will clean up the memory that was used to store the note as soon as the user leaves the editor
        this.eventBus.emit(CLEAR_STORED_NOTE_EVENT);
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

        const response = await HttpModel.post(route, postNoteRequest);
        const note = response.content.note;
        
        if (notify) {
            pushNotification('saved');
        }

        return note
    }


    /**
     * 
     * 
     * @returns 
     */
    async getNotes(
        {   folderId = undefined, bookmarks = false,
            recent = false, recentlyViewed = false,
            noteSearchItems = false, templateSearchItems = false, 
            render = false, storeResultInMemory = false
        } = {}) {

        // Construct query parameters dynamically
        const params = new URLSearchParams({
            folder_id: folderId,
            bookmarks,
            recent,
            recently_viewed: recentlyViewed,
            note_search_items: noteSearchItems,
            template_search_items: templateSearchItems
        });

        if (folderId === undefined) params.delete('folder_id')


        const route = `/notes?${params.toString()}`;
        const response = await HttpModel.get(route);
        const notes = response.content.notes;


        // Render notes if necessary
        if (render) {
            this.view.renderAll(notes);
        }

        if (storeResultInMemory) {
            this.eventBus.emit(LOAD_NOTES_IN_MEMORY_EVENT, notes);
        }

        if (!render) {
            return notes;
        }
    }


    /**
     *
     *
     * @param noteId
     */
    async getNoteById(noteId) {
        const route = `/notes/${noteId}`;
        const response = await HttpModel.get(route);

        const parentFolderId = response.content.note.folder_id;

        // Fetch all the notes that are within the same parent folder as the specified note ID
        await this.getNotes({
            folderId: parentFolderId,
            storeResultInMemory: true,
        });

        return response.content;
    }



    async updateNoteName(updatedNoteData) {
        const { noteId, updatedName } = updatedNoteData;
        const patchNoteContentRequest = { 'name': updatedName };
        const route = `/notes/${noteId}/name`;
        const response = await HttpModel.patch(route, patchNoteContentRequest);
        return response.content.note;
    }



    async updateNoteContent(updatedNoteData) {
        const { noteId, updatedContent } = updatedNoteData;
        const patchNoteContentRequest = { 'content': updatedContent };
        const route = `/notes/${noteId}/content`;
        const response = await HttpModel.patch(route, patchNoteContentRequest);
        return response.content.note;
    }

    

    async updateNoteBookmark(noteId, newBookmarkValue) {
        const route = `/notes/${noteId}/bookmark`;
        const patchNoteBookmarkRequest = { 'bookmark': newBookmarkValue }
        await HttpModel.patch(route, patchNoteBookmarkRequest);
    }



    async updateNoteLastViewTime(noteId) {
        const route = `/notes/${noteId}/view-time`;
        await HttpModel.patch(route);
    }



    async updateNoteLocation(parentFolderId, droppedEntityId) {
        const route = `/notes/${droppedEntityId}/location`;
        const patchNoteLocationRequest = { 'parent_id': parentFolderId }

        const response = await HttpModel.patch(route, patchNoteLocationRequest);
        const note = response.content.note;
        this.view.renderDelete(note);
    }



    async deleteNote(
        {
            noteId = undefined,
            render = false,
            notifyUser = false

        } = {}) {

        const route = `/notes/${noteId}`
        const response = await HttpModel.delete(route);
        const note = response.content.note;

        if (render) {
            this.searchbar.deleteSearchItem(noteId);
            this.view.renderDelete(note);
        }
        
        if (notifyUser) {
            pushNotification('deleted', note.name)
        }

        if(!render) {
            return note
        }
    }



    
    async #initSearchbar() {
        const notes = await this.eventBus.asyncEmit(FETCH_NOTE_SEARCH_ITEMS_EVENT);
        const folders = await this.eventBus.asyncEmit(FETCH_FOLDER_SEARCH_ITEMS_EVENT);
        this.searchbar = document.querySelector('autocomplete-searchbar');

        this.searchbar.insertItems('notes', notes);
        this.searchbar.insertItems('folders', folders);
        this.searchbar.renderItems();
    }
}