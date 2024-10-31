import { folderColors } from "../../constants/constants.js";
import { formatName } from "../../util/formatters.js";
import { addDraggImage } from "../../util/ui.js";


class RecentFolder extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // Parse the folder JSON attribute with error handling
        this.folder = JSON.parse(this.getAttribute('folder'));
        this.id = this.folder.id;

        this.render();
        this.addEventListener('click', this.handleCardClick.bind(this));
    }

    disconnectedCallback() {
        this.removeEventListener('click', this.handleCardClick.bind(this));
    }

    render() {
        this.innerHTML = `
            <i id="folder-icon" class="bi bi-folder-fill"></i>
            <p>${this.folder.name}</p>
        `;
    }

    handleCardClick() {        
        this.dispatchEvent(new CustomEvent('RecentFolderCardClick', { detail: { folderId: this.id }, bubbles: true }));
    }
}



class FolderPath extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.folder = JSON.parse(this.getAttribute('folder'));
        this.textContent = this.folder.name;
        this.id = this.folder.id;

        this.addEventListener('click', this.handleClick.bind(this));
    }

    disconnectedCallback() {
        this.removeEventListener('click', this.handleClick.bind(this));
    }

    handleClick() {        
        this.dispatchEvent(new CustomEvent('FolderPathClick', { detail: { folderId: this.id }, bubbles: true }));
    }
}



class Folder extends HTMLElement {
    static get observedAttributes() {
        return ['folder']; 
    }

    constructor() {
        super();
    }

    connectedCallback() {
        this.folder = JSON.parse(this.getAttribute('folder'));
        this.id = this.folder.id;
        this.draggable = true;
        
        this.render();
        this.addEventListeners();
    }


    disconnectedCallback() {
        this.removeEventListeners();
    }


    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'folder') {
            this.folder = JSON.parse(newValue);
            this.render();
            this.addEventListeners()            
        }
    }
    

    render() {
        this.innerHTML = `
            <p class="folder-name">${formatName(this.folder.name)}</p>
            <i id="folder-icon" class="bi bi-folder"></i>
            <div class="folder-options">
                <i id="edit-btn" class="fa-solid fa-pen"></i>
                <i id="delete-btn" class="fa-solid fa-trash"></i>
            </div>
        `;
        this.addColor();
    }


    addEventListeners() {
        this.querySelector('#folder-icon').addEventListener('click', this.handleCardClick.bind(this));
        this.querySelector('#edit-btn').addEventListener('click', this.handleEditClick.bind(this));
        this.querySelector('#delete-btn').addEventListener('click', this.handleDeleteClick.bind(this));
        this.addEventListener('dragstart', (event) => {this.dragStart(event)}); 
        this.addEventListener('dragend', () => {this.dragEnd()});
        this.addEventListener('dragover', (event) => {this.onHover(event)});
        this.addEventListener('dragleave', (event) => {this.onLeave(event)});
        this.addEventListener('drop', (event) => {this.drop(event)});
    }


    removeEventListeners() {
        this.querySelector('.folder-name').removeEventListener('click', this.handleCardClick.bind(this));
        this.querySelector('#edit-btn').removeEventListener('click', this.handleEditClick.bind(this));
        this.querySelector('#delete-btn').removeEventListener('click', this.handleDeleteClick.bind(this));
    }

    addColor() {
        const newColor = folderColors[this.folder.color];
        const folderClasses = Array.from(this.classList);
        
        for (const cls of folderClasses) {
            if (cls.includes('color')) {
                this.classList.remove(cls);
            }
        }        
        this.classList.add(newColor);
    }


    drop(event) {
        event.preventDefault();
        // Get the id of the element being dragged
        const droppedCardInfo = JSON.parse(event.dataTransfer.getData('text/plain'));
        const droppedCardId = droppedCardInfo.draggedCardId;
        const draggedItemType = droppedCardInfo.draggedItem;

        // In other words nothing will happen if a user drops a folder on itself. 
        // != is used instead of !== because a id attribute of a html tag is a string and 
        // the id from the backend is a integer
        if (droppedCardId != this.id) {
            this.handleDrop(droppedCardId, draggedItemType);                    
        }
        this.classList.remove('hovered');
    }

    onHover(event) {
        event.preventDefault();
        this.classList.add('hovered');
    }

    onLeave(event) {
        event.preventDefault();
        this.classList.remove('hovered');
    }

    dragStart(event) {
        this.classList.add('dragging');
        addDraggImage(event, 'folder');
        event.dataTransfer.setData('text/plain', `{"draggedItem": "folder", "draggedCardId": "${this.id}"}`);
    }

    dragEnd() {
        this.classList.remove('dragging');
    }

    handleCardClick() {
        this.dispatchEvent(new CustomEvent('FolderCardClick', { detail: { folder: this.folder }, bubbles: true }));
    }

    handleDeleteClick() {
        this.dispatchEvent(new CustomEvent('DeleteFolder', { detail: { folder: this.folder }, bubbles: true }));
    }

    handleEditClick() {
        this.dispatchEvent(new CustomEvent('UpdateFolder', { detail: { folder: this.folder }, bubbles: true }));
    }

    handleDrop(ItemId, itemType) {
        this.dispatchEvent(new CustomEvent('DroppedItemOnFolder', { detail: { folderId: this.id, droppedItemId: ItemId, droppedItemType: itemType }, bubbles: true}));
    }
}

// Register the custom elements
customElements.define('folder-card', Folder);
customElements.define('recent-folder-card', RecentFolder);
customElements.define('folder-path', FolderPath);