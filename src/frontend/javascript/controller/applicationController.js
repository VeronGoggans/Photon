import { NoteController } from "./noteController.js";
import { HomeController } from "./homeController.js";
import { FolderController } from "./folderController.js";
import { TextEditorController } from "./textEditorController.js"
import { SettingController } from "./settingController.js";
import { SidebarController } from "./SidebarController.js";
import { templates } from "../constants/templates.js";
import { StickyWallHomeController } from "./stickyWallHomeController.js";
import { StickWallController } from "./stickyWallController.js";
import { Stack } from "../datastuctures/stack.js";
import {Dialog} from "../util/dialog.js";
import {
    EventBus,
    FETCH_SETTINGS_EVENT, GET_CURRENT_VIEW_EVENT,
    GET_PREVIOUS_VIEW_EVENT,
    INIT_VIEW_EVENT, OPEN_NOTE_IN_TEXT_EDITOR_EVENT, OPEN_TEXT_EDITOR_EVENT, SET_ACTIVE_TAB_EVENT,
    SET_NOTE_LOCATION_EVENT, SET_CURRENT_VIEW_EVENT
} from "../components/eventBus.js";




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
            [INIT_VIEW_EVENT]: (viewParameters) => this.router.initView(viewParameters)
        })
    }
}





class Router {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.noteController = new NoteController(this.eventBus);
        this.homeController = new HomeController(this.eventBus);
        this.folderController = new FolderController(this.eventBus)
        this.textEditorController = new TextEditorController(this.eventBus);
        this.stickyWallController = new StickWallController(this.eventBus);
        this.settingController = new SettingController(this.eventBus);
        this.sidebarController = new SidebarController(this.eventBus);
        this.stickyWallHomeController = new StickyWallHomeController(this.eventBus);
        this.viewElement = document.querySelector('.content .view');


        this.initView({ viewId: 'home' });
        this.initView({ viewId: 'sidebar' });
    }


    initView(viewParameters = {}) {
        const viewId = viewParameters.viewId;

        // The sidebar view doesn't have a template.
        // So this function does not need to load in any html template.
        if (viewId !== 'sidebar') {
            this.viewElement.innerHTML = templates[viewId];
        }

        setTimeout(async () => {
            if (viewId === 'home') {
                await this.homeController.init();
                this.eventBus.emit(SET_ACTIVE_TAB_EVENT, 'home');
            }

            else if (viewId === 'notes') {
                const { folder, location, clearFilters } = viewParameters;

                await this.noteController.init();
                await this.folderController.init(folder, location, clearFilters);
                this.eventBus.emit(SET_ACTIVE_TAB_EVENT, 'notes');
            }

            else if (viewId === 'editor') {
                const {editorObject, newEditorObject, previousView, editorObjectLocation} = viewParameters;
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

            else if (viewId === 'standardStickyBoard') {
                const { stickyBoard, previousView } = viewParameters;
                await this.stickyWallController.initStandardStickyBoard(stickyBoard);

                this.eventBus.emit(SET_CURRENT_VIEW_EVENT, previousView);
                this.eventBus.emit(SET_ACTIVE_TAB_EVENT,'sticky-wall-home');
            }

            else if (viewId === 'columnStickyBoard') {
                const {stickyBoard, previousView} = viewParameters;
                await this.stickyWallController.initColumnStickyBoard(stickyBoard);

                this.eventBus.emit(SET_CURRENT_VIEW_EVENT, previousView);
                this.eventBus.emit(SET_ACTIVE_TAB_EVENT, 'sticky-wall-home');
            }

            else if (viewId === 'settings') {
                await this.settingController.init();
                this.eventBus.emit(SET_ACTIVE_TAB_EVENT,'settings');
            }

            else if (viewId === 'sidebar') {
                await this.sidebarController.init();
            }

            else if (viewId === 'stickyWallHome') {
                await this.stickyWallHomeController.init();
                this.eventBus.emit(SET_ACTIVE_TAB_EVENT,'sticky-wall-home');
            }
        }, 0)
    }
}