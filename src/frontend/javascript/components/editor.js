import {AnimationHandler} from "../handlers/animationHandler.js";
import {
    addChecklist,
    addColor,
    addEmbedVideo,
    addHeading,
    addHorizontalLine,
    addHtml,
    addLink,
    addList,
    addTerminal
} from "../textFormat/textFormatter.js";
import {PlacementHelper} from "../helpers/placementHelper.js";
import {ReferenceItemTypes, SlashCommands} from "../constants/constants.js";
import {placeSlashCommandContainer} from "./dynamicElementPlacer.js";


class SlashCommandContainer extends HTMLElement {
    constructor() {
        super();
        this.selectedIndex = -1;
        this.range = null;
        this.placementHelper = new PlacementHelper();
        this.editor = document.querySelector('.editor');
        this.editorPaper = document.querySelector('.editor-paper');
    }


    connectedCallback() {
        this.render();
        this.addEventListeners();
    }


    render() {
        this.innerHTML = `
        <input type="text" placeholder="Enter a command" spellcheck="false">
        <div class="commands">
            <div class="link-option" data-command="${SlashCommands.URL}"><i class="bi bi-link-45deg"></i>Add url</div>
            <div class="embed-video-option" data-command="${SlashCommands.VIDEO}"><i class="bi bi-play-fill"></i>Add video</div>
            <div class="horizontal-line-option" data-command="${SlashCommands.DIVIDER}"><i class="bi bi-hr"></i>Add horizontal line</div>
            <div class="unordered-list" data-command="${SlashCommands.UL}"><i class="bi bi-list-ul"></i>Add bullet list</div>
            <div class="ordered-list" data-command="${SlashCommands.OL}"><i class="bi bi-list-ol"></i>Add numbered list</div>
            <div class="check-list" data-command="${SlashCommands.TODO}"><i class="bi bi-check-square"></i>Add to do list</div> 
            <div class="heading-1" data-command="${SlashCommands.H1}"><i class="bi bi-type-h1"></i>Add heading 1</div>
            <div class="heading-2" data-command="${SlashCommands.H2}"><i class="bi bi-type-h2"></i>Add heading 2</div>
            <div class="heading-3" data-command="${SlashCommands.H3}"><i class="bi bi-type-h3"></i>Add heading 3</div>
            <div class="heading-4" data-command="${SlashCommands.H4}"><i class="bi bi-type-h4"></i>Add heading 4</div>
            <div class="terminal" data-command="${SlashCommands.TERMINAL}"><i class="bi bi-terminal"></i>Add terminal command</div>
            <div class="note-reference" data-command="${SlashCommands.LINK_TO_NOTE}"><i class="bi bi-file-earmark"></i>Add note reference</div>
            <div class="folder-reference" data-command="${SlashCommands.LINK_TO_FOLDER}"><i class="bi bi-folder-symlink"></i>Add folder reference</div>
            <div class="sticky-board-reference" data-command="${SlashCommands.LINK_TO_BOARD}"><i class="bi bi-stickies"></i>Add board reference</div>
            <div class="template" data-command="${SlashCommands.TEMPLATE}"><i class="bi bi-file-earmark-text"></i>Add template</div>
            <div class="insert-html" data-command="${SlashCommands.HTML}"><i class="bi bi-filetype-html"></i>Insert HTML</div>
        </div>
        `
        this.container = this.querySelector('.commands');
        this.commands = this.container.querySelectorAll('div');
        this.input = this.querySelector('input');
        this.input.focus();
    }


    addEventListeners() {
        this.listenForCommandClicks();
        this.querySelector('input').addEventListener('keydown', (event) => { this.handleKeyEvents(event) });
        this.editorPaper.addEventListener('click', () => { AnimationHandler.fadeOut(this); });
        this.editor.addEventListener('scroll', () => { AnimationHandler.fadeOut(this); });
        this.editorPaper.addEventListener('keyup', (event) => { this.checkForForwardSlash(event) });
    }


    executeSlashCommand(command, extension = null) {
        switch (command) {
          case SlashCommands.URL:
            addLink(this.range);
            break;
          case SlashCommands.VIDEO:
            addEmbedVideo(this.range);
            break;
          case SlashCommands.DIVIDER:
            addHorizontalLine(this.range, extension);
            break;
          case SlashCommands.UL:
            addList(this.range, 'ul');
            break;
          case SlashCommands.OL:
            addList(this.range, 'ol');
            break;
          case SlashCommands.TODO:
            addChecklist(this.range);
            break;
          case SlashCommands.H1:
            addHeading(this.range, 1, extension);
            break;
          case SlashCommands.H2:
            addHeading(this.range, 2, extension);
            break;
          case SlashCommands.H3:
            addHeading(this.range, 3, extension);
            break;
          case SlashCommands.H4:
            addHeading(this.range, 4, extension);
            break;
          case SlashCommands.TERMINAL:
            addTerminal(this.range);
            break;
          case SlashCommands.HTML:
            addHtml(this.range);
            break;
          case SlashCommands.LINK_TO_NOTE:
            this.addReferenceContainer(ReferenceItemTypes.NOTES);
            break;
          case SlashCommands.LINK_TO_FOLDER:
            this.addReferenceContainer(ReferenceItemTypes.FOLDERS);
            break;
          case SlashCommands.LINK_TO_BOARD:
            this.addReferenceContainer(ReferenceItemTypes.BOARDS);
            break;
          case SlashCommands.TEMPLATE:
            this.addReferenceContainer(ReferenceItemTypes.TEMPLATES);
            break;
          default:
            console.log('No matching function for:', command);
        }
    }


    addReferenceContainer(referenceType) {
        const referenceContainer = document.createElement('reference-autocomplete-searchbar');

        this.dispatchEvent(new CustomEvent(
            'AddReferenceContainer', { 
                detail: { 
                    component: referenceContainer, 
                    referenceType: referenceType,
                    cursorPosition: this.range
                }, 
                bubbles: true 
            }
        ));
    }


    listenForCommandClicks() {
        this.commands.forEach(command => {
          command.addEventListener('click', () => {
              this.deleteForwardSlash();
              this.executeSlashCommand(command.getAttribute('data-command'));
              AnimationHandler.fadeOut(this);
          });
        })
    }
  

    getCommand() {
        const userInput = this.input.value;

        if (userInput.includes('#')) {
            const commandParts = userInput.split('#'); 
            return {
                command: commandParts[0],
                extention: commandParts[1]
            }
        }
        return {
            command: userInput,
            extention: null
        }
    }

  
    deleteForwardSlash() {
        const caretNode = this.range.startContainer;
        const caretOffset = this.range.startOffset;

        // Check if caretNode is a text node and there is a character before the caret
        if (caretNode.nodeType === Node.TEXT_NODE && caretOffset > 0) {
            const textContent = caretNode.textContent;

            // Check if the character before the caret is a forward slash
            if (textContent[caretOffset - 1] === '/') {
                // Replace the forward slash with a space
                caretNode.textContent = textContent.slice(0, caretOffset - 1) + ' ' + textContent.slice(caretOffset);

                // Update the range to reflect the new caret position (just after the space)
                this.range.setStart(caretNode, caretOffset - 1);  // Start position after the space
                this.range.setEnd(caretNode, caretOffset - 1);    // End position at the same point

                // Apply the new range
                const selection = window.getSelection();
                selection.removeAllRanges(); // Remove any previous selection
                selection.addRange(this.range); // Add the updated range to the selection
            }
        }
    }


    updateActiveOption() {
        const selectedCommand = this.commands[this.selectedIndex];
        // Remove 'active' class from all options
        this.commands.forEach(command => {
            command.classList.remove('active');
        });

        // Apply active class to selected option
        selectedCommand.classList.add('active');

        // Scroll selected options into view
        selectedCommand.scrollIntoView({
            behavior: 'smooth', 
            block: 'nearest'  
        });

        // Update the input placeholder
        this.input.placeholder = selectedCommand.textContent;
    }


    handleKeyEvents(event) {
        
        if (event.key === 'ArrowDown') {
            this.selectedIndex = (this.selectedIndex + 1) % this.commands.length;
            this.updateActiveOption();
            event.preventDefault();
        } 
        
        else if (event.key === 'ArrowUp') {
            this.selectedIndex = (this.selectedIndex - 1 + this.commands.length) % this.commands.length; 
            this.updateActiveOption();
            event.preventDefault();
        }
        
        else if (event.key === 'Enter' && this.selectedIndex !== -1) {
            const selectedCommand = this.commands[this.selectedIndex];
            const command = selectedCommand.getAttribute('data-command');

            this.deleteForwardSlash();
            this.executeSlashCommand(command);
            AnimationHandler.fadeOut(this);
        }

        else if (event.key === 'Enter') {
            event.preventDefault();

            const { command, extension } = this.getCommand();
            this.deleteForwardSlash();
            this.executeSlashCommand(command, extension);
            AnimationHandler.fadeOut(this);
        }

        else if (event.key === 'Backspace' && this.input.value === '') {
            event.preventDefault();

            this.deleteForwardSlash();
            AnimationHandler.fadeOut(this);
        }
    }


    showSlashCommands() {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        
        if (selection.isCollapsed) {
            this.range = range;
            placeSlashCommandContainer(selection);
        }
        else {
            AnimationHandler.fadeOut(this);
        }
    }



    checkForForwardSlash(event) {
        if (event.key === '/') this.showSlashCommands();
    }
}































class RichTextBar extends HTMLElement {
    constructor() {
        super();
        this.placementHelper = new PlacementHelper();
        this.editor = document.querySelector('.editor');
        this.editorPaper = document.querySelector('.editor-paper');
    }

    connectedCallback() {
        this.render();
        this.addEventListeners();
    }


    render() {
        this.innerHTML = `
        <div class="btn-group">
            <div class="heading-dropdown">
                <span>Paragraph <i class="bi bi-chevron-down"></i></span>
                <ul>
                    <li data-rich-text-option="paragraph">Paragraph</li>
                    <li data-rich-text-option="h1">Heading 1</li>
                    <li data-rich-text-option="h2">Heading 2</li>
                    <li data-rich-text-option="h3">Heading 3</li>
                    <li data-rich-text-option="h4">Heading 4</li>
                </ul>
            </div>
        </div>
        <div class="btn-group">
            <button data-rich-text-option="bold"><i class="bi bi-type-bold"></i></button>
            <button data-rich-text-option="italic"><i class="bi bi-type-italic"></i></button>
            <button data-rich-text-option="underline"><i class="bi bi-type-underline"></i></button>
            <button data-rich-text-option="strikethrough"><i class="bi bi-type-strikethrough"></i></button>
            <button data-rich-text-option="createLink"><i class="bi bi-link-45deg"></i></button>
        </div>
        <div class="btn-group">
            <button data-rich-text-option="justifyLeft"><i class="bi bi-text-left"></i></button>
            <button data-rich-text-option="justifyCenter"><i class="bi bi-text-center"></i></button>
            <button data-rich-text-option="justifyRight"><i class="bi bi-text-right"></i></button>
        </div>
        <div class="btn-group">
            <button data-rich-text-option="insertUnorderedList"><i class="bi bi-list-task"></i></button>
            <button data-rich-text-option="insertOrderedList"><i class="bi bi-list-ol"></i></button>
        </div>
        <div class="btn-group">
            <button data-rich-text-option="removeFormat"><i class="fa-solid fa-text-slash" style="font-size: 15px;"></i></button>
        </div>
        <div class="btn-group">
            <div class="color-dropdown">
                <button><i class="bi bi-eyedropper"></i></button>
                <ul>
                    <li style="background-color: #f36f6f"></li>
                    <li style="background-color: #728cff"></li>
                    <li style="background-color: #a16eff"></li>
                    <li style="background-color: #e632e6"></li>
                    <li style="background-color: #80ca4f"></li>
                    <li style="background-color: #efb35f"></li>
                    <li style="background-color: #69c5e3"></li>

                    <li style="background-color: #000000"></li>
                    <li style="background-color: #2f3037"></li>
                    <li style="background-color: #4e505c"></li>
                    <li style="background-color: #a4a4b3"></li>
                    <li style="background-color: #c0c0d8"></li>
                    <li style="background-color: #d3d3db"></li>
                    <li style="background-color: #ffffff; border: 1px solid #dddddd;"></li>
                </ul>
            </div>
        </div>
        `
        this.formatButtons = this.querySelectorAll('button');
        this.headingButtons = this.querySelectorAll('.heading-dropdown ul li');
        this.colorList = this.querySelector('ul');
        this.colorOptions = this.colorList.querySelectorAll('li');
    }


    addEventListeners() {
        this.editorPaper.addEventListener('mouseup', () => { this.showRichTextBar() });
        this.editorPaper.addEventListener('keyup', () => {this.showRichTextBar() });

        this.editor.addEventListener('mouseup', () => { this.showRichTextBar() });
        this.editor.addEventListener('scroll', () => { this.removeRichTextBar() });


        this.formatButtons.forEach(button => 
            button.addEventListener('click', () => { 
                this.formatText(button) 
            }));

        this.headingButtons.forEach(button =>
            button.addEventListener('click', () => {
                this.wrapHeadingOrParagraph(button);
            })
        )

        this.colorOptions.forEach(color => {
            color.addEventListener('click', () => {
                addColor(color.style.backgroundColor, 'foreColor')
             })
        })
    }



    showRichTextBar() {
        const selection = window.getSelection();

        if (!selection.isCollapsed) {
            this.placementHelper.placeFormatBar(selection);
            AnimationHandler.fadeIn(this);
            this.updateToolbarState()
        } 

        else {
            AnimationHandler.fadeOut(this);
            setTimeout(() => {
            this.removeRichTextBar();
            }, 150)

        }
    }



    /**
     * This method will remove the Rich text bar from the (Editor) UI.
     *
     * All the open dropdowns and active styles will be reset.
     */
    removeRichTextBar() {
        this.style.display = 'none';
        
        // close open dropdowns
        const colorDropdown = this.querySelector('.color-dropdown ul');
        colorDropdown.style.visibility = 'hidden';
        colorDropdown.style.opacity = '0';

        const headingDropdown = this.querySelector('.heading-dropdown ul');
        headingDropdown.style.visibility = 'hidden';
        headingDropdown.style.opacity = '0';


        // Remove the active style buttons
        this.formatButtons.forEach(button => {
            button.classList.remove('active-text-format');
        })
    }



    /**
     * This method will format that current selection with the specified style
     * This method currently uses execCommand but will be replaced with the
     * Range & Selection API for future proofing.
     *
     * @param button  - The button containing the style to apply
     * @param value   - Is never used
     */
    formatText(button, value = null) {
        const command = button.getAttribute('data-rich-text-option');
        if (document.queryCommandSupported(command)) {
            document.execCommand('styleWithCSS', false, true);
            document.execCommand(command, false, value);
            this.updateToolbarState();
        }
    }


    /**
     * This method will wrap the current selection with the specified heading value
     *
     * @param button { HTMLButtonElement } - The element (h1, h2, h3, h4, paragraph) that'll wrapp the current selection
     */
    wrapHeadingOrParagraph(button) {
        const element = button.getAttribute('data-rich-text-option');
        const paragraph = 'p';

        if (element !== 'paragraph') {
            document.execCommand('formatBlock', false, element);
        } else {
            document.execCommand('formatBlock', false, paragraph);
        }
    }



    updateToolbarState() {
        this.formatButtons.forEach(button => {
            button.classList.toggle('active-text-format', document.queryCommandState(button.getAttribute('data-rich-text-option')));
        })
    }
}


customElements.define('slash-command-component', SlashCommandContainer);
customElements.define('rich-text-bar', RichTextBar);