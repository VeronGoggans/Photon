import { sidebarButtonText } from "../constants/constants.js";

export class SidebarView {
    constructor(applicationController) {
        this.applicationController = applicationController;
        
        this._sidebar = document.querySelector('.sidebar');
        this._icon = document.querySelector('.logo');
        this.sidebarButtons = this._sidebar.querySelectorAll('.sidebar-content a');
        this.sidebarIcons = this._sidebar.querySelectorAll('.sidebar-content a i')
        this.sidebarSpans = this._sidebar.querySelectorAll('.sidebar-content a span');

        this._collapsed = false;
        this._size = 'standard';
        this._wrapper = document.querySelector('.wrapper');
        this._buttonCount = 8;

        this.#eventListeners();

        this.sidebarButtons.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();

                const anchor = event.target.closest('a[data-view]')
                if (anchor) {

                    const viewId = anchor.getAttribute('data-view')

                    if (viewId === 'notes') {
                        // Load the notes view and tell it to render the Home folder 
                        const homeFolder = {'id': 1, 'name': 'Home'}
                        applicationController.initView('notes', { 
                            folder: homeFolder,
                            location: homeFolder
                         });
                    } else {
                        // Load any other view if not the notes view.
                        applicationController.initView(viewId);
                    }                    
                }
            });
        });
    }

    setActiveTab(view) {
        // Remove the previous active tab
        this.sidebarButtons.forEach(button => button.classList.remove('active-view'));

        // Set new active tab
        this._sidebar.querySelector(`#${view}-btn`).classList.add('active-view')
    }

    /**
     * This method is called when the screen width 
     * becomes smaller then 700 pixels
     */
    #collapseButtons() {
        for (let i = 0; i < this._buttonCount; i++) {
            this.sidebarSpans[i].style.position = 'absolute';
            this.sidebarSpans[i].textContent = '';

            this.sidebarIcons[i].style.position = 'relative';
            this.sidebarIcons[i].style.left = 0;

            this.sidebarButtons[i].style.justifyContent = 'center';
        }

        document.querySelector('.logo-container').style.justifyContent = 'center'
        document.querySelector('.logo-text').textContent = '';
    }
    
    /**
     * This method is called when the screen width 
     * becomes bigger then 700 pixels
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
            this.#removeTransition();
            this.#collapseButtons();
        } else {
            this._wrapper.style.transition = '150ms'
            this._wrapper.style.gridTemplateColumns = '220px 1fr';
            this._sidebar.dataset.width = 'large';
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
     * it's small version or large version.
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

    #eventListeners() {
        this._icon.addEventListener('click', () => {this.#toggleSidebar()});
        window.addEventListener('resize', () => this.#resizeSidebar());

        this._sidebar.addEventListener('drop', (event) => {
            event.preventDefault();

            const droppedCardInfo = JSON.parse(event.dataTransfer.getData('text/plain'));
            const droppedCardId = droppedCardInfo.draggedCardId;
            const draggedItemType = droppedCardInfo.draggedItem;

            const newParentDFolderId = this.applicationController.getPreviousFolderObject().id;

            if (droppedCardId !== this.id) {
                if (draggedItemType === 'folder') {
                    this.applicationController.moveFolder(newParentDFolderId, droppedCardId)
                }
                if (draggedItemType === 'note') {
                    this.applicationController.moveNote(newParentDFolderId, droppedCardId)
                }
            }
        })

        this._sidebar.addEventListener('dragover', (event) => {
            event.preventDefault();
        })

        this._sidebar.addEventListener('dragleave', (event) => {
            event.preventDefault();
        })
    }
}