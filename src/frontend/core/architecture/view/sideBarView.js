import { sidebarButtonText, UIWebComponentNames, ViewRouteIDs } from "../../constants/constants.js";
import {
    COLLAPSE_SIDEBAR_SUB_TITLE_EVENT,
    GET_PARENT_FOLDER_EVENT,
    INIT_VIEW_EVENT,
    SIDEBAR_TOGGLE_EVENT,
    UPDATE_FOLDER_LOCATION_EVENT, UPDATE_NOTE_LOCATION_EVENT
} from "../../components/eventBus.js";
import { loadFolder } from "../controller/controllerFunctions.js";
import { UIWebComponentFactory } from "../../patterns/factories/webComponentFactory.js";




export class SidebarView {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this._buttonCount = sidebarButtonText.length;
        this._sidebarTransitionTime = 160; // Milliseconds
        this._sidebarShrinkLimit = 950; // Pixels
        this._bigSidebarWidth = 250; // Pixels
        this._smallSidebarWidth = 100; // Pixels
        this.homeFolder = {'id': 1, 'name': 'Home', 'color': 'color-original', 'parent_id': null}

        this.#initElements();
        this.#eventListeners();
    }


    /**
     * Sets the active tab in the sidebar by updating the CSS classes of the tab buttons.
     *
     * @param {string} view - The identifier for the tab to activate.
     *                        This should correspond to the ID of the tab button, excluding the "-btn" suffix.
     */
    setActiveTab(view) {
        // Remove the previous active tab
        this.sidebarButtons.forEach(button => button.classList.remove('active-tab'));

        // Set the new active tab
        this._sidebar.querySelector(`#${view}-btn`).classList.add('active-tab')
    }




    setSidebarStyle(sidebarColor) {
        if (sidebarColor !== 'original') {
            this._sidebar.classList.add(`sidebar-${sidebarColor}`);
        }
    }


    setSidebarState(sidebarState) {
        this._sidebar.dataset.width = sidebarState;

        if (sidebarState === 'large') {
            this.logo.style.justifyContent = '';
            this.#resizeSidebar(this._bigSidebarWidth);
            this.#removeSidebarResizeTransition();
            this.#openButtons();
        }

        else if (sidebarState === 'small') {
            this.logo.style.justifyContent = 'center';
            this.#resizeSidebar(this._smallSidebarWidth);
            this.#removeSidebarResizeTransition();
            this.#collapseButtons();
        }
    }


    setSidebarDropdownStates(dropdown1State, dropdown2State) {
       if (dropdown1State) {
           this._pinnedFolders.classList.remove('collapsed-sidebar-dropdown')
           this._pinnedFoldersChevron.classList.add('open-sidebar-dropdown-chevron')
       }

       if (dropdown2State) {
           this._categories.classList.remove('collapsed-sidebar-dropdown')
           this._categoriesChevron.classList.add('open-sidebar-dropdown-chevron')
       }
    }



    renderPinnedFolders(folders) {
        UIWebComponentFactory.
        createUIWebComponentCollection(folders, UIWebComponentNames.PINNED_FOLDER, this._pinnedFolders)
    }


    renderCategories(categories) {
        UIWebComponentFactory.
        createUIWebComponentCollection(categories, UIWebComponentNames.CATEGORY, this._categories);
    }


    /**
     * This method is called when the screen width 
     * becomes smaller than 700 pixels
     */
    #collapseButtons() {
        for (const span of this.sidebarSpans) {
            span.textContent = '';
        }
        this._logoContainer.style.justifyContent = 'center'
        this._logoText.textContent = '';
    }



    #collapseSidebarDropdown(sidebarDropdown, chevron) {
        sidebarDropdown.classList.toggle('collapsed-sidebar-dropdown');
        chevron.classList.toggle('open-sidebar-dropdown-chevron');
    }




    /**
     * This method is called when the screen width 
     * becomes bigger than 700 pixels
     */
    #openButtons() {
        for (let i = 0; i < this._buttonCount; i++) {
            this.sidebarSpans[i].textContent = sidebarButtonText[i];
        }
        this._logoContainer.style.justifyContent = 'normal'
        this._logoText.textContent = 'hoton';
    }



    #toggleSidebar() {

        if (this._sidebar.dataset.width === 'large') {
            this._sidebar.dataset.width = 'small';
            this.eventBus.emit(SIDEBAR_TOGGLE_EVENT, 'small');

            this.logo.style.justifyContent = 'center';
            this.#resizeSidebar(this._smallSidebarWidth);
            this.#removeSidebarResizeTransition();
            this.#collapseButtons();
        }

        else if (this._sidebar.dataset.width === 'small') {
            this._sidebar.dataset.width = 'large';
            this.eventBus.emit(SIDEBAR_TOGGLE_EVENT, 'large');

            this.logo.style.justifyContent = '';
            this.#resizeSidebar(this._bigSidebarWidth);
            this.#removeSidebarResizeTransition();
            this.#openButtons();
        }
    }



    #resizeSidebar(sidebarWidth) {
        this._wrapper.style.transition = '150ms'
        this._wrapper.style.gridTemplateColumns = `${sidebarWidth}px 1fr`; // 70px or 250px
    }



    #removeSidebarResizeTransition() {
        setTimeout(() => {
            this._wrapper.style.transition = '0ms'
        }, this._sidebarTransitionTime);
    }


    /**
     * This method checks if the app should display 
     * Its small version or large version.
     * 
     * This method is called when the window resizes
     */
    #autoResizeSidebar() {
        if (window.innerWidth < this._sidebarShrinkLimit) {
            this._wrapper.style.gridTemplateColumns = '70px 1fr';
            this._sidebar.dataset.width = 'small';
            this.#collapseButtons();
        }
    }




    #initElements() {
        this._sidebar = document.querySelector('.sidebar');
        this._icon = document.querySelector('.logo');
        this._logoContainer = document.querySelector('.logo-container');
        this._logoText = document.querySelector('.logo-text');
        this.sidebarButtons = this._sidebar.querySelectorAll('.sidebar-content a');
        this.sidebarSpans = this._sidebar.querySelectorAll('.sidebar-content a span');
        this.logo = this._sidebar.querySelector('.sidebar-logo');
        this._wrapper = document.querySelector('.wrapper');
        this._categoriesDropdown = document.querySelector('#categories-dropdown');
        this._categoriesTitle = document.querySelector('.category-title');
        this._categories = document.querySelector('.categories');
        this._categoriesChevron = document.querySelector('#chevron-categories');

        this._pinnedFoldersDropdown = document.querySelector('#pinned-folders-dropdown');
        this._pinnedFoldersTitle = document.querySelector('.pinned-folders-title');
        this._pinnedFolders = document.querySelector('.pinned-folders');
        this._pinnedFoldersChevron = document.querySelector('#chevron-pinned-folder');
    }


    #eventListeners() {

        /**
         * This event listener will listen for click events on the app logo within the sidebar.
         * Clicking on the logo will toggle the sidebar size (state)
         */
        this._icon.addEventListener('click', () => {
            this.#toggleSidebar();
        });


        this._pinnedFoldersDropdown.addEventListener('click', async () => {
            await this.eventBus.asyncEmit(COLLAPSE_SIDEBAR_SUB_TITLE_EVENT, "pinned-folders")
            this.#collapseSidebarDropdown(this._pinnedFolders, this._pinnedFoldersChevron);
        })


        this._categoriesDropdown.addEventListener('click', async () => {
            await this.eventBus.asyncEmit(COLLAPSE_SIDEBAR_SUB_TITLE_EVENT, "categories")
            this.#collapseSidebarDropdown(this._categories, this._categoriesChevron);
        })


        this._sidebar.addEventListener('PinnedFolderClick', async (event) => {
            await loadFolder(event.detail.folderId, this.eventBus);
        })


        /**
         * This event listener will listen for the resize event on the window,
         * if the width of the window (viewport) becomes smaller than 940 pixels
         *
         * @function #resizeSidebar will collapse the sidebar to its small state.
         */
        window.addEventListener('resize', () => this.#autoResizeSidebar());


        /**
         * This collection of event listeners will listen for the click event on the sidebar buttons.
         *
         * If the notes tab button is clicked the ApplicationController will be notified to initialize the
         * note view and load the home folder (root folder)
         *
         * All the other tabs will just notify the ApplicationController to initialize the corresponding view,
         * without any other logic
         */
        this.sidebarButtons.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();

                const anchor = event.target.closest('a[data-view]')
                const viewId = anchor.getAttribute('data-view')

                if (viewId === ViewRouteIDs.NOTES_VIEW_ID) {
                    // Event that tells the ApplicationController to initialize the notes view
                    // and load the home folder (root folder).
                    this.eventBus.asyncEmit(INIT_VIEW_EVENT, {
                        viewId: viewId,
                        folder: this.homeFolder,
                        location: [this.homeFolder],
                        clearFilters: true
                    });
                }

                // load other views (e.g. sticky board, home, settings view)
                else {
                    this.eventBus.asyncEmit(INIT_VIEW_EVENT, {viewId: viewId});
                }
            });
        });


        /**
         *
         */
        this._sidebar.addEventListener('drop', async (event) => {
            event.preventDefault();

            const droppedCardData = JSON.parse(event.dataTransfer.getData('text/plain'));
            const droppedEntityId = droppedCardData.draggedEntityId;
            const droppedEntityName = droppedCardData.draggedEntityName;

            const parentFolderId = this.eventBus.emit(GET_PARENT_FOLDER_EVENT).id;

            if (droppedEntityName === 'folder') {
                await this.eventBus.asyncEmit(UPDATE_FOLDER_LOCATION_EVENT, {
                    parentFolderId: parentFolderId,
                    droppedEntityId: droppedEntityId
                })
            }
            if (droppedEntityName === 'note') {
                await this.eventBus.asyncEmit(UPDATE_NOTE_LOCATION_EVENT, {
                    parentFolderId: parentFolderId,
                    droppedEntityId: droppedEntityId
                })
            }
        })


        /**
         *
         */
        this._sidebar.addEventListener('dragover', (event) => {
            event.preventDefault();
        })


        /**
         *
         */
        this._sidebar.addEventListener('dragleave', (event) => {
            event.preventDefault();
        })
    }
}