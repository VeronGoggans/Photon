import { NoteController } from "./noteController.js";
import { HomeController } from "./homeController.js";
import { FolderController } from "./folderController.js";
import { TextEditorController } from "./textEditorController.js"
import { SettingController } from "./settingController.js";
import { SidebarController } from "./SidebarController.js";
import { templates } from "../../constants/templates.js";
import { Stack } from "../../datastuctures/stack.js";
import {Dialog} from "../../util/dialog.js";
import {
    EventBus,
    FETCH_SETTINGS_EVENT, GET_CURRENT_VIEW_EVENT,
    GET_PREVIOUS_VIEW_EVENT,
    INIT_VIEW_EVENT, OPEN_NOTE_IN_TEXT_EDITOR_EVENT, OPEN_TEXT_EDITOR_EVENT, SET_ACTIVE_TAB_EVENT,
    SET_NOTE_LOCATION_EVENT, SET_CURRENT_VIEW_EVENT
} from "../../components/eventBus.js";
import { ViewRouteIDs } from "../../constants/constants.js";




export class ApplicationController {
    constructor() {
        this.eventBus = new EventBus();
        this.viewStack = new Stack();
        this.router = new Router(this.eventBus);
        this.dialog = new Dialog(this.eventBus);

        this.eventBus.asyncEmit(FETCH_SETTINGS_EVENT);
        this.eventBus.registerEvents({
            [GET_PREVIOUS_VIEW_EVENT]: () => this.viewStack.pop(),
            [GET_CURRENT_VIEW_EVENT]: () => this.viewStack.view(),
            [SET_CURRENT_VIEW_EVENT]: (viewId) => this.viewStack.push(viewId),
            [INIT_VIEW_EVENT]: async (viewParameters) => await this.router.initView(viewParameters)
        })
    }

    async start() {
        await this.router.initView({ viewId: ViewRouteIDs.HOME_VIEW_ID });
    }
}


class Router {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.noteController = new NoteController(this.eventBus);
        this.homeController = new HomeController(this.eventBus);
        this.folderController = new FolderController(this.eventBus)
        this.textEditorController = new TextEditorController(this.eventBus);
        this.settingController = new SettingController(this.eventBus);
        this.sidebarController = new SidebarController(this.eventBus);
        this.viewElement = document.querySelector('.content .view');
        this.sidebarController.init();
    }


    async initView(viewParameters = {}) {
        const viewId = viewParameters.viewId;

        return new Promise((resolve) => {
            const observer = new MutationObserver(async (mutations, obs) => {
                if (this.viewElement.children.length > 0) { // Ensures children exist
                    obs.disconnect(); // Stop observing once the view is loaded
    
                    // Now execute your initialization logic safely
                    if (viewId === ViewRouteIDs.HOME_VIEW_ID) {                    
                        await this.homeController.init();
                        this.eventBus.emit(SET_ACTIVE_TAB_EVENT, 'home');
                    }
    

                    if (viewId === ViewRouteIDs.NOTES_VIEW_ID) {
                        const { folder, location, clearFilters } = viewParameters;
    
                        await this.noteController.init();
                        await this.folderController.init(folder, location, clearFilters);
                        this.eventBus.emit(SET_ACTIVE_TAB_EVENT, 'notes');
                    }
    

                    if (viewId === ViewRouteIDs.EDITOR_VIEW_ID) {
                        const { editorObject, newEditorObject, previousView, editorObjectLocation } = viewParameters;
                        this.textEditorController.init();
    
                        if (editorObjectLocation !== null) {
                            this.eventBus.emit(SET_NOTE_LOCATION_EVENT, editorObjectLocation);
                        }
                        if (newEditorObject) {
                            this.eventBus.emit(OPEN_TEXT_EDITOR_EVENT);
                        }
                        if (!newEditorObject) {
                            this.eventBus.emit(OPEN_NOTE_IN_TEXT_EDITOR_EVENT, editorObject);
                            await this.noteController.updateNoteLastViewTime(editorObject.id);
                        }
    
                        this.eventBus.emit(SET_CURRENT_VIEW_EVENT, previousView);
                        this.eventBus.emit(SET_ACTIVE_TAB_EVENT, 'notes');
                    }
    
                    
                    if (viewId === ViewRouteIDs.SETTINGS_VIEW_ID) {
                        await this.settingController.init();
                        this.eventBus.emit(SET_ACTIVE_TAB_EVENT, 'settings');
                    }

                    resolve();
                }
            });

            // Observe the parent view element for child mutations
            observer.observe(this.viewElement, { childList: true });

            this.viewElement.innerHTML = templates[viewId];
        })
    }
}