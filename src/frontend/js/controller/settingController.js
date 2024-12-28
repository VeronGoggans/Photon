import { HttpModel } from "../model/httpModel.js";
import { SettingView } from "../view/settingView.js";
import {
    FETCH_SETTINGS_EVENT,
    SET_SIDEBAR_STATE_EVENT,
    SET_SIDEBAR_STYLE_EVENT,
    SIDEBAR_TOGGLE_EVENT
} from "../components/eventBus.js";


export class SettingController {
    constructor(eventBus) {
        this.model = new HttpModel();
        this.eventBus = eventBus;


        this.eventBus.registerEvents({
            [FETCH_SETTINGS_EVENT]: async () => await this.loadSettings(),
            [SIDEBAR_TOGGLE_EVENT]: async (state) => await this.updateSidebarState(state)
        })
    }



    async init() {
        const settings = await this.getSettings();
        this.view = new SettingView(this, this.eventBus);
        this.view.setDropdownStates(settings);
    }



    async loadSettings() {
        const settings = await this.getSettings();
        // Add theme class
        document.body.classList.add(settings.theme);

        this.eventBus.emit(SET_SIDEBAR_STATE_EVENT, settings.sidebarState);
        this.eventBus.emit(SET_SIDEBAR_STYLE_EVENT, settings.sidebarColor);

        // Save widget style & folder icon color in session storage
        // The folder and note UI components will read these values from the session storage
        window.sessionStorage.setItem('widget-style', settings.widgetStyle);
        window.sessionStorage.setItem('folder-icon-color', settings.folderIconColor);
    }



    async getSettings() {
        const route = '/settings'
        const response = await this.model.get(route);
        return new Settings(response.content.settings);
    }



    async updateTheme(newTheme) {
        const route = `/settings/theme/${newTheme}`;
        const response = await this.model.patch(route);
        return response.content.theme;
    }



    async updateSidebarColor(newColor) {
        const route = `/settings/sidebar-color/${newColor}`;
        const response = await this.model.patch(route);
        return response.content.sidebarColor;
    }


    async updateSidebarState(newState) {
        const route = `/settings/sidebar-state/${newState}`;
        const response = await this.model.patch(route);
        return response.content.sidebarState;
    }



    async updateWidgetStyle(newWidgetStyle) {
        const route = `/settings/widget-style/${newWidgetStyle}`;
        const response = await this.model.patch(route);
        window.sessionStorage.setItem('widget-style', newWidgetStyle);
        return response.content.widgetStyle;
    }



    async updateFolderIconColor(newFolderIconColor) {
        const route = `/settings/folder-icon-color/${newFolderIconColor}`;
        const response = await this.model.patch(route);
        window.sessionStorage.setItem('folder-icon-color', newFolderIconColor);
        return response.content.folderIconColor;
    }
}



class Settings {
    constructor(settings) {
        this.theme = settings.theme;
        this.widgetStyle = settings.widgetStyle;
        this.folderIconColor = settings.folderIconColor;
        this.sidebarColor = settings.sidebarColor;
        this.sidebarState = settings.sidebarState;
    }
}