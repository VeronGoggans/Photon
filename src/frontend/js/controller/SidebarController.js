import { SidebarView } from "../view/sideBarView.js";
import {SET_ACTIVE_TAB_EVENT, SET_SIDEBAR_STATE_EVENT, SET_SIDEBAR_STYLE_EVENT} from "../components/eventBus.js";



export class SidebarController {
    constructor(eventBus) {

        this.eventBus = eventBus;
        this.view = new SidebarView(eventBus);

        this.eventBus.registerEvents({
            [SET_ACTIVE_TAB_EVENT]: (tab) => this.view.setActiveTab(tab),
            [SET_SIDEBAR_STYLE_EVENT]: (style) => this.view.setSidebarStyle(style),
            [SET_SIDEBAR_STATE_EVENT]: (state) => this.view.setSidebarState(state)
        })
    }
}