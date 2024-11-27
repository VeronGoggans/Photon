import { KeyEventListener } from "../eventListeners/keyEventListener.js";
import { DropdownHelper } from "../helpers/dropdownHelper.js";
import { TextBlockHandler } from "../textFormat/textBlockHandler.js";
import { AnimationHandler } from "../handlers/animationHandler.js";
import { BaseView } from "../view/baseView.js"
import { createDocumentLocation } from "../util/ui/components.js";


export class TextEditorView extends BaseView {
  constructor(controller, applicationController) {
    super(controller);
    this.controller = controller;
    this.applicationController = applicationController;
    
    this.editorContent = '';
    this.#initElements();
    this.#eventListeners();

    this.textBlockHandler = new TextBlockHandler(this.page);

    this.dropdownHelper = new DropdownHelper(
      this.dropdowns, 
      this.dropdownOptions, 
      this.viewElement, 
      ['.editor-options-dropdown', '.recently-viewed-notes-dropdown']
    );
    this.keyEventListener = new KeyEventListener(this);
    AnimationHandler.fadeInFromSide(this.viewElement)
  }

  /**
   * This method opens a note or template 
   * inside the editor.
   * 
   * @param {Object} object - could be a Note or Template object
   */
  open(object, folders, viewedNotes) {
    this.editorContent = object.content;
    this.page.innerHTML = object.content;
    this.documentNameInput.value = object.name;
    this.show(folders, viewedNotes);
    this.textBlockHandler.parse();
  }

  /**
   * Saves the content of the editor.
   */
  async save(
    closeEditor = true, 
    checkForChanges = true, 
    notify = false, 
    clearEditorObject = true
  ) {
    const name = this.documentNameInput.value || 'untitled';
    const content = this.page.innerHTML;
    await this.controller.save(name, content, notify, clearEditorObject);

    if (closeEditor) {
      this.closeEditor(checkForChanges);
      return;
    }
    this.editorContent = content;
  }


  closeEditor(checkForChanges = true) {
    if (checkForChanges && this.editorContent !== this.page.innerHTML) {
      this.dialog.renderForgotSaveModal(this);
    } 
    else {
      this.controller.loadPreviousView()
    }
  } 


  show(folders, viewedNotes) {
    this.#renderRecentlyViewedNotes(viewedNotes);
    this.documentLocation.appendChild(createDocumentLocation(folders));
    this.editor.scrollTop = 0;
    this.page.focus();
  }


  async loadInTemplate(templateId) {
    const templateContent = await this.applicationController.getTemplateById(templateId, true);
    this.page.innerHTML = this.page.innerHTML += templateContent.content;
  }


  exitNoSave() {
    this.controller.loadPreviousView();
  }

  exitBySave() {
    this.editorContent = this.page.innerHTML;
    this.save(true, false);
  }

  new() {
    this.save(false, true, false)
    this.clear();
  }

  async handleDeleteButtonClick(editorObjectId) {
    await this.controller.handleDeleteButtonClick(editorObjectId);
    this.clear();
  }

  saveFlashcard(flashcard) {
    this.controller.saveCardToModel(flashcard);
  }

  /**
   * Temporarely stores the deck name
   * 
   * @param {Object} flashcard 
   */
  saveDeckName(deckName) {
    this.controller.saveDeckName(deckName)
  }

  renderSearchModal() {
    this.dialog.renderSearchModal(this.toolbar);
  }


  #renderRecentlyViewedNotes(notes) {    
    const fragment  = document.createDocumentFragment();

    notes.forEach(note => {
      const noteCard = document.createElement('recently-viewed-note-card');

      noteCard.setData(note);
      fragment.appendChild(noteCard);
    });

    this.recentlyViewedNotesOptions.appendChild(fragment);
  }


  #getStoredEditorObject() {
    const storedEditorData = this.controller.getStoredObject();
    return storedEditorData.editorObject;
  }

  /**
   * This method removes all the content in the editor.
   */
  clear() {
    this.editorContent = '';
    this.page.innerHTML = '';
    this.documentNameInput.value = '';
    this.controller.clearStoredObject();
  }



  #initElements() {
    // toolbar top
    this.documentLocation = document.querySelector('.document-location');
    this.documentNameInput = document.querySelector('.note-name-input');
    this.exitButton = document.querySelector('#exit-editor-btn');
    this.saveButton = document.querySelector('.save-note-btn');
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
    this.documentLocation.addEventListener('FolderPathClick', async (event) => {
      this.controller.clearStoredObject();
      const { folderId } = event.detail;
      const { folder, location } = await this.applicationController.getFolderById(folderId);
      const viewId = 'notes'
      this.applicationController.initView(viewId, {
        folder: folder,
        location: location
      })
    })

    this.noteDetailsSpan.addEventListener('click', () => {this.dialog.renderNoteDetailsModal(this.#getStoredEditorObject())});
    this.deleteNoteSpan.addEventListener('click', () => {this.renderDeleteModal(this.#getStoredEditorObject().id, this.documentNameInput.value, this)});
    this.saveNoteSpan.addEventListener('click', async () => {await this.save(false, false, true, false)});
    this.newNoteSpan.addEventListener('click', () => {this.new()});
  
    this.exitButton.addEventListener('click', () => {this.closeEditor()});
    this.saveButton.addEventListener('click', async () => { await this.save(true, false)});
    this.page.addEventListener('click', () => {this.dropdownHelper.closeDropdowns()});

    this.colorButton.addEventListener('click', () => {this.dropdownHelper.toggleDropdown(this.colorDropdown)})
    this.deckButton.addEventListener('click', () => {
      // Get currently stored cards
      const { flashcards, deckName } = this.controller.getStoredDeckInfo();
      this.dialog.renderNewDeckModal(this.controller, flashcards, deckName)});  

    
  }
}