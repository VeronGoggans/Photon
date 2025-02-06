import { SidebarView } from "../view/sideBarView.js";
import {
    FETCH_PINNED_FOLDERS_EVENT,
    SET_ACTIVE_TAB_EVENT,
    SET_SIDEBAR_DROPDOWN_STATE_EVENT,
    SET_SIDEBAR_STATE_EVENT,
    SET_SIDEBAR_STYLE_EVENT
} from "../../components/eventBus.js";



export class SidebarController {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.view = new SidebarView(eventBus);

        this.eventBus.registerEvents({
            [SET_ACTIVE_TAB_EVENT]: (tab) => this.view.setActiveTab(tab),
            [SET_SIDEBAR_STYLE_EVENT]: (style) => this.view.setSidebarStyle(style),
            [SET_SIDEBAR_STATE_EVENT]: (state) => this.view.setSidebarState(state),
            [SET_SIDEBAR_DROPDOWN_STATE_EVENT]: (states) => this.view.setSidebarDropdownStates(states.pinnedFoldersDropdown, states.categoriesDropdown)
        })
    }


    async init() {
        // Fetching the pinned folders and displaying them on the sidebar
        const pinnedFolders = await this.eventBus.asyncEmit(FETCH_PINNED_FOLDERS_EVENT);
        this.view.renderPinnedFolders(pinnedFolders);
    }
}