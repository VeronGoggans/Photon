import { commands } from "../constants/constants.js";
import { AnimationHandler } from "../handlers/animationHandler.js";
import { addCodeBlock, addHorizontalLine, addHeading, addList, addChecklist, addLink, addEmbedVideo, addHtml } from "./textFormatter.js";
  

export class SlashCommand {
    constructor(view) {
        this.view = view;
        this.commandContainer = document.querySelector('.foreward-slash-command-container');
        this.commands = this.commandContainer.querySelector('.commands');
        this.input = this.commandContainer.querySelector('input');
        this.#eventListeners();
        this.storedRange = null;
    }

  
    executeSlashCommand(range, targetClass, extension = null) {
      switch (targetClass) {
        case 'link-option':
          addLink(range);
          break;
        case 'embed-video-option':
          addEmbedVideo(range);
          break;
        case 'horizontal-line-option':
          addHorizontalLine(range, extension);
          break;
        case 'unordered-list':
          addList(range, 'ul');
          break;
        case 'ordered-list':
          addList(range, 'ol');
          break;
        case 'check-list':
          addChecklist(range);
          break;
        case 'heading-1':
          addHeading(range, 1, extension);
          break;
        case 'heading-2':
          addHeading(range, 2, extension);
          break;
        case 'heading-3':
          addHeading(range, 3, extension);
          break;
        case 'heading-4':
          addHeading(range, 4, extension);
          break;
        case 'code-snippit':
          addCodeBlock(range, '', extension);
          break;
        case 'insert-html':
          addHtml(range);
          break;
        case 'template':
          break;
        default:
          console.log('No matching function for:', targetClass);
      }
      this.input.value = '';
    }


    /**
     * This method handles a command when the user 
     * clicks on one of them.
     */
    #listenForCommmandClicks() {
      this.commands.addEventListener('click', (event) => {
        const targetClass = event.target.closest('div').classList[0];

        AnimationHandler.fadeOut(this.commandContainer)
        this.executeSlashCommand(this.storedRange, targetClass);
      });
    }


    #updateCommandSuggestions(event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        const userInput = this.input.value;

        const extension = this.#checkForCommandExtension(userInput);
        const command = this.#getCommand(userInput);

        const targetClass = commands[command];
        AnimationHandler.fadeOut(this.commandContainer);
        this.#deleteForwardSlash(this.storedRange)
        this.executeSlashCommand(this.storedRange, targetClass, extension);
      }
      if (event.key === 'Backspace' && this.input.value === '') {
        event.preventDefault();
        AnimationHandler.fadeOut(this.commandContainer);
        this.#deleteForwardSlash(this.storedRange)
      }
      
    }

    /**
     * This method is used to see if the user is using a #,
     * to specify a command extension
     * @param {String} userInput 
     * @returns 
     */
    #checkForCommandExtension(userInput) {
      if (userInput.includes('#')) {
        // return the extension found
        const inputParts = userInput.split('#');
        return inputParts[inputParts.length - 1]
      }
      return null
    }

    #getCommand(userInput) {
      if (userInput.includes('#')) {
        const inputParts = userInput.split('#');
        return inputParts[0];
      }
      return userInput
    }

    #deleteForwardSlash(range) {
      const caretNode = range.startContainer;
      const caretOffset = range.startOffset;

      // Check if caretNode is a text node and there is a character before the caret
      if (caretNode.nodeType === Node.TEXT_NODE && caretOffset > 0) {
        const textContent = caretNode.textContent;

        // Check if the character before the caret is a forward slash
        if (textContent[caretOffset - 1] === '/') {
          
          // Replace the forward slash with a space
          caretNode.textContent = textContent.slice(0, caretOffset - 1) + ' ' + textContent.slice(caretOffset);

          // Move the caret position after the space
          range.setStart(caretNode, caretOffset);
          range.setEnd(caretNode, caretOffset);
        }
      }
    }

    #eventListeners() {
      this.#listenForCommmandClicks();
      this.input.addEventListener('keydown', (event) => {this.#updateCommandSuggestions(event)});
    }

    rememberRange(range) {
      this.storedRange = range;
    }
}