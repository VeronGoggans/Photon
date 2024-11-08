import { AnimationHandler } from "../handlers/animationHandler.js";
import { removeContent } from "../util/ui.js";
import { BaseView } from "./baseView.js";
import { createCustomElement } from "../util/ui/components.js";
import { DropdownHelper } from "../helpers/dropdownHelper.js";


export class NoteView extends BaseView {
    constructor(controller, applicationController) {
        super(controller);
        this.controller = controller;
        this.applicationController = applicationController;
        this.#initElements();
        this.#eventListeners();
        this.dropdownHelper = new DropdownHelper(
            this.dropdowns, 
            this.dropdownOptions,
            this.viewElement,
            ['.note-view-options-dropdown']
        );
        AnimationHandler.fadeInFromBottom(this.viewElement)
    }

    
    renderAll(notes) { 
        if (notes.length === 0) {
            document.querySelector('#notes-block-title').style.display = 'none';
            this.notesContainer.style.display = 'none'
        }

        if (notes.length > 0) {
            document.querySelector('#notes-block-title').style.display = '';
            this.notesContainer.style.display = ''
        }
        const contentFragment = document.createDocumentFragment();

        for (let i = 0; i < notes.length; i++) {
            const noteCard = createCustomElement(notes[i], 'note-card');

            contentFragment.appendChild(noteCard);
            AnimationHandler.fadeInFromBottom(noteCard);
        }
        this.notesContainer.appendChild(contentFragment);
    }

    
    renderDelete(note) {
        const cards = this.notesContainer.children;

        for (let i = 0; i < cards.length; i++) {
            if (cards[i].id == note.id) {
                AnimationHandler.fadeOutCard(cards[i]);
            }
        }
    }


    #initElements() {
        this.createNoteButton = document.querySelector('.add-note-btn');
        this.bookmarkedButton = document.querySelector('.view-bookmarks-btn');
        this.noteViewOptionsButton = document.querySelector('.note-view-options-dropdown'); 
        this.noteViewOptions = document.querySelector('.note-view-options-dropdown ul');
        this.notesContainer = document.querySelector('.notes');
        this.viewElement = document.querySelector('.notes-view');

        this.dropdowns = [this.noteViewOptionsButton];
        this.dropdownOptions = [this.noteViewOptions];
    }

    #eventListeners() {
        this.notesContainer.addEventListener('DeleteNote', (event) => {
            const { note } = event.detail;
            this.dialog.renderDeleteModal(this.controller, note.id, note.name)
        })
        
        this.notesContainer.addEventListener('NoteCardClick', (event) => {
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

        this.noteViewOptionsButton.addEventListener('click', () => {

        });

        this.bookmarkedButton.addEventListener('click', () => {
            removeContent(this.notesContainer);
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