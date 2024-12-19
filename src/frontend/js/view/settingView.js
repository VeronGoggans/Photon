import { AnimationHandler } from "../handlers/animationHandler.js";
import { DropdownHelper } from "../helpers/dropdownHelper.js";
import { capitalizeFirstLetter } from "../util/formatters.js";

export class SettingView {
    constructor(controller, applicationController) {
        this.controller = controller;
        this.applicationController = applicationController;
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


    async #lightMode() {
        this.dropdownHelper.closeDropdowns();
        this.themeInput.value = 'Light';
        document.body.classList.remove('dark');
        document.body.classList.add('light');
        await this.controller.updateTheme('light');
    }
    
    async #darkMode() {
        this.dropdownHelper.closeDropdowns();
        this.themeInput.value = 'Dark';
        document.body.classList.remove('light');
        document.body.classList.add('dark');
        await this.controller.updateTheme('dark');
    }

    async #originalColor() {
        this.dropdownHelper.closeDropdowns();
        this.sidebarColorInput.value = 'Original';
        this.sidebar.classList.remove('soft');
        this.sidebar.classList.remove('invisible');
        await this.controller.updateSidebarColor('original');
    }

    async #softColor() {
        this.dropdownHelper.closeDropdowns();
        this.sidebarColorInput.value = 'Soft';
        if (!this.sidebar.classList.contains('soft')) {
            if (this.sidebar.classList.contains('invisible')) {
                this.sidebar.classList.remove('invisible');
            }
            this.sidebar.classList.add('soft');
            await this.controller.updateSidebarColor('soft');
        }
    }

    async #invisibleColor() {
        this.dropdownHelper.closeDropdowns();
        this.sidebarColorInput.value = 'Invisible';
        if (!this.sidebar.classList.contains('invisible')) {
            if(this.sidebar.classList.contains('soft')) {
                this.sidebar.classList.remove('soft');
            }
            this.sidebar.classList.add('invisible');
            await this.controller.updateSidebarColor('invisible');
        }
    }

    async #widgetShadow() {
        this.dropdownHelper.closeDropdowns();
        this.widgetInput.value = 'Shadow';
        this.controller.updateWidgetStyle('shadow');
    }

    async #widgetBorder() {
        this.dropdownHelper.closeDropdowns();
        this.widgetInput.value = 'Border';
        this.controller.updateWidgetStyle('border');
    }

    async #folderIconColorBlue() {
        this.dropdownHelper.closeDropdowns();
        this.folderIconInput.value = 'Blue';
        this.controller.updateFolderIconColor('blue');
    }

    async #folderIconColorGray() {
        this.dropdownHelper.closeDropdowns();
        this.folderIconInput.value = 'Gray';
        this.controller.updateFolderIconColor('gray');
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
        this.invisibleSidebar = this.sidebarOptions.querySelector('li[color="invisible"]');

        this.widgetBorder = this.widgetOptions.querySelector('li[widgetstyle="border"]');
        this.widgetShadow = this.widgetOptions.querySelector('li[widgetstyle="shadow"]');

        this.iconBlue = this.folderIconOptions.querySelector('li[iconColor="blue"]')
        this.iconGray = this.folderIconOptions.querySelector('li[iconColor="gray"]')

        this.dropdowns = [this.themeInput, this.sidebarColorInput, this.widgetInput, this.folderIconInput];
        this.dropdownOptions = [this.themeOptions, this.sidebarOptions, this.widgetOptions, this.folderIconOptions];
    }

    #eventListeners() {
        this.lightTheme.addEventListener('click', () => {this.#lightMode()});
        this.darkTheme.addEventListener('click', () => {this.#darkMode()});
        this.originalSidebar.addEventListener('click', () => {this.#originalColor()});
        this.softSidebar.addEventListener('click', () => {this.#softColor()});
        this.invisibleSidebar.addEventListener('click', () => {this.#invisibleColor()});
        this.widgetBorder.addEventListener('click', () => {this.#widgetBorder()});
        this.widgetShadow.addEventListener('click', () => {this.#widgetShadow()});
        this.iconBlue.addEventListener('click', () => {this.#folderIconColorBlue()});
        this.iconGray.addEventListener('click', () => {this.#folderIconColorGray()});
    }
}