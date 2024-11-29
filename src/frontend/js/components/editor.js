import { AnimationHandler } from "../handlers/animationHandler.js";
import { addChecklist, addCodeBlock, addHeading, addHtml, addLink, addList, addHorizontalLine, addEmbedVideo, addColor, addTerminal } from "../textFormat/textFormatter.js";
import { PlacementHelper } from "../helpers/placementHelper.js";


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
            <div class="link-option" data-command="link"><i class="bi bi-link-45deg"></i>Add url</div>
            <div class="embed-video-option" data-command="video"><i class="bi bi-play-fill"></i>Add video</div>
            <div class="horizontal-line-option" data-command="line"><i class="bi bi-hr"></i>Add horizontal line</div>
            <div class="unordered-list" data-command="ul"><i class="bi bi-list-ul"></i>Add bullet list</div>
            <div class="ordered-list" data-command="ol"><i class="bi bi-list-ol"></i>Add numbered list</div>
            <div class="check-list" data-command="check"><i class="bi bi-check-square"></i>Add check list</div> 
            <div class="heading-1" data-command="h1"><i class="bi bi-type-h1"></i>Add heading 1</div>
            <div class="heading-2" data-command="h2"><i class="bi bi-type-h2"></i>Add heading 2</div>
            <div class="heading-3" data-command="h3"><i class="bi bi-type-h3"></i>Add heading 3</div>
            <div class="heading-4" data-command="h4"><i class="bi bi-type-h4"></i>Add heading 4</div>
            <div class="snippit" data-command="snippet"><i class="bi bi-code-slash"></i>Add code snippit</div>
            <div class="terminal" data-command="terminal"><i class="bi bi-terminal"></i>Add terminal command</div>
            <div class="note" data-command="ref"><i class="bi bi-file-earmark"></i>Add note reference</div>
            <div class="template" data-command="template"><i class="bi bi-file-earmark-text"></i>Apply template</div>
            <div class="insert-html" data-command="html"><i class="bi bi-filetype-html"></i>Insert HTML</div>
        </div>
        `
        this.container = this.querySelector('.commands');
        this.commands = this.container.querySelectorAll('div');
        this.input = this.querySelector('input');
    }


    addEventListeners() {
        this.listenForCommmandClicks();
        this.querySelector('input').addEventListener('keydown', (event) => { this.handleKeyEvents(event) });
        this.editorPaper.addEventListener('click', () => { this.removeSlashCommands() });
        this.editorPaper.addEventListener('keyup', (event) => { this.checkForForwardSlash(event) });
        this.editor.addEventListener('scroll', () => { this.removeSlashCommands() });
    }


    executeSlashCommand(command, extension = null) {
        switch (command) {
          case 'link':
            addLink(this.range);
            break;
          case 'video':
            addEmbedVideo(this.range);
            break;
          case 'line':
            addHorizontalLine(this.range, extension);
            break;
          case 'ul':            
            addList(this.range, 'ul');
            break;
          case 'ol':
            addList(this.range, 'ol');
            break;
          case 'check':
            addChecklist(this.range);
            break;
          case 'h1':
            addHeading(this.range, 1, extension);
            break;
          case 'h2':
            addHeading(this.range, 2, extension);
            break;
          case 'h3':
            addHeading(this.range, 3, extension);
            break;
          case 'h4':
            addHeading(this.range, 4, extension);
            break;
          case 'snippet':
            addCodeBlock(this.range, extension);
            break;
          case 'terminal':
            addTerminal(this.range);
            break;
          case 'html':
            addHtml(this.range);
            break;
          case 'template':
            break;
          default:
            console.log('No matching function for:', command);
        }
        this.input.value = '';
    }


    listenForCommmandClicks() {
        this.container.addEventListener('click', (event) => {
            const command = event.target.closest('div').getAttribute('data-command');

            this.deleteForwardSlash();
            this.removeSlashCommands();
            this.executeSlashCommand(command);
        });
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
            const updatedTextContent = textContent.slice(0, caretOffset - 1) + ' ' + textContent.slice(caretOffset);
            caretNode.textContent = updatedTextContent;

            // Update the range to reflect the new caret position (just after the space)
            this.range.setStart(caretNode, caretOffset);  // Start position after the space
            this.range.setEnd(caretNode, caretOffset);    // End position at the same point

            // Apply the new range
            const selection = window.getSelection();
            selection.removeAllRanges(); // Remove any previous selection
            selection.addRange(this.range); // Add the updated range to the selection
        }
    } 
    }

    deleteForwardSlash() {
       // Move the cursor to the correct position
        this.range.deleteContents(); // Delete the slash
        this.range.insertNode(document.createTextNode(' ')); // Insert space

        // Place the cursor right after the inserted space
        const spaceNode = this.range.startContainer;
        const spaceTextNode = spaceNode.splitText(this.range.startOffset);
        
        // Move the range to the position after the space
        this.range.setStart(spaceNode, spaceTextNode.length); 
        this.range.setEnd(spaceNode, spaceTextNode.length);

        // Focus the contentEditable div and set the cursor to the inserted space
        this.editor.focus();
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(this.range);
    }


    updateActiveOption() {
        const selectedCommand = this.commands[this.selectedIndex];
        // Remove 'active' class from all options
        this.commands.forEach(command => {
            command.classList.remove('active');
        });

        // Apply active class to selected option
        selectedCommand.classList.add('active');

        // Scoll selected options into view 
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
            console.log(command);
            
            this.deleteForwardSlash();
            this.executeSlashCommand(command);
            this.removeSlashCommands();
        }

        else if (event.key === 'Enter') {
            event.preventDefault();

            const { command, extention } = this.getCommand();
            this.deleteForwardSlash();
            this.executeSlashCommand(command, extention);
            this.removeSlashCommands();
        }

        else if (event.key === 'Backspace' && this.input.value === '') {
            event.preventDefault();

            this.deleteForwardSlash();
            this.removeSlashCommands();
        }
    }


    showSlashCommands() {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        this.input.value = '';
        
        if (selection.isCollapsed) {
            this.range = range;
            this.placementHelper.placeCommandBar(selection);
            AnimationHandler.fadeIn(this);
            this.container.scrollTo({ top: 0, behavior: 'smooth' });
            this.input.focus();
        } 
        
        else {
          this.removeSlashCommands();
        }
    }


    checkForForwardSlash(event) {
        if (event.key === '/') {
            this.showSlashCommands();
        }
    }


    rememberRange(range) {
        this.range = range;
    }


    removeSlashCommands() {
        this.selectedIndex = -1;
        this.commands.forEach(command => {
            command.classList.remove('active');
        });
        AnimationHandler.fadeOut(this);
        this.input.placeholder ='Enter a command';
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
        this.colorList = this.querySelector('ul');
        this.colorOptions = this.colorList.querySelectorAll('li');
    }


    addEventListeners() {
        this.editorPaper.addEventListener('mouseup', () => { this.showRichTextBar() });
        this.editor.addEventListener('mouseup', () => { this.showRichTextBar() });
        this.editor.addEventListener('scroll', () => { this.removeRichTextBar() });
        this.formatButtons.forEach(button => 
            button.addEventListener('click', () => { 
                this.formatText(button) 
            }));
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


    removeRichTextBar() {
        this.style.display = 'none';
        // close color dropdown
        let colorDropdown = this.querySelector('.color-dropdown ul');
        colorDropdown.style.visibility = 'hidden';
        colorDropdown.style.opacity = '0';
        this.formatButtons.forEach(button => {
            button.classList.remove('active-text-format');
        })
    }


    formatText(button, value = null) {
        const command = button.getAttribute('data-rich-text-option');
        if (document.queryCommandSupported(command)) {
            document.execCommand('styleWithCSS', false, true);
            document.execCommand(command, false, value);
            this.updateToolbarState();
        }
    }

    updateToolbarState() {
        this.formatButtons.forEach(button => {
            button.classList.toggle('active-text-format', document.queryCommandState(button.getAttribute('data-rich-text-option')));
        })
    }
}


customElements.define('slash-command-container', SlashCommandContainer);
customElements.define('rich-text-bar', RichTextBar);