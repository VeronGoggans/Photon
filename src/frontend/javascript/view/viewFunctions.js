import { INIT_VIEW_EVENT, FETCH_FOLDER_BY_ID_EVENT } from "../components/eventBus.js";



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