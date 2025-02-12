import { formatName } from "../../util/formatters.js";
import { addDragImage, removeDragImage, showContextMenu } from "../../util/ui.js";
import { applyFolderIconColor, applyWidgetStyle } from "../../util/ui.js";
import { checkAutoScroll, stopScrolling } from "../draggable.js";
import {folderIconColors, UIWebComponentNames} from "../../constants/constants.js";


const optionsMenuTemplate = `
    <div id="edit-folder-btn" >
        <i class="bi bi-pen"></i>
        <span>Edit folder</span>
    </div>
    <div id="pin-folder-btn">
        <i class="bi bi-pin"></i>
        <span>Pin folder</span>
    </div>
    <div id="delete-folder-btn">
        <i class="bi bi-folder-x"></i>
        <span>Delete folder</span>
    </div>
` 



class RecentFolder extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // Parse the folder JSON attribute with error handling
        this.folder = JSON.parse(this.getAttribute(UIWebComponentNames.RECENT_FOLDER));
        this.id = this.folder.id;

        this.render();
        this.addEventListener('click', this.handleCardClick.bind(this));
    }

    disconnectedCallback() {
        this.removeEventListener('click', this.handleCardClick.bind(this));
    }

    render() {
        this.innerHTML = `
            <i class="bi bi-folder"></i>
            <p>${this.folder.name}</p>
        `;
        applyFolderIconColor(this)
        applyWidgetStyle(this);
    }

    handleCardClick() {        
        this.dispatchEvent(new CustomEvent('RecentFolderCardClick', { detail: { folderId: this.id }, bubbles: true }));
    }
}





class FolderPath extends HTMLElement {
    constructor() {
        super();
    }

    setData(value) {
        this.folder = value;
        this.render();
    }

    render() {
        this.textContent = this.folder.name;
        this.id = this.folder.id;
    }

    connectedCallback() {
        this.addEventListener('click', this.handleClick.bind(this));
    }

    handleClick() {     
        if (this.textContent !== '. . . . .') {
            this.dispatchEvent(new CustomEvent('FolderPathClick', { detail: { folderId: this.id }, bubbles: true }));
        }   
    }
}





class PinnedFolder extends HTMLElement {
    static get observedAttributes() {
        return [UIWebComponentNames.PINNED_FOLDER];
    }


    constructor() {
        super();
    }


    attributeChangedCallback(name, oldValue, newValue) {
        if (name === UIWebComponentNames.PINNED_FOLDER) {
            this.pinnedFolder = JSON.parse(newValue);
            this.render();
        }
    }


    connectedCallback() {
        this.pinnedFolder = JSON.parse(this.getAttribute(UIWebComponentNames.PINNED_FOLDER));
        this.id = this.pinnedFolder.id;

        this.render();
        this.addEventListener('click', this.handleClick.bind(this));
    }


    render() {
        this.innerHTML = `
            <i class="bi bi-folder" style="color: ${folderIconColors[this.pinnedFolder.color]} "></i>
            <span>${this.pinnedFolder.name}</span>
        `
    }


    handleClick() {
        this.dispatchEvent(new CustomEvent('PinnedFolderClick', { detail: { folderId: this.id }, bubbles: true }));
    }
}





class Folder extends HTMLElement {
    static get observedAttributes() {
        return [UIWebComponentNames.FOLDER]; 
    }

    constructor() {
        super();
        this.scrollableParent = document.querySelector('.note-view-content')
    }


    connectedCallback() {
        this.folder = JSON.parse(this.getAttribute(UIWebComponentNames.FOLDER));
        this.id = this.folder.id;
        this.draggable = true;
        
        this.render();
        this.addEventListeners();
    }


    attributeChangedCallback(name, oldValue, newValue) {
        if (name === UIWebComponentNames.FOLDER) {
            this.folder = JSON.parse(newValue);
            this.render();
        }
    }
    

    render() {
        this.innerHTML = `
            <i class="bi bi-folder"></i>
            <p>${formatName(this.folder.name)}</p>
        `;
        this.addColor();
        applyFolderIconColor(this);
        applyWidgetStyle(this);
    }


    addEventListeners() {
        this.addEventListener('click', () => { this.handleCardClick() });


        this.addEventListener('contextmenu', (event) => {
            showContextMenu(event, this, optionsMenuTemplate, 'folder-card');
        });

        this.addEventListener('dragstart', (event) => {
            this.classList.add('dragging');
            addDragImage(event, 'folder');

            const dragDataStruct = {
                draggedEntityName: 'folder',
                draggedEntityId: this.id,
            }

            event.dataTransfer.setData('text/plain', JSON.stringify(dragDataStruct));
        });

        this.addEventListener('dragend', () => {
            this.classList.remove('dragging');
            removeDragImage();
            stopScrolling();
        });

        this.addEventListener('dragover', (event) => {
            event.preventDefault();
            this.classList.add('hovered');
        });

        this.addEventListener('dragleave', (event) => {
            event.preventDefault();
            this.classList.remove('hovered');
        });

        this.addEventListener('drag', (event) => {
            checkAutoScroll(this.scrollableParent, event.clientX, event.clientY);
        });

        this.addEventListener('drop', (event) => {
            event.preventDefault();
            // Get the ID and name of the element being dropped
            const droppedCardData = JSON.parse(event.dataTransfer.getData('text/plain'));
            const droppedEntityId = droppedCardData.draggedEntityId;
            const droppedEntityName = droppedCardData.draggedEntityName;

            // In other words nothing will happen if a user drops a folder on itself.
            if (droppedEntityId !== String(this.id)) {
                this.dispatchEvent(new CustomEvent('DroppedItemOnFolder', {
                        detail: {
                            parentFolderId: this.id,
                            droppedEntityId: droppedEntityId,
                            droppedEntityName: droppedEntityName
                        },
                        bubbles: true
                }));
            }
            this.classList.remove('hovered');
        });
    }



    /**
     * The `addColor` method dynamically updates the CSS classes of an element
     * to ensure it reflects the current folder color. It removes any existing
     * color-related classes and applies the new color class from the folder's
     * `color` property.
     *
     * @method
     * @name addColor
     * @description This method iterates through the element's class list, removes
     * any class that includes 'color', and adds the new color class based on the
     * `folder.color` property.
     */
    addColor() {
        const allFolderClasses = Array.from(this.classList);

        for (const cls of allFolderClasses) {
            if (cls.includes('folder-appearance')) {
                this.classList.remove(cls);
            }
        }
        this.classList.add(this.folder.color);
    }



    handleCardClick() {
        this.dispatchEvent(new CustomEvent('FolderCardClick', { detail: { folder: this.folder }, bubbles: true }));
    }

    handleDeleteClick() {
        this.dispatchEvent(new CustomEvent('DeleteFolder', { detail: { folder: this.folder }, bubbles: true }));
    }

    handleEditClick() {
        this.dispatchEvent(new CustomEvent('EditFolder', { detail: { folder: this.folder }, bubbles: true }));
    }

    handlePinClick() {
        this.dispatchEvent(new CustomEvent('PinFolder', { detail: { folder: this.folder }, bubbles: true }));
    }
}





// Register the custom elements
customElements.define(UIWebComponentNames.FOLDER, Folder);
customElements.define(UIWebComponentNames.RECENT_FOLDER, RecentFolder);
customElements.define(UIWebComponentNames.FOLDER_PATH, FolderPath);
customElements.define(UIWebComponentNames.PINNED_FOLDER, PinnedFolder);