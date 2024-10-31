import { RecentNote } from "../components/entities/note.js";
import { NoteObjectArray } from "../util/array.js";
import { AnimationHandler } from "../handlers/animation/animationHandler.js";
import { greetBasedOnTime } from "../util/date.js";
import { BaseView } from "./baseView.js";

export class HomeView extends BaseView {
    constructor(controller, applicationController) {
        super();
        this.controller = controller;
        this.applicationController = applicationController;

        this.noteObjects = new NoteObjectArray();
        this.#initElements();
        this.#eventListeners();

        AnimationHandler.fadeInFromBottom(this._viewElement)
    }

    renderRecentFolders(folders) {
        const contentFragment = document.createDocumentFragment();

        for (let i = 0; i < folders.length; i++) {
            const folderCard = this.#recentFolder(folders[i]);

            contentFragment.appendChild(folderCard);
            AnimationHandler.fadeInFromBottom(folderCard);
        }
        this._recentFolderList.appendChild(contentFragment); 
    }


    renderRecentNotes(notes) {
        this.noteObjects.clear()
        const contentFragment = document.createDocumentFragment();

        for (let i = 0; i < notes.length; i++) {
            const noteCard = this.#recentNote(notes[i]);

            contentFragment.appendChild(noteCard);
            AnimationHandler.fadeInFromBottom(noteCard);
        }
        this.recentNoteContainer.appendChild(contentFragment); 
    }

    renderRandomDecks(decks) {
        const contentFragment = document.createDocumentFragment();

        for (let i = 0; i < decks.length; i++) {
            const { deck, stats } = decks[i];
            console.log(stats);
            
            const deckCard = this.#flashcardDeck(deck, stats);

            contentFragment.appendChild(deckCard);
            AnimationHandler.fadeInFromBottom(deckCard);
        }
        this._flashcardDeckList.appendChild(contentFragment); 

    }

    async handleNoteCardClick(noteId) {
        const { note, location } = await this.applicationController.getNoteById(noteId)
        this.applicationController.initView('editor', 
            {
                editorObjectType: 'note', 
                editorObject: note,
                newEditorObject: false, 
                previousView: 'home',
                editorObjectLocation: location 
            }
        );
    }


    #recentFolder(folder) {
        const recentFolderCard = document.createElement('recent-folder-card');
        recentFolderCard.setAttribute('folder', JSON.stringify(folder));
        return recentFolderCard
    }


    #recentNote(note) {
        this.noteObjects.add(note)
        return new RecentNote(note, this);
    }


    #flashcardDeck(deck, stats) {
        const flashcardDeck = document.createElement('flashcard-deck');
        flashcardDeck.setAttribute('deck', JSON.stringify(deck));
        flashcardDeck.setAttribute('stats', JSON.stringify(stats));
        return flashcardDeck
    }


    #eventListeners() {
        this._recentFolderList.addEventListener('RecentFolderCardClick', async (event) => {
            const { folderId } = event.detail;            
            const { folder, location } = await this.applicationController.getFolderById(folderId);            
            this.applicationController.initView('notes', {
                folder: folder,
                location: location
            })
        })  
        
        this._flashcardDeckList.addEventListener('PracticeDeck', async (event) => {
            const { deck } = event.detail;
            const flashcards = await this.applicationController.getFlashcards(deck.id) 
            this.applicationController.initView('flashcardsPractice', {
                deck: deck,
                flashcards: flashcards, 
                previousView: 'home'
            })
        })
    }

    #initElements() {
        document.querySelector('.view-title').textContent = greetBasedOnTime();
        this._recentFolderList = document.querySelector('.recent-folders');
        this.recentNoteContainer = document.querySelector('.recent-notes');
        this._flashcardDeckList = document.querySelector('.flashcard-decks');
        this._viewElement = document.querySelector('.home');
    }
}