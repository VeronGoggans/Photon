import { AnimationHandler } from "../handlers/animationHandler.js";
import { DropdownHelper } from "../helpers/dropdownHelper.js";
import { capitalizeFirstLetter } from "../util/formatters.js";

export class SettingView {
    constructor(controller) {
        this.controller = controller;
        this.#initElements();
        this.#eventListeners();
        this.dropdownHelper = new DropdownHelper(
            this.dropdowns,
            this.dropdownOptions,
            this.settingsView,
            ['.theme-dropdown','.sidebar-color-dropdown', '.widget-style-dropdown', '.folder-icon-color-dropdown']
        );
        AnimationHandler.fadeInFromSide(this.settingsView);
    }

    setDropdownStates(settings) {
        this.themeInput.value = capitalizeFirstLetter(settings.theme);
        this.sidebarColorInput.value = capitalizeFirstLetter(settings.sidebarColor);
        this.widgetInput.value = capitalizeFirstLetter(settings.widgetStyle);
        this.folderIconInput.value = capitalizeFirstLetter(settings.folderIconColor)
    }


    async applyAppTheme(newTheme) {
        this.dropdownHelper.closeDropdowns();

        // Show the selected theme name in the dropdown
        this.themeInput.value = capitalizeFirstLetter(newTheme);

        // Remove the previous app theme css class
        document.body.classList.remove(...document.body.classList);

        // Add the new app theme css class
        document.body.classList.add(newTheme);

        // Notify the backend to update the app theme
        await this.controller.updateTheme(newTheme);
    }


    async applySidebarCssClass(cssClass) {
        this.dropdownHelper.closeDropdowns();

        // Remove the previous sidebar css class if any is present
        if (this.sidebar.classList.length > 1) {
            // Get all classes
            const classes = Array.from(this.sidebar.classList);

            // Remove the second class
            this.sidebar.classList.remove(classes[1]);
        }
        // Show the selected sidebar style name in the dropdown
        this.sidebarColorInput.value = capitalizeFirstLetter(cssClass);

        // Add the new sidebar css class
        if (cssClass !== 'original') {
            this.sidebar.classList.add(`sidebar-${cssClass}`);
        }

        // Notify the backend to update the sidebar style
        await this.controller.updateSidebarColor(cssClass);
    }


    async applyWidgetStyle(newWidgetStyle) {
        this.dropdownHelper.closeDropdowns();

        // Show the selected widget style name in the dropdown
        this.widgetInput.value = capitalizeFirstLetter(newWidgetStyle);

        // Notify the backend to update the widget style
        await this.controller.updateWidgetStyle(newWidgetStyle);
    }


    async appyFolderIconStyle(newFolderIconColor) {
        this.dropdownHelper.closeDropdowns();

        // Show the selected folder icon style name in the dropdown
        this.folderIconInput.value = capitalizeFirstLetter(newFolderIconColor);

        // Notify the backend to update the folder icon style
        await this.controller.updateFolderIconColor(newFolderIconColor);
    }


    #initElements() {
        this.settingsView = document.querySelector('.settings');
        this.sidebar = document.querySelector('.sidebar');
        this.themeInput = document.querySelector('.theme-dropdown input');
        this.sidebarColorInput = document.querySelector('.sidebar-color-dropdown input');
        this.sidebarOptions = document.querySelector('.sidebar-color-dropdown ul');
        this.themeOptions = document.querySelector('.theme-dropdown ul');
        this.widgetInput = document.querySelector('.widget-style-dropdown input');
        this.widgetOptions = document.querySelector('.widget-style-dropdown ul');
        this.folderIconOptions = document.querySelector('.folder-icon-color-dropdown ul');
        this.folderIconInput = document.querySelector('.folder-icon-color-dropdown input');

        this.darkTheme = this.themeOptions.querySelector('li[theme="dark"]');
        this.lightTheme = this.themeOptions.querySelector('li[theme="light"]');

        this.originalSidebar = this.sidebarOptions.querySelector('li[color="original"]');
        this.softSidebar = this.sidebarOptions.querySelector('li[color="soft"]');
        this.shadowSidebar = this.sidebarOptions.querySelector('li[color="shadow"]');
        this.invisibleSidebar = this.sidebarOptions.querySelector('li[color="invisible"]');

        this.widgetBorder = this.widgetOptions.querySelector('li[widgetstyle="border"]');
        this.widgetShadow = this.widgetOptions.querySelector('li[widgetstyle="shadow"]');

        this.iconBlue = this.folderIconOptions.querySelector('li[iconColor="blue"]')
        this.iconGray = this.folderIconOptions.querySelector('li[iconColor="gray"]')

        this.dropdowns = [this.themeInput, this.sidebarColorInput, this.widgetInput, this.folderIconInput];
        this.dropdownOptions = [this.themeOptions, this.sidebarOptions, this.widgetOptions, this.folderIconOptions];
    }

    #eventListeners() {
        this.lightTheme.addEventListener('click', async () => this.applyAppTheme('light'));
        this.darkTheme.addEventListener('click', async () => this.applyAppTheme('dark'));
        this.originalSidebar.addEventListener('click', async () => this.applySidebarCssClass('original'));
        this.softSidebar.addEventListener('click', async () => this.applySidebarCssClass('soft'));
        this.shadowSidebar.addEventListener('click', async () => this.applySidebarCssClass('shadow'));
        this.invisibleSidebar.addEventListener('click', async () => this.applySidebarCssClass('invisible'));
        this.widgetBorder.addEventListener('click', async () => this.applyWidgetStyle('border'));
        this.widgetShadow.addEventListener('click', async () => this.applyWidgetStyle('shadow'));
        this.iconBlue.addEventListener('click', async () => this.appyFolderIconStyle('blue'));
        this.iconGray.addEventListener('click', async () => this.appyFolderIconStyle('gray'));
    }
}