import { AnimationHandler } from "../handlers/animationHandler.js";
import { greetBasedOnTime } from "../util/date.js";
import { createCustomElement } from "../util/ui/components.js";



export class HomeView {
    constructor(controller, applicationController) {
        this.controller = controller;
        this.applicationController = applicationController;

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
        const contentFragment = document.createDocumentFragment();
        console.log(notes);
        

        for (let i = 0; i < notes.length; i++) {
            const noteCard = createCustomElement(notes[i], 'recently-changed-note-card');

            contentFragment.appendChild(noteCard);
            AnimationHandler.fadeInFromBottom(noteCard);
        }
        this._recentNoteList.appendChild(contentFragment); 
    }

    renderRandomDecks(decks) {
        const contentFragment = document.createDocumentFragment();

        for (let i = 0; i < decks.length; i++) {
            const { deck, stats } = decks[i];
            
            const deckCard = this.#flashcardDeck(deck, stats);

            contentFragment.appendChild(deckCard);
            AnimationHandler.fadeInFromBottom(deckCard);
        }
        this._flashcardDeckList.appendChild(contentFragment); 

    }


    #recentFolder(folder) {
        const recentFolderCard = document.createElement('recent-folder-card');
        recentFolderCard.setAttribute('folder', JSON.stringify(folder));
        return recentFolderCard
    }


    #flashcardDeck(deck, stats) {
        const flashcardDeck = document.createElement('flashcard-deck');
        flashcardDeck.setAttribute('deck', JSON.stringify(deck));
        flashcardDeck.setAttribute('stats', JSON.stringify(stats));
        return flashcardDeck
    }


    #eventListeners() {
        this._recentNoteList.addEventListener('RecentNoteCardClick', async (event) => {
            const { noteId } = event.detail;
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
        })
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
        this._recentNoteList = document.querySelector('.recent-notes');
        this._flashcardDeckList = document.querySelector('.flashcard-decks');
        this._viewElement = document.querySelector('.home');
    }
}