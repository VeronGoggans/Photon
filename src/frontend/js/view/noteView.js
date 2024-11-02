import { AnimationHandler } from "../handlers/animation/animationHandler.js";
import { removeContent, addEmptyMessage } from "../util/ui.js";
import { BaseView } from "./baseView.js";
import { NotificationHandler } from "../handlers/userFeedback/notificationHandler.js";
import { createCustomElement } from "../util/ui/components.js";


export class NoteView extends BaseView {
    constructor(controller, applicationController) {
        super(controller);
        this.controller = controller;
        this.applicationController = applicationController;
        
        this.#initElements();
        this.#eventListeners();

        AnimationHandler.fadeInFromBottom(this._viewElement)
    }

    
    renderAll(notes) { 
        if (notes.length === 0) {
            document.querySelector('#notes-block-title').style.display = 'none';
            this._content.style.display = 'none'
        }

        if (notes.length > 0) {
            document.querySelector('#notes-block-title').style.display = '';
            this._content.style.display = ''
        }
        const contentFragment = document.createDocumentFragment();

        for (let i = 0; i < notes.length; i++) {
            const noteCard = createCustomElement(notes[i], 'note-card');

            contentFragment.appendChild(noteCard);
            AnimationHandler.fadeInFromBottom(noteCard);
        }
        this._content.appendChild(contentFragment);
    }

    
    renderDelete(note) {
        const cards = this._content.children;

        for (let i = 0; i < cards.length; i++) {
            if (cards[i].id == note.id) {
                AnimationHandler.fadeOutCard(cards[i]);
            }
        }
    }


    #initElements() {
        this.createNoteButton = document.querySelector('.create-note-btn')
        this.bookmarkedButton = document.querySelector('.bookmarks-btn')
        this._content = document.querySelector('.notes');
        this._viewElement = document.querySelector('.notes-view');
    }

    #eventListeners() {
        this._content.addEventListener('DeleteNote', (event) => {
            const { note } = event.detail;
            this.dialog.renderDeleteModal(this.controller, note.id, note.name)
        })
        
        this._content.addEventListener('NoteCardClick', (event) => {
            const { note } = event.detail;
            this.applicationController.initView('editor', 
                {
                    editorObjectType: 'note', 
                    editorObject: note,
                    newEditorObject: false, 
                    previousView: 'notes', 
                    editorObjectLocation: null
                }
            );
        })

        this.bookmarkedButton.addEventListener('click', () => {
            removeContent(this._content);
            const allBookmarks = -1
            this.controller.get(allBookmarks)
        });

        this.createNoteButton.addEventListener('click', () => {
            this.applicationController.initView('editor', {
                editorObjectType: 'note', 
                editorObject: null,
                newEditorObject: true, 
                previousView: 'notes', 
                editorObjectLocation: null
            })
        })
    }
}