/**
 * A lightweight event bus for managing custom events and their listeners.
 * Provides a mechanism for decoupled communication between different components.
 */
export class EventBus {
    /**
     * Initializes the EventBus with an empty collection of events.
     */
    constructor() {
        /**
         * @private
         * @type {Object.<string, Function[]>}
         * @description A mapping of event names to arrays of callback functions.
         */
        this.events = {};
    }

    /**
     * Registers a callback function for a specific event.
     * If the event does not exist, it creates a new array for the event.
     *
     * @param { String } eventName  - The name of the event to listen for.
     * @param { Function } callback - The callback function to invoke when the event is emitted.
     */
    on(eventName, callback) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    }

    /**
     * Emits an event, invoking all registered callback functions for that event.
     * If no listeners are registered for the event, it does nothing.
     * Supports asynchronous event handlers and returns the result.
     *
     * @param { String } eventName - The name of the event to emit.
     * @param {*} [data]           - Optional data to pass to the event listeners.
     * @returns {Promise}          - A Promise that resolves to the results of the event handlers.
     */
    async asyncEmit(eventName, data) {
        let results = [];
        if (this.events[eventName]) {
            // Iterate over all listeners for the event
            for (let callback of this.events[eventName]) {
                const result = await callback(data);
                results.push(result);
            }
        }

        // If there is only one result, return it directly, otherwise return an array of results
        return results.length === 1 ? results[0] : results;
    }


    /**
     *
     * @param eventName
     * @param data
     * @returns {*|*[]}
     */
    emit(eventName, data) {
        let results = [];
        if (this.events[eventName]) {
            // Iterate over all listeners for the event
            for (let callback of this.events[eventName]) {
                const result = callback(data);
                results.push(result);
            }
        }

        // If there is only one result, return it directly, otherwise return an array of results
        return results.length === 1 ? results[0] : results;
    }


    /**
     * This method will register all custom events
     *
     * @param eventMap - A map containing all the events with their callbacks
     */
    registerEvents(eventMap) {
        for (const [event, handler] of Object.entries(eventMap)) {
            this.on(event, handler);
        }
    }

}






// Asynchronous events
export const FETCH_FOLDER_BY_ID_EVENT = 'fetch-folder-by-id';
export const FETCH_FOLDER_SEARCH_ITEMS_EVENT = 'fetch-folder-search-items';
export const FETCH_RECENT_FOLDERS_EVENT = 'fetch-recent-folders';
export const FETCH_PINNED_FOLDERS_EVENT = 'fetch-pinned-folders';
export const UPDATE_FOLDER_LOCATION_EVENT = 'update-folder-location';
export const UPDATE_FOLDER_PIN_VALUE_EVENT = 'update-folder-pin-value';

export const CREATE_NOTE_EVENT = 'create-note';
export const DELETE_NOTE_EVENT = 'delete-note';
export const FETCH_NOTES_EVENT = 'fetch-notes';
export const FETCH_RECENT_NOTES_EVENT = 'fetch-recent-notes';
export const FETCH_NOTE_BY_ID_EVENT = 'fetch-note-by-id';
export const FETCH_NOTE_SEARCH_ITEMS_EVENT = 'fetch-note-search-items';
export const UPDATE_NOTE_LOCATION_EVENT = 'update-note-location';
export const PATCH_NOTE_NAME_EVENT = 'patch-note-name';
export const PATCH_NOTE_CONTENT_EVENT = 'patch-note-content';


export const FETCH_CATEGORIES_EVENT = 'fetch-category';

export const FETCH_TEMPLATE_SEARCH_ITEMS_EVENT = 'fetch-template-search-items';

export const FETCH_BOARD_SEARCH_ITEMS_EVENT = 'fetch-board-search-items'; 

export const FETCH_SETTINGS_EVENT = 'fetch-settings';

// Synchronous events
export const GET_CURRENT_FOLDER_EVENT = 'get-current-folder';
export const GET_PARENT_FOLDER_EVENT = 'get-parent-folder';
export const GET_BREAD_CRUMBS_EVENT = 'get-bread-crumbs';
export const SET_NOTE_FILTER_EVENT = 'set-note-filter';
export const CLEAR_NOTE_FILTER_EVENT = 'clear-note-filter';
export const GET_PREVIOUS_VIEW_EVENT = 'get-previous-view';
export const GET_CURRENT_VIEW_EVENT = 'get-current-view';
export const INIT_VIEW_EVENT = 'init-view';

export const OPEN_TEXT_EDITOR_EVENT = 'open-text-editor';
export const OPEN_NOTE_IN_TEXT_EDITOR_EVENT = 'open-note-in-text-editor';
export const LOAD_NOTES_IN_MEMORY_EVENT = 'load-notes-in-memory';
export const CLEAR_STORED_NOTE_EVENT = 'clear-loaded-note';

export const SET_NOTE_LOCATION_EVENT = 'set-note-location';
export const SET_CURRENT_VIEW_EVENT = 'set-previous-view';

export const SET_ACTIVE_TAB_EVENT = 'set-active-tab';
export const SET_SIDEBAR_STYLE_EVENT = 'set-sidebar-style';
export const SET_SIDEBAR_STATE_EVENT = 'set-sidebar-state';
export const SET_SIDEBAR_DROPDOWN_STATE_EVENT = 'set-sidebar-dropdown-state';
export const COLLAPSE_SIDEBAR_SUB_TITLE_EVENT = "collapse-sidebar-title"
export const SIDEBAR_TOGGLE_EVENT = 'sidebar-toggle';

// Dialog events (synchronous)
export const RENDER_ORGANISATION_MODAL_EVENT = 'render-organisation-modal';
export const RENDER_CATEGORY_MODAL_EVENT = 'render-category-modal';
export const RENDER_NOTE_DETAILS_MODAL_EVENT = 'render-note-details-modal';
export const RENDER_DELETE_MODAL_EVENT = 'render-delete-note-modal';
export const RENDER_STICKY_BOARD_MODAL_EVENT = 'render-sticky-board-modal';
export const RENDER_SEARCH_MODAL_EVENT = 'render-search-modal';



