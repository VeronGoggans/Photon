import { KeyEventListener } from "../../eventListeners/keyEventListener.js";
import { DropdownHelper } from "../../helpers/dropdownHelper.js";
import { TextBlockHandler } from "../../textFormat/textBlockHandler.js";
import { AnimationHandler } from "../../handlers/animationHandler.js";
import { createDocumentLocation } from "../../util/ui/components.js";
import { removeContent } from "../../util/ui.js";
import { loadFolder } from "./viewFunctions.js";
import { AutoSave } from "../../components/Autosave.js";
import {
  FETCH_FOLDER_SEARCH_ITEMS_EVENT,
  FETCH_NOTE_SEARCH_ITEMS_EVENT,
  FETCH_TEMPLATE_SEARCH_ITEMS_EVENT,
  RENDER_DELETE_MODAL_EVENT,
  RENDER_NOTE_DETAILS_MODAL_EVENT
} from "../../components/eventBus.js";
import { ReferenceItemTypes } from "../../constants/constants.js";
import { placeSearchContainer } from "../../components/dynamicElementPlacer.js";




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


    new KeyEventListener(this, this.controller);
    new AutoSave('.note-name-input', saveNameCallBack, true);
    new AutoSave('.editor-paper', saveContentCallBack, false, true);
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
   * This method will apply the specified template to the end of the page/note.
   *
   * @param template         - The template (note with is_template = True) object
   * @param template.content - The content of the template object.
   */
  applyTemplate(template) {
    this.page.innerHTML = this.page.innerHTML + template.content;
  }



  /**
   * This method will save the currently loaded template or note.
   * Right after it'll clear the editor for new work.
   */
  clearCurrentEditorObject() {
    this.clearEditorContent();
    this.controller.clearStoredObject();
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


  loadPreviousNote() {
    const previousNote = this.controller.getPreviousNote();
    this.documentNameInput.value = previousNote.name;
    this.page.innerHTML = previousNote.content;
    this.editor.scrollTo( { top: 0, behavior: 'smooth' } );
  }


  loadNextNote() {
    const nextNote = this.controller.getNextNote();

    this.documentNameInput.value = nextNote.name;
    this.page.innerHTML = nextNote.content;
    this.editor.scrollTo( { top: 0, behavior: 'smooth' } );
  }


  renderNoteDetailsModal() {
    const storedNoteObject = this.controller.getStoredObject();

    // Event to tell the dialog class to render the note details modal.
    this.eventBus.emit(RENDER_NOTE_DETAILS_MODAL_EVENT, storedNoteObject)
  }


  renderNoteDeleteModal() {
    const { id } = this.controller.getStoredObject();
    const noteName = this.documentNameInput.value;

    const deleteCallBack = async (deleteDetails) => {
      await this.controller.deleteEditorObject(deleteDetails.id);
    }

    // Event to tell the dialog class to render the delete modal.
    this.eventBus.emit(RENDER_DELETE_MODAL_EVENT, {
      'id': id,
      'name': noteName,
      'notifyUser': true,
      'callBack': deleteCallBack
    })
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
    this.loadNextNoteButton = document.querySelector('#load-next-note-btn');
    this.loadPreviousNoteButton = document.querySelector('#load-previous-note-btn');

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




    this.documentLocation.addEventListener('FolderPathClick', async (event) => {await loadFolder(event.detail.folderId, this.eventBus);})


    /**
     *
     */
    this.recentlyViewedNotesDropdown.addEventListener('RecentlyViewedNoteCardClick', async (event) => {
      const { note } = event.detail;
      await this.controller.loadRecentlyViewedNote(note);
    })

    
    /**
     * 
     */
    this.viewElement.addEventListener('ReferenceItemClick', async (event) => {
      const { id, type } = event.detail;
      await this.controller.loadReferenceItem(id, type);
    })


    this.viewElement.addEventListener('SearchBarItemClick', async (event) => {
        const { searchItem, searchType, cursorPosition } = event.detail;

        // Render a link block for ( notes/folders/boards )
        if (searchType !== ReferenceItemTypes.TEMPLATES) {
          const referenceItem = document.createElement('reference-item-card');
          referenceItem.setAttribute('reference-item', JSON.stringify({id: searchItem.id, name: searchItem.name, type: searchType}));
          cursorPosition.insertNode(referenceItem);
        }

        // Load in the template
        else await this.controller.loadReferenceItem(searchItem.id, searchType);

    })


  

    this.viewElement.addEventListener('AddReferenceContainer', async (event) => {
      const { component, referenceType, cursorPosition } = event.detail;
      let referenceItems;
      
      switch (referenceType) {
        case ReferenceItemTypes.NOTES:
          referenceItems = await this.eventBus.asyncEmit(FETCH_NOTE_SEARCH_ITEMS_EVENT);
          break;
        case ReferenceItemTypes.TEMPLATES:
          referenceItems = await this.eventBus.asyncEmit(FETCH_TEMPLATE_SEARCH_ITEMS_EVENT);
          break;
        case ReferenceItemTypes.FOLDERS:
          referenceItems = await this.eventBus.asyncEmit(FETCH_FOLDER_SEARCH_ITEMS_EVENT);
          break;
        case ReferenceItemTypes.BOARDS:
          referenceItems = await this.eventBus.asyncEmit(FETCH_BOARD_SEARCH_ITEMS_EVENT); 
          break;
        default:
          break;
        }

        placeSearchContainer(component);

        component.setCursorPosition(cursorPosition);
        // Fill the searchbar with the fetched reference items
        component.insertItems(referenceType, referenceItems);        
    });

    /**
     * THis event listener will listen for the Enter keypress on the document name input.
     * When this event listener is triggered the cursor will be put to the documents content section
     * (e.g. A4 paper right under the name)
     */
    this.documentNameInput.addEventListener('keypress', (event) => {if (event.key === 'Enter') this.page.focus();})
    this.loadNextNoteButton.addEventListener('click', () => {this.loadNextNote()})
    this.loadPreviousNoteButton.addEventListener('click', () => {this.loadPreviousNote()})
    this.noteDetailsSpan.addEventListener('click', () => {this.renderNoteDetailsModal()});
    this.deleteNoteSpan.addEventListener('click', () => {this.renderNoteDeleteModal()});
    this.newNoteSpan.addEventListener('click', () => {this.clearCurrentEditorObject()});
    this.exitButton.addEventListener('click', () => {this.controller.loadPreviousView()});
    this.page.addEventListener('click', () => {this.dropdownHelper.closeDropdowns()});
    this.colorButton.addEventListener('click', () => {this.dropdownHelper.toggleDropdown(this.colorDropdown)});
    this.headingSpan.addEventListener('click', () => {this.dropdownHelper.toggleDropdown(this.headingDropdown)});
  }
}