import { PlacementHelper } from "../helpers/placementHelper.js";
import { AnimationHandler } from "../handlers/animationHandler.js";

export class TextEditorEventListener {
    constructor(editorPage, editor, slashCommand) {
      this.placementHelper = new PlacementHelper();
      this.slashCommand = slashCommand;
      this.formatBar = document.querySelector('.rich-text-option-container');
      this.forwardSlashCommandContainer = document.querySelector('.foreward-slash-command-container');
      this.commandInputField = this.forwardSlashCommandContainer.querySelector('input'); 
      this.editor = editor;
      this.editorPage = editorPage;

      this.#eventListeners();
    }


    showToolbar() {
      const selection = window.getSelection();

      if (!selection.isCollapsed) {
        this.placementHelper.placeFormatBar(selection);
        AnimationHandler.fadeIn(this.formatBar);
      } else {

        AnimationHandler.fadeOut(this.formatBar);
        setTimeout(() => {
          this.removeToolbar();
        }, 150)

      }
    }


    showForwardSlashCommandContainer() {
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      
      if (selection.isCollapsed) {
        this.slashCommand.rememberRange(range);
        this.placementHelper.placeCommandBar(selection);
        AnimationHandler.fadeIn(this.forwardSlashCommandContainer);
        this.commandInputField.focus();
      } else {
        AnimationHandler.fadeOut(this.forwardSlashCommandContainer)
      }
    }


    removeToolbar() {
      this.formatBar.style.display = 'none';
      // close color dropdown
      let colorDropdown = document.querySelector('.color-dropdown ul');
      colorDropdown.style.visibility = 'hidden';
      colorDropdown.style.opacity = '0';
    }


    removeSpawnables() {
      AnimationHandler.fadeOut(this.forwardSlashCommandContainer)
      this.removeToolbar();
    }


    checkForForwardSlash(event) {
      if (event.key === '/') {
        this.showForwardSlashCommandContainer();
      }
    }


    #eventListeners() {
      this.editor.addEventListener('mouseup', () => {this.showToolbar()});
      this.editor.addEventListener('scroll', () => {this.removeSpawnables()});
      
      this.editorPage.addEventListener('mouseup',  () => {this.showToolbar()});
      this.editorPage.addEventListener('keyup', (event) => {
        this.showToolbar();
        this.checkForForwardSlash(event);
      });
      this.editorPage.addEventListener('click', () => {AnimationHandler.fadeOut(this.forwardSlashCommandContainer)});
    }
}