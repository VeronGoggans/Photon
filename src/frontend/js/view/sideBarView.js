import { sidebarButtonText } from "../constants/constants.js";
import {INIT_VIEW_EVENT} from "../components/eventBus.js";



/**
 *
 */
export class SidebarView {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this._buttonCount = 4;

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


    /**
     * This method is called when the screen width 
     * becomes smaller than 700 pixels
     */
    #collapseButtons() {
        for (let i = 0; i < this._buttonCount; i++) {
            this.sidebarSpans[i].style.position = 'absolute';
            this.sidebarSpans[i].textContent = '';

            this.sidebarIcons[i].style.position = 'relative';
            this.sidebarIcons[i].style.left = '0';

            this.sidebarButtons[i].style.justifyContent = 'center';
        }

        document.querySelector('.logo-container').style.justifyContent = 'center'
        document.querySelector('.logo-text').textContent = '';
    }


    /**
     * This method is called when the screen width 
     * becomes bigger than 700 pixels
     */
    #openButtons() {
        for (let i = 0; i < this._buttonCount; i++) {
            this.sidebarSpans[i].style.position = 'relative';
            this.sidebarSpans[i].textContent = sidebarButtonText[i];

            this.sidebarIcons[i].style.position = 'absolute';
            this.sidebarIcons[i].style.left = '12px';

            this.sidebarButtons[i].style.justifyContent = 'normal';
        }

        document.querySelector('.logo-container').style.justifyContent = 'normal'
        document.querySelector('.logo-text').textContent = 'hoton';
    }


    #toggleSidebar() {
        if (this._sidebar.offsetWidth === 220) {
            this._wrapper.style.transition = '150ms'
            this._wrapper.style.gridTemplateColumns = '80px 1fr';
            this._sidebar.dataset.width = 'small';
            this.logo.style.justifyContent = 'center';
            this.#removeTransition();
            this.#collapseButtons();
        } else {
            this._wrapper.style.transition = '150ms'
            this._wrapper.style.gridTemplateColumns = '220px 1fr';
            this._sidebar.dataset.width = 'large';
            this.logo.style.justifyContent = '';
            this.#removeTransition();
            this.#openButtons();
        }
    }


    #removeTransition() {
        setTimeout(() => {
            this._wrapper.style.transition = '0ms'
        }, 160);
    }


    /**
     * This method checks if the app should display 
     * Its small version or large version.
     * 
     * This method is called when the window resizes
     */
    #resizeSidebar() {
        if (window.innerWidth < 940) {
            this._wrapper.style.gridTemplateColumns = '70px 1fr';
            this._sidebar.dataset.width = 'small';
            this.#collapseButtons();
        } else {
            if (this._sidebar.dataset.width !== 'small') {
                this._wrapper.style.gridTemplateColumns = '220px 1fr';
                this.#openButtons();
            }
        }
    }


    #initElements() {
        this._sidebar = document.querySelector('.sidebar');
        this._icon = document.querySelector('.logo');
        this.sidebarButtons = this._sidebar.querySelectorAll('.sidebar-content a');
        this.sidebarIcons = this._sidebar.querySelectorAll('.sidebar-content a i')
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
        window.addEventListener('resize', () => this.#resizeSidebar());


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
        this._sidebar.addEventListener('drop', (event) => {
            event.preventDefault();

            const droppedCardInfo = JSON.parse(event.dataTransfer.getData('text/plain'));
            const droppedCardId = droppedCardInfo.draggedCardId;
            const draggedItemType = droppedCardInfo.draggedItem;

            const newParentDFolderId = this.applicationController.getParentFolder().id;

            if (droppedCardId !== this.id) {
                if (draggedItemType === 'folder') {
                    this.applicationController.moveFolder(newParentDFolderId, droppedCardId)
                }
                if (draggedItemType === 'note') {
                    this.applicationController.moveNote(newParentDFolderId, droppedCardId)
                }
            }
        })


        /**
         *
         */
        this._sidebar.addEventListener('SetSidebarState', (event) => {
            const { state } = event.detail;

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