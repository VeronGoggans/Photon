import {
    INIT_VIEW_EVENT,
    FETCH_FOLDER_BY_ID_EVENT,
    FETCH_NOTE_BY_ID_EVENT, FETCH_NOTES_EVENT, SET_NOTE_FILTER_EVENT
} from "../../components/eventBus.js";
import { ViewRouteIDs } from "../../constants/constants.js";
import { removeBlockTitle, removeContent, resetFolderColorCircle } from "../view/viewFunctions.js";




/**
 *
 * @param folderId
 * @param eventBus
 */
export async function loadFolder(folderId, eventBus) {
    // Loading the clicked on folder in the notes tab
    const { folder, location } = await eventBus.emit(FETCH_FOLDER_BY_ID_EVENT, folderId);
    eventBus.asyncEmit(INIT_VIEW_EVENT, {
        viewId: ViewRouteIDs.NOTES_VIEW_ID,
        folder: folder,
        location: location,
        clearFilters: true
    })
}


/**
 *
 * @param searchItemId
 * @param searchType
 * @param eventBus
 */
export async function handleSearch(searchItemId, searchType, eventBus) {
    const viewId = viewToLoad(searchType)
    if (viewId === ViewRouteIDs.EDITOR_VIEW_ID) {
        if (searchType === 'notes' || searchType === 'templates') {
            
            const { note, location } = await eventBus.asyncEmit(FETCH_NOTE_BY_ID_EVENT, searchItemId);
            eventBus.asyncEmit(INIT_VIEW_EVENT, {
                viewId: viewId,
                editorObject: note,
                newEditorObject: false,
                previousView: ViewRouteIDs.NOTES_VIEW_ID,
                editorObjectLocation: location
            })
        }
    }
    if (viewId === ViewRouteIDs.NOTES_VIEW_ID) {
        const { folder, location } = await eventBus.asyncEmit(FETCH_FOLDER_BY_ID_EVENT, searchItemId);
        eventBus.asyncEmit(INIT_VIEW_EVENT, {
            viewId: viewId,
            folder: folder,
            location: location,
            clearFilters: true
        });
    }
}





export async function showBookmarkedNotes(eventBus) {
    removeBlockTitle(document.querySelector('#folders-block-title'), document.querySelector('.folders'));
    resetFolderColorCircle();

    // Remove the folder and notes from the view and display the bookmarks title.
    document.querySelector('.current-folder-name').textContent = 'Bookmarks📄';
    removeContent(document.querySelector('.notes'));
    removeContent(document.querySelector('.folders'));
    

    // Event that'll notify the folderModel a filter is active e.g. Bookmarks
    eventBus.emit(SET_NOTE_FILTER_EVENT);

    // Fetch all the bookmarked notes.
    await eventBus.asyncEmit(FETCH_NOTES_EVENT, {
        'bookmarks': true,
        'render': true,
        'storeResultInMemory': true,
        'folderId': undefined,   // Default value
        'recent': false,         // Default value
        'recentlyViewed': false, // Default value
        'searchItems': false,    // Default value
    })
}





function viewToLoad(searchType) {
    switch (searchType) {
        case 'notes':
            return ViewRouteIDs.EDITOR_VIEW_ID
        case 'templates':
            return ViewRouteIDs.EDITOR_VIEW_ID
        case 'folders':
            return ViewRouteIDs.NOTES_VIEW_ID
    }
}
