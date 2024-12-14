import { HttpModel } from "../model/httpModel.js";
import { SettingView } from "../view/settingView.js";


export class SettingController {
    constructor(applicationController) {
        this.model = new HttpModel();
        this.applicationController = applicationController;
    }

    async init() {
        const settings = await this.getSettings();
        this.view = new SettingView(this, this.applicationController);
        this.view.setDropdownStates(settings);
    }


    async loadSettings() {
        const settings = await this.getSettings();
        // Add theme class
        document.body.classList.add(settings.theme);

        // Add sidebar class
        if (settings.sidebarColor !== 'original') {
            document.querySelector('.sidebar').classList.add(settings.sidebarColor);
        }

        // Save widget style & folder icon color in session storage
        window.sessionStorage.setItem('widget-style', settings.widgetStyle);
        window.sessionStorage.setItem('folder-icon-color', settings.folderIconColor);
    }


    async getSettings() {
        const { settings } = await this.model.get('/settings');
        return settings;
    }

    async updateTheme(newTheme) {
        const { theme } = await this.model.update(`/settings/theme/${newTheme}`);
        return theme;
    }

    async updateSidebarColor(newColor) {
        const { color } = await this.model.update(`/settings/sidebarColor/${newColor}`);
        return color;
    }

    async updateWidgetStyle(newWidgetStyle) {  
        const { widgetStyle } = await this.model.update(`/settings/widgetStyle/${newWidgetStyle}`);
        window.sessionStorage.setItem('widget-style', newWidgetStyle);
        return widgetStyle;
    }

    async updateFolderIconColor(newFolderIconColor) {
        const { folderIconColor } = await this.model.update(`/settings/folderIconColor/${newFolderIconColor}`);
        window.sessionStorage.setItem('folder-icon-color', newFolderIconColor);
        return folderIconColor;
    }
}