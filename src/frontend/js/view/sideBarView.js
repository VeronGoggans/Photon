import { sidebarButtonText } from "../constants/constants.js";
import {
    GET_PARENT_FOLDER_EVENT,
    INIT_VIEW_EVENT,
    SIDEBAR_TOGGLE_EVENT,
    UPDATE_FOLDER_LOCATION_EVENT, UPDATE_NOTE_LOCATION_EVENT
} from "../components/eventBus.js";



/**
 *
 */
export class SidebarView {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this._buttonCount = 4;
        this._sidebarTransitionTime = 160; // Milliseconds
        this._sidebarShrinkLimit = 950; // Pixels

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
            this._sidebar.classList.add(sidebarColor);
        }
    }


    setSidebarState(sidebarState) {
        this._sidebar.dataset.width = sidebarState;

        if (sidebarState === 'large') {
            this.logo.style.justifyContent = '';
            this.#resizeSidebar(220);
            this.#removeSidebarResizeTransition();
            this.#openButtons();
        }

        else if (sidebarState === 'small') {
            this.logo.style.justifyContent = 'center';
            this.#resizeSidebar(70);
            this.#removeSidebarResizeTransition();
            this.#collapseButtons();
        }
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
            this.#resizeSidebar(70);
            this.#removeSidebarResizeTransition();
            this.#collapseButtons();
        }

        else if (this._sidebar.dataset.width === 'small') {
            this._sidebar.dataset.width = 'large';
            this.eventBus.emit(SIDEBAR_TOGGLE_EVENT, 'large');

            this.logo.style.justifyContent = '';
            this.#resizeSidebar(220);
            this.#removeSidebarResizeTransition();
            this.#openButtons();
        }
    }



    #resizeSidebar(sidebarWidth) {
        this._wrapper.style.transition = '150ms'
        this._wrapper.style.gridTemplateColumns = `${sidebarWidth}px 1fr`; // 70px or 220px
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
    }


    #eventListeners() {

        /**
         * This event listener will listen for click events on the app logo within the sidebar.
         * Clicking on the logo will toggle the sidebar size (state)
         */
        this._icon.addEventListener('click', () => {
            this.#toggleSidebar();
        });


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

                if (viewId === 'notes') {
                    // Event that tells the ApplicationController to initialize the notes view
                    // and load the home folder (root folder).
                    this.eventBus.emit(INIT_VIEW_EVENT, {
                        viewId: viewId,
                        folder: {'id': 1, 'name': 'Home'},
                        location: {'id': 1, 'name': 'Home'}
                    });
                }

                // load other views (e.g. sticky board, home, settings view)
                else {
                    this.eventBus.emit(INIT_VIEW_EVENT, {viewId: viewId});
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
            console.log(parentFolderId)

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