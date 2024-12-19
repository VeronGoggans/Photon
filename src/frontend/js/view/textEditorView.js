import { KeyEventListener } from "../eventListeners/keyEventListener.js";
import { DropdownHelper } from "../helpers/dropdownHelper.js";
import { TextBlockHandler } from "../textFormat/textBlockHandler.js";
import { AnimationHandler } from "../handlers/animationHandler.js";
import { createDocumentLocation } from "../util/ui/components.js";
import { Dialog } from "../util/dialog.js";
import { removeContent } from "../util/ui.js";


export class TextEditorView {
  constructor(controller, applicationController) {
    this.controller = controller;
    this.applicationController = applicationController;
    
    this.#initElements();
    this.#eventListeners();

    this.textBlockHandler = new TextBlockHandler(this.page);
    this.dialog = new Dialog();
    this.dropdownHelper = new DropdownHelper(
      this.dropdowns, 
      this.dropdownOptions, 
      this.viewElement, 
      ['.editor-options-dropdown', '.recently-viewed-notes-dropdown']
    );
    new KeyEventListener(this);
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
   * This method saves the currently worked on editor object ( note or template )
   *
   * @param closeEditor        - Indicating if the editor should close
   * @param notify             - Indicating if the user should be notified of their save action
   * @param clearEditorObject  - Indicating if the currently loaded editor object should be cleared from memory
   */
  async saveEditorObject(closeEditor = true, notify = false, clearEditorObject = true) {
    // Blank notes will not be saved
    if (this.page.innerHTML === '' && this.page.textContent === '') {
      this.controller.loadPreviousView()
      return;
    }

    // Save the note progress ( e.g. update or add )
    await this.#saveEditorObjectProgress(notify, clearEditorObject);

    if (closeEditor) {
      this.controller.loadPreviousView();
    }

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
    this.saveEditorObject(false, true, true)
        .then(r=> {
          // Clear the editor content ( make everything blank )
          this.clearEditorContent();
        })
  }



  /**
   * This method will handle the deletion logic of editor objects
   * If the editor object is a note, the corresponding recently viewed note UI element will also be removed
   *
   * @param editorObjectId - The ID of the editor object that has been deleted
   */
  async handleDeleteButtonClick(editorObjectId) {
    this.controller.handleDeleteButtonClick(editorObjectId);
    const { editorObjectType } = this.controller.getStoredObject()

    // As there can only be notes in the recently viewed notes dropdown
    // And to overcome ID conflicts ( a template and note can have the same id )
    // All they are, are incrementing strings per Entity
    if (editorObjectType === 'note') {
      this.#removeRecentlyViewedNote(editorObjectId)
    }

    this.clearEditorContent()
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



  #getStoredEditorObject() {
    const { editorObject } = this.controller.getStoredObject()
    return editorObject
  }



  /**
   * This method just clears the editor for a fresh start ( make the editor blank )
   */
  clearEditorContent() {
    this.page.innerHTML = '';
    this.documentNameInput.value = '';
  }





  // ___________________________________________________________________________ //

  /**
   *
   *
   * @param notify
   * @param clearEditorObject
   */
  async #saveEditorObjectProgress(notify = false, clearEditorObject = true) {
    const { editorObject } = this.controller.getStoredObject()

    // Get the name and content of the current editor object
    const name = this.documentNameInput.value || 'untitled';
    const content = this.page.innerHTML;

    if (content === '') {
      return
    }

    // Save the current note if changes have been made
    if (editorObject === null || editorObject.content !== content) {
      await this.controller.save(name, content, notify, clearEditorObject);
    }
  }



  /**
   *
   * @param event
   */
  async #loadFolder(event) {
    // The folderId of the clicked on folder within the path
    const { folderId  } = event.detail;

    // Save the current note if changes have been made
    await this.#saveEditorObjectProgress(true, true);

    // Loading the clicked on folder in the notes tab
    const { folder, location } = await this.applicationController.getFolderById(folderId);
    const viewId = 'notes'
    this.applicationController.initView(viewId, {
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

    // Save the current note progression
    this.#saveEditorObjectProgress(true, true);

    // Load the recently viewed note into the editor
    this.controller.loadRecentlyViewedNote(note, 'note');

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
    this.deckButton = document.querySelector('#editor-flashcard-set-btn');
    this.colorButton = document.querySelector('.color-dropdown button');

    this.noteDetailsSpan = document.querySelector('.note-details-span');
    this.deleteNoteSpan = document.querySelector('.delete-note-span');
    this.saveNoteSpan = document.querySelector('.save-note-span');
    this.newNoteSpan = document.querySelector('.new-note-span');

    // other
    this.viewElement = document.querySelector('.editor-wrapper');
    this.editor = document.querySelector('.editor');
    this.page = document.querySelector('.editor-paper');
    this.toolbar = document.querySelector('.toolbar')

    // dropdowns
    this.colorDropdown = document.querySelector('.color-dropdown ul');
    this.editorDropdown = document.querySelector('.editor-options-dropdown');
    this.editorDropdownOptions = this.editorDropdown.querySelector('.options');
    this.recentlyViewedNotesDropdown = document.querySelector('.recently-viewed-notes-dropdown');
    this.recentlyViewedNotesOptions = this.recentlyViewedNotesDropdown.querySelector('.options');
    this.dropdowns = [this.editorDropdown, this.recentlyViewedNotesDropdown];
    this.dropdownOptions = [this.editorDropdownOptions, this.recentlyViewedNotesOptions];
  }


  #eventListeners() {



    // _________________________ Custom event listeners _________________________________ //
    this.documentLocation.addEventListener(
        'FolderPathClick',
        async (event) => { this.#loadFolder(event)})


    this.recentlyViewedNotesDropdown.addEventListener(
        'RecentlyViewedNoteCardClick',
        async (event) => { this.#loadRecentlyViewedNote(event) })




    // _____________________________ Event listeners ____________________________________ //
    this.noteDetailsSpan.addEventListener('click', () => { this.dialog.renderNoteDetailsModal(this.#getStoredEditorObject()) });
    this.deleteNoteSpan.addEventListener('click', () => { 
      const { id } = this.#getStoredEditorObject();
      const noteName = this.documentNameInput.value;
      this.dialog.renderDeleteModal(this, id, noteName, true);
    });
    this.saveNoteSpan.addEventListener('click', async () => {await this.saveEditorObject(false, false, true, false)});
    this.newNoteSpan.addEventListener('click', () => {this.newEditorObject()});
  
    this.exitButton.addEventListener('click', async () => { await this.saveEditorObject() });


    this.page.addEventListener('click', () => {this.dropdownHelper.closeDropdowns()});
    this.colorButton.addEventListener('click', () => {this.dropdownHelper.toggleDropdown(this.colorDropdown)})
    this.deckButton.addEventListener('click', () => {
      // Get currently stored cards
      const { flashcards, deckName } = this.controller.getStoredDeckInfo();
      this.dialog.renderNewDeckModal(this.controller, flashcards, deckName)});  

    
  }
}