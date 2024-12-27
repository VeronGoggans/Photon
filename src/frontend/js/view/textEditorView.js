import { KeyEventListener } from "../eventListeners/keyEventListener.js";
import { DropdownHelper } from "../helpers/dropdownHelper.js";
import { TextBlockHandler } from "../textFormat/textBlockHandler.js";
import { AnimationHandler } from "../handlers/animationHandler.js";
import { createDocumentLocation } from "../util/ui/components.js";
import { Dialog } from "../util/dialog.js";
import { removeContent } from "../util/ui.js";
import { AutoSave } from "../components/Autosave.js";
import {
  FETCH_FOLDER_BY_ID_EVENT,
  INIT_VIEW_EVENT,
  RENDER_DELETE_MODAL_EVENT,
  RENDER_NOTE_DETAILS_MODAL_EVENT
} from "../components/eventBus.js";




export class TextEditorView {
  constructor(controller, eventBus) {
    this.controller = controller;
    this.eventBus = eventBus;

    this.#initElements();
    this.#eventListeners();

    this.textBlockHandler = new TextBlockHandler(this.page);
    this.dropdownHelper = new DropdownHelper(
      this.dropdowns, 
      this.dropdownOptions, 
      this.viewElement, 
      ['.editor-options-dropdown', '.recently-viewed-notes-dropdown']
    );


    const saveNameCallBack = async (name) => {
      await this.controller.autoSave(name, this.page.innerHTML, false, false);
    }

    const saveContentCallBack = async (content) => {
      await this.controller.autoSave(this.documentNameInput.value, content, false, false);
    }


    const deleteNoteCallBack = async (editorObjectId) => {
      await this.controller.deleteEditorObject(editorObjectId);
      this.#removeRecentlyViewedNote(editorObjectId)
      this.clearEditorContent()
    }


    new KeyEventListener(this);
    new AutoSave('.note-name-input', saveNameCallBack, false);
    new AutoSave('.editor-paper', saveContentCallBack);
    AnimationHandler.fadeInFromSide(this.viewElement)
  }



  /**
   * This method prepares the editor and loads all relevant data
   *
   * @param object              - The note or templates being loaded
   * @param objectLocation      - The location of the note within the folder structure, templates don't have a location
   * @param recentlyViewedNotes - The recently viewed notes
   */
  open(object, objectLocation, recentlyViewedNotes) {
    // loading the objects data on the editor
    this.page.innerHTML = object.content;
    this.documentNameInput.value = object.name;

    this.show(objectLocation, recentlyViewedNotes);
    this.textBlockHandler.parse();
    this.editor.scrollTo( { top: 0, behavior: 'smooth' } )
  }




  /**
   * This method will render the recently viewed notes and the notes location in the editor
   *
   * @param objectLocation       - The location of the note within the folder structure, templates don't have a location
   * @param recentlyViewedNotes  - The recently viewed notes
   */
  show(objectLocation, recentlyViewedNotes) {
    this.#renderRecentlyViewedNotes(recentlyViewedNotes);

    // Remove previous path if any
    removeContent(this.documentLocation)

    // Render the new path
    this.documentLocation.appendChild(createDocumentLocation(objectLocation));

    setTimeout(() => {
      // Focus on the document title
      this.documentNameInput.focus();
    }, 300)
    
  }



  /**
   * This method will save the currently loaded template or note.
   * Right after it'll clear the editor for new work.
   */
  newEditorObject() {
    this.clearEditorContent();
    this.controller.clearStoredObject();
  }




  renderSearchModal() {
    this.dialog.renderSearchModal(this.toolbar);
  }


  /**
   * This method will render all recently viewed note UI elements whenever the editor opens
   *
   * @param notes - The recently viewed notes to render
   */
  #renderRecentlyViewedNotes(notes) {
    // Remove previous list of recently viewed notes
    removeContent(this.recentlyViewedNotesOptions)

    const fragment  = document.createDocumentFragment();

    notes.forEach(note => {
      const noteCard = document.createElement('recently-viewed-note-card');

      noteCard.setData(note);
      fragment.appendChild(noteCard);
    });

    this.recentlyViewedNotesOptions.appendChild(fragment);
  }


  /**
   * This method removes the recently viewed UI element from the corresponding note that was deleted
   *
   * @param noteId -  The ID of the note that's been deleted
   */
  #removeRecentlyViewedNote(noteId) {
    for (let i = 0 ; this.recentlyViewedNotesOptions.children.length > i; i++) {
      if (this.recentlyViewedNotesOptions.children[i].id === noteId.toString()) {
        this.recentlyViewedNotesOptions.children[i].removeElement();
      }
    }
  }



  /**
   * This method just clears the editor for a fresh start ( make the editor blank )
   */
  clearEditorContent() {
    this.page.innerHTML = '';
    this.documentNameInput.value = '';
  }



  /**
   *
   * @param event
   */
  async #loadFolder(event) {
    // The folderId of the clicked on folder within the path
    const { folderId  } = event.detail;

    // Loading the clicked on folder in the notes tab
    const { folder, location } = await this.eventBus.emit(FETCH_FOLDER_BY_ID_EVENT, folderId);
    this.eventBus.emit(INIT_VIEW_EVENT, {
      viewId: 'notes',
      folder: folder,
      location: location
    })
  }



  /**
   *
   * @param event
   */
  async #loadRecentlyViewedNote(event) {
    // The clicked on recently viewed note
    const { note } = event.detail;

    // Load the recently viewed note into the editor
    await this.controller.loadRecentlyViewedNote(note);

  }



  /**
   *
   * @param event
   */
  async #loadLinkedNote(event) {
    // The linked note
    const { note } = event.detail;
  }



  #initElements() {
    // toolbar top
    this.documentLocation = document.querySelector('.document-location');
    this.documentNameInput = document.querySelector('.note-name-input');
    this.exitButton = document.querySelector('#exit-editor-btn');
    this.colorButton = document.querySelector('.color-dropdown button');
    this.headingSpan = document.querySelector('.heading-dropdown span');

    this.noteDetailsSpan = document.querySelector('.note-details-span');
    this.deleteNoteSpan = document.querySelector('.delete-note-span');
    this.newNoteSpan = document.querySelector('.new-note-span');

    // other
    this.viewElement = document.querySelector('.editor-wrapper');
    this.editor = document.querySelector('.editor');
    this.page = document.querySelector('.editor-paper');
    this.toolbar = document.querySelector('.toolbar')

    // dropdowns
    this.colorDropdown = document.querySelector('.color-dropdown ul');
    this.headingDropdown = document.querySelector('.heading-dropdown ul');
    this.editorDropdown = document.querySelector('.editor-options-dropdown');
    this.editorDropdownOptions = this.editorDropdown.querySelector('.options');
    this.recentlyViewedNotesDropdown = document.querySelector('.recently-viewed-notes-dropdown');
    this.recentlyViewedNotesOptions = this.recentlyViewedNotesDropdown.querySelector('.options');
    this.dropdowns = [this.editorDropdown, this.recentlyViewedNotesDropdown];
    this.dropdownOptions = [this.editorDropdownOptions, this.recentlyViewedNotesOptions];
  }


  #eventListeners() {
    /**
     *
     */
    this.documentLocation.addEventListener('FolderPathClick', async (event) => {
      await this.#loadFolder(event)
    })


    /**
     *
     */
    this.recentlyViewedNotesDropdown.addEventListener('RecentlyViewedNoteCardClick', async (event) => {
          await this.#loadRecentlyViewedNote(event);
    })


    /**
     *
     */
    this.noteDetailsSpan.addEventListener('click', () => {
      const storedNoteObject = this.controller.getStoredObject();

      // Event to tell the dialog class to render the note details modal.
      this.eventBus.emit(RENDER_NOTE_DETAILS_MODAL_EVENT, storedNoteObject)
    });


    /**
     *
     */
    this.deleteNoteSpan.addEventListener('click', () => { 
      const { id } = this.controller.getStoredObject();
      const noteName = this.documentNameInput.value;

      const deleteCallBack = async () => {
        await this.controller.deleteEditorObject();
      }

      // Event to tell the dialog class to render the delete modal.
      this.eventBus.emit(RENDER_DELETE_MODAL_EVENT, {
        'id': id,
        'name': noteName,
        'notifyUser': true
      })
    });


    /**
     *
     */
    this.newNoteSpan.addEventListener('click', () => {
      this.newEditorObject()
    });


    /**
     *
     */
    this.exitButton.addEventListener('click', () => {
      this.controller.loadPreviousView()
    });


    this.page.addEventListener('click', () => {this.dropdownHelper.closeDropdowns()});
    this.colorButton.addEventListener('click', () => {this.dropdownHelper.toggleDropdown(this.colorDropdown)});
    this.headingSpan.addEventListener('click', () => {this.dropdownHelper.toggleDropdown(this.headingDropdown)});
  }
}