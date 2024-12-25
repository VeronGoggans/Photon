import { NoteController } from "./noteController.js";
import { HomeController } from "./homeController.js";
import { FolderController } from "./folderController.js";
import { SidebarView } from "../view/sideBarView.js";
import { TextEditorController } from "./textEditorController.js"
import { SettingController } from "./settingController.js";
import { templates } from "../constants/templates.js";
import { StickyWallHomeController } from "./stickyWallHomeController.js";
import { StickWallController } from "./stickyWallController.js";
import { Stack } from "../datastuctures/stack.js";
import {
    EventBus,
    FETCH_SETTINGS_EVENT,
    GET_PREVIOUS_VIEW_EVENT,
    INIT_VIEW_EVENT, OPEN_NOTE_IN_TEXT_EDITOR_EVENT, OPEN_TEXT_EDITOR_EVENT,
    SET_NOTE_LOCATION_EVENT, SET_PREVIOUS_VIEW_EVENT
} from "../components/eventBus.js";




export class ApplicationController {
    constructor() {
        this.viewStack = new Stack();
        this.eventBus = new EventBus();
        this.router = new Router(this.eventBus);

        this.eventBus.emit(FETCH_SETTINGS_EVENT);
        this.eventBus.registerEvents({
            [GET_PREVIOUS_VIEW_EVENT]: () => this.viewStack.pop(),
            [SET_PREVIOUS_VIEW_EVENT]: (viewId) => this.viewStack.push(viewId),
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
        this.stickyWallHomeController = new StickyWallHomeController(this.eventBus);
        this.sidebarView = new SidebarView(this.eventBus);

        this.viewElement = document.querySelector('.content .view');


        this.initView({viewId: 'home'});
    }


    initView(viewParameters = {}) {
        const viewId = viewParameters.viewId;
        this.viewElement.innerHTML = templates[viewId];


        setTimeout(async () => {
            if (viewId === 'home') {
                this.sidebarView.setActiveTab('home');
                await this.homeController.init();
            }

            else if (viewId === 'notes') {
                const {folder, location} = viewParameters;

                await this.noteController.init();
                await this.folderController.init(folder.id, folder.name, location);
                this.sidebarView.setActiveTab('notes');
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

                this.eventBus.emit(SET_PREVIOUS_VIEW_EVENT, previousView);
                this.sidebarView.setActiveTab('notes');
            }

            else if (viewId === 'standardStickyBoard') {
                const {stickyBoard, previousView} = viewParameters;
                await this.stickyWallController.initStandardStickyBoard(stickyBoard);

                this.eventBus.emit(SET_PREVIOUS_VIEW_EVENT, previousView);
                this.sidebarView.setActiveTab('sticky-wall-home')
            }

            else if (viewId === 'columnStickyBoard') {
                const {stickyBoard, previousView} = viewParameters;
                await this.stickyWallController.initColumnStickyBoard(stickyBoard);

                this.eventBus.emit(SET_PREVIOUS_VIEW_EVENT, previousView);
                this.sidebarView.setActiveTab('sticky-wall-home')
            }

            else if (viewId === 'settings') {
                this.sidebarView.setActiveTab('settings')
                await this.settingController.init();
            }

            else if (viewId === 'stickyWallHome') {
                this.sidebarView.setActiveTab('sticky-wall-home');
                await this.stickyWallHomeController.init();
            }
        }, 0)
    }
}