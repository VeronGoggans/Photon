import {
    INIT_VIEW_EVENT,
    FETCH_FOLDER_BY_ID_EVENT,
    FETCH_NOTE_BY_ID_EVENT
} from "../components/eventBus.js";
import { viewToLoad } from "../helpers/random.js";



/**
 *
 * @param folderId
 * @param eventBus
 */
export async function loadFolder(folderId, eventBus) {
    // Loading the clicked on folder in the notes tab
    const { folder, location } = await eventBus.emit(FETCH_FOLDER_BY_ID_EVENT, folderId);
    eventBus.emit(INIT_VIEW_EVENT, {
        viewId: 'notes',
        folder: folder,
        location: location
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
    if (viewId === 'editor') {
        if (searchType === 'note') {
            const { note, location } = await eventBus.asyncEmit(FETCH_NOTE_BY_ID_EVENT, searchItemId);
            eventBus.emit(INIT_VIEW_EVENT, {
                viewId: viewId,
                editorObject: note,
                newEditorObject: false,
                previousView: 'home',
                editorObjectLocation: location
            })
        }
    }
    if (viewId === 'notes') {
        const { folder, location } = await eventBus.asyncEmit(FETCH_FOLDER_BY_ID_EVENT, searchItemId);
        eventBus.emit(INIT_VIEW_EVENT, {
            viewId: viewId,
            folder: folder,
            location: location
        });
    }
}