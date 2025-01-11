import { formatName, filterNotePreview } from "../../util/formatters.js";
import { addDragImage, removeDragImage, showContextMenu, applyWidgetStyle } from "../../util/ui.js";
import { formatDate } from "../../util/date.js";
import { checkAutoScroll, stopScrolling } from "../draggable.js";


const optionMenuTemplate = `
    <div id="bookmark-note-btn" >
        <i class="bi bi-bookmark"></i>
        <span>Bookmark note</span>
    </div>
    <div id="apply-category-note-btn" >
        <i class="bi bi-archive"></i>
        <span>Apply category</span>
    </div>
    <div id="delete-note-btn">
        <i class="bi bi-file-earmark-x"></i>
        <span>Delete note</span>
    </div>
`


class Note extends HTMLElement {
    constructor() {
        super();
        this.scrollableParent = document.querySelector('.note-view-content')
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
        this.addEventListener('click', () => { this.handleCardClick() });
        this.addEventListener('contextmenu', (event) => {
            showContextMenu(event, this, optionMenuTemplate, 'note-card')
        });

        this.addEventListener('dragstart', (event) => {
            this.classList.add('dragging')
            addDragImage(event, 'note');

            const dragDataStruct = {
                draggedEntityName: 'note',
                draggedEntityId: this.id,
            }

            event.dataTransfer.setData('text/plain', JSON.stringify(dragDataStruct));
        });

        this.addEventListener('drag', (event) => {
            checkAutoScroll(this.scrollableParent, event.clientX, event.clientY);
        });

        this.addEventListener('dragend', () => {
            this.classList.remove('dragging');
            removeDragImage();
            stopScrolling();
        });
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
