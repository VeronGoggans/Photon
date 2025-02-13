import { HttpModel } from "../model/httpModel.js";
import { SettingView } from "../view/settingView.js";
import {
    COLLAPSE_SIDEBAR_SUB_TITLE_EVENT,
    FETCH_SETTINGS_EVENT, SET_SIDEBAR_DROPDOWN_STATE_EVENT,
    SET_SIDEBAR_STATE_EVENT,
    SET_SIDEBAR_STYLE_EVENT,
    SIDEBAR_TOGGLE_EVENT
} from "../../components/eventBus.js";


export class SettingController {
    constructor(eventBus) {
        this.eventBus = eventBus;


        this.eventBus.registerEvents({
            [FETCH_SETTINGS_EVENT]: async () => await this.loadSettings(),
            [SIDEBAR_TOGGLE_EVENT]: async (state) => await this.updateSidebarState(state),
            [COLLAPSE_SIDEBAR_SUB_TITLE_EVENT]: async (sidebarSection) => await this.updateSidebarSubsectionState(sidebarSection)
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
        this.eventBus.emit(SET_SIDEBAR_DROPDOWN_STATE_EVENT, {
            'pinnedFoldersDropdown': settings.collapsePinnedFolders,
            'categoriesDropdown': settings.collapseCategories
        })

        // Save widget style & folder icon color in session storage
        // The folder and note UI components will read these values from the session storage
        window.sessionStorage.setItem('widget-style', settings.widgetStyle);
        window.sessionStorage.setItem('folder-icon-color', settings.folderIconColor);
    }



    async getSettings() {
        const response = await HttpModel.get('/settings');
        return new Settings(response.content.settings);
    }


    async updateTheme(newTheme) {
        return this._patchAndExtract(`/settings/theme/${newTheme}`, 'theme');
    }


    async updateSidebarColor(newColor) {
        return this._patchAndExtract(`/settings/sidebar-color/${newColor}`, 'sidebarColor');
    }


    async updateSidebarState(newState) {
        return this._patchAndExtract(`/settings/sidebar-state/${newState}`, 'sidebarState');
    }


    async updateWidgetStyle(newWidgetStyle) {
        window.sessionStorage.setItem('widget-style', newWidgetStyle);
        return this._patchAndExtract(`/settings/widget-style/${newWidgetStyle}`, 'widgetStyle');
    }


    async updateSidebarSubsectionState(sidebarSubsection) {
        return this._patchAndExtract(`/settings/sidebar-subsection-state/${sidebarSubsection}`, 'sidebarSubsectionState')
    }


    async updateFolderIconColor(newFolderIconColor) {
        window.sessionStorage.setItem('folder-icon-color', newFolderIconColor);
        return this._patchAndExtract(`/settings/folder-icon-color/${newFolderIconColor}`, 'folderIconColor');
    }


    async _patchAndExtract(url, key) {
        const response = await HttpModel.patch(url);
        return response.content[key];
    }
}



class Settings {
    constructor(settings) {
        this.theme = settings.theme;
        this.widgetStyle = settings.widgetStyle;
        this.folderIconColor = settings.folderIconColor;
        this.sidebarColor = settings.sidebarColor;
        this.sidebarState = settings.sidebarState;
        this.collapsePinnedFolders = settings.collapsePinnedFolders;
        this.collapseCategories = settings.collapseCategories;
    }
}