import { HttpModel } from "../model/httpModel.js";
import { SettingView } from "../view/settingView.js";
import { FETCH_SETTINGS_EVENT } from "../components/eventBus.js";


export class SettingController {
    constructor(eventBus) {
        this.model = new HttpModel();
        this.eventBus = eventBus;

        this.eventBus.registerEvents({
            [FETCH_SETTINGS_EVENT]: async () => await this.loadSettings(),
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
        const sidebar = document.querySelector('.sidebar');

        // Add sidebar class and size based on it's saved state
        if (settings.sidebarColor !== 'original') {
            sidebar.classList.add(settings.sidebarColor);
        }

        if (settings.sidebarState === 'small') {
            sidebar.dispatchEvent(new CustomEvent('SetSidebarState', { detail: { state: 'small' }, bubbles: true }))
        }


        // Save widget style & folder icon color in session storage
        window.sessionStorage.setItem('widget-style', settings.widgetStyle);
        window.sessionStorage.setItem('folder-icon-color', settings.folderIconColor);
    }


    async getSettings() {
        const route = '/settings'
        const response = await this.model.get(route);
        return response.content.settings;
    }



    async updateTheme(newTheme) {
        const route = `/settings/theme/${newTheme}`;
        const response = await this.model.patch(route);
        return response.content.theme;
    }



    async updateSidebarColor(newColor) {
        const route = `/settings/sidebar-color/${newColor}`;
        const response = await this.model.patch(route);
        return response.content.color;
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