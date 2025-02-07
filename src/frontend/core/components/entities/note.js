import { formatName, filterNotePreview } from "../../util/formatters.js";
import { addDragImage, removeDragImage, showContextMenu, applyWidgetStyle } from "../../util/ui.js";
import { formatDate } from "../../util/date.js";
import { checkAutoScroll, stopScrolling } from "../draggable.js";
import {CssAnimationClasses, CssAnimationDurations} from "../../constants/constants.js";
import {AnimationHandler} from "../../handlers/animationHandler.js";


const optionMenuTemplate = `
    <div id="bookmark-note-btn" >
        <i class="bi bi-bookmark"></i>
        <span>Bookmark note</span>
    </div>
    <div id="export-note-btn" >
        <i class="bi bi-file-earmark-arrow-down"></i>
        <span>Export note</span>
    </div>
    <div id="delete-note-btn">
        <i class="bi bi-trash3"></i>
        <span>Delete note</span>
    </div>
    <div id="apply-category-note-btn" >
        <i class="bi bi-archive"></i>
        <span>Apply category</span>
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
            <i id="bookmark-icon" class="bi bi-bookmark"></i>
        `;
        this.bookmarkPatch = this.querySelector('#bookmark-icon');

        applyWidgetStyle(this);

        if (this.note.bookmark) {
            this.addBookmarkIcon();
        }
    }


    removeBookmarkIcon() {
        AnimationHandler.fadeOutBookmarkPatch(this.bookmarkPatch)
    }


    /**
     * This method will add a bookmark patch to a bookmarked note.
     *
     * @param initialRender - indicator to let the function know if it needs to apply the bouncing effect or not
     *                      - The bouncing effect will only happen if a bookmark is applied to the note.
     */
    addBookmarkIcon(initialRender = true) {
        if (initialRender) {
            this.bookmarkPatch.style.display = 'flex';
        }

        else {
            this.bookmarkPatch.classList.add(CssAnimationClasses.BOUNCING_ANIMATION);
            this.bookmarkPatch.style.display = 'flex';

            setTimeout(() => {
                this.bookmarkPatch.classList.remove(CssAnimationClasses.BOUNCING_ANIMATION);
            }, CssAnimationDurations.BOUNCING_ANIMATION);
        }
    }


    toggleBookmarkStyle() {
        this.note.bookmark ?
            this.removeBookmarkIcon() :
            this.addBookmarkIcon(false);
        this.note.bookmark = !this.note.bookmark;
    }


    addEventListeners() {
        this.addEventListener('click', () => { this.handleCardClick() });
        this.addEventListener('contextmenu', (event) => { showContextMenu(event, this, optionMenuTemplate, 'note-card') });

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
        this.addEventListener('click', this.handleCardClick.bind(this));
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
