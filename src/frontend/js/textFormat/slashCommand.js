import { commands } from "../constants/constants.js";
import { AnimationHandler } from "../handlers/animation/animationHandler.js";
 
export class SlashCommand {
    constructor(view, formatter) {
        this.view = view;
        this.formatter = formatter;
        this.commandContainer = document.querySelector('.foreward-slash-command-container');
        this.commands = this.commandContainer.querySelector('.commands');
        this.input = this.commandContainer.querySelector('input');
        this.#eventListeners();
        this.storedRange = null;
    }

  
    executeSlashCommand(range, targetClass, extension = null) {
      switch (targetClass) {
        case 'link-option':
          this.formatter.addLink(range);
          break;
        case 'embed-video-option':
          this.formatter.addEmbedVideo(range);
          break;
        case 'horizontal-line-option':
          this.formatter.addHorizontalLine(range, extension);
          break;
        case 'unordered-list':
          this.formatter.addList(range, 'ul');
          break;
        case 'ordered-list':
          this.formatter.addList(range, 'ol');
          break;
        case 'heading-1':
          this.formatter.addHeading(range, 1, extension);
          break;
        case 'heading-2':
          this.formatter.addHeading(range, 2, extension);
          break;
        case 'heading-3':
          this.formatter.addHeading(range, 3, extension);
          break;
        case 'heading-4':
          this.formatter.addHeading(range, 4, extension);
          break;
        case 'insert-html':
          this.formatter.addHtml(range);
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