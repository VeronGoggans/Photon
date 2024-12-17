import { formatName, filterNotePreview } from "../../util/formatters.js";
import { addDraggImage, showContextMenu } from "../../util/ui.js";
import { applyWidgetStyle } from "../../util/ui.js";
import { formatDate } from "../../util/date.js";


const optionMenuTemplate = `
    <div id="bookmark-note-btn" >
        <i class="bi bi-bookmark"></i>
        <span>Bookmark note</span>
    </div>
    <div id="delete-note-btn">
        <i class="bi bi-file-earmark-x"></i>
        <span>Delete note</span>
    </div>
`


class Note extends HTMLElement {
    constructor() {
        super();
    }

    setData(value) {
        this.note = value;
        this.render();
    }

    connectedCallback() {
        this.id = this.note.id;
        this.draggable = true;
        this.addEventListeners();
    }
    

    render() {       
        this.innerHTML = `
            <h4>${formatName(this.note.name)}</h4>
            <div class="note-content-box">${filterNotePreview(this.note.content)}</div>
        `;
        applyWidgetStyle(this);
        this.applyBookmarkStyle();
    }


    addEventListeners() {
        this.addEventListener('click', (event) => { this.handleCardClick() });
        this.addEventListener('contextmenu', (event) => {showContextMenu(event, this, optionMenuTemplate)});
        this.addEventListener('dragstart', (event) => {this.dragStart(event)}); 
        this.addEventListener('dragend', () => {this.classList.remove('dragging')});
    }

    applyBookmarkStyle() {
        if (this.note.bookmark) {
            this.classList.add('bookmarked-note')
        }
    }

    toggleBookmarkStyle() {
        this.classList.contains('bookmarked-note') ? 
        this.classList.remove('bookmarked-note') :
        this.classList.add('bookmarked-note');
        this.note.bookmark = !this.note.bookmark;
    }

    
    handleCardClick() {
        this.dispatchEvent(new CustomEvent('NoteCardClick', { detail: { note: this.note }, bubbles: true }));
    }

    dragStart(event) {
        this.classList.add('dragging')
        addDraggImage(event, 'file');
        event.dataTransfer.setData('text/plain', `{"draggedItem": "note", "draggedCardId": "${this.id}"}`)
    }

    handleDeleteClick() {
        this.dispatchEvent(new CustomEvent('DeleteNote', { detail: { note: this.note }, bubbles: true }));
    }

    handleBookmarkClick() {
        this.toggleBookmarkStyle();
        this.dispatchEvent(new CustomEvent('BookmarkNote', { detail: { noteId: this.id, bookmark: this.note.bookmark }, bubbles: true }));
    }
}





class RecentlyChangedNote extends HTMLElement {
    constructor() {
        super();
    }

    setData(value) {
        this.note = value;
        this.render();
    }

    connectedCallback() {
        this.id = this.note.id;        
        this.addEventListeners();
    }
    

    render() {        
        this.innerHTML = `
            <h4>${formatName(this.note.name)}</h4>
            <div class="note-content-box">${filterNotePreview(this.note.content)}</div>
        `;
        applyWidgetStyle(this);
    }


    addEventListeners() {
        this.querySelector('.note-content-box').addEventListener('click', this.handleCardClick.bind(this));
    }


    handleCardClick() {
        this.dispatchEvent(new CustomEvent('RecentNoteCardClick', { detail: { noteId: this.id }, bubbles: true }));
    }
}




class RecentlyViewedNote extends HTMLElement {
    constructor() {
        super();
    }

    setData(note) {
        this.id = note.id;
        this.note = note;
    }

    removeElement() {
        this.remove();
    }

    connectedCallback() {
        this.render();
        this.addEventListener('click', () => { this.handleCardClick() });
    }

    render() {
        this.innerHTML = `
        <div class="name-container">
            <div class="dot"></div>
            <span class="name">${this.note.name}</span>
        </div>
        <span class="view-date">${formatDate(this.note.last_visit)}</span>
        `        
    }

    handleCardClick() {
        this.dispatchEvent(new CustomEvent('RecentlyViewedNoteCardClick', { detail: { note: this.note }, bubbles: true }));
    }
}


customElements.define('note-card', Note);
customElements.define('recently-changed-note-card', RecentlyChangedNote);
customElements.define('recently-viewed-note-card', RecentlyViewedNote);
