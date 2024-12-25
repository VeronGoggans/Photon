import { createCustomElement } from "../../util/ui/components.js";
import { formatDate } from "../../util/date.js";
import { pixelToPercentage } from "../../util/ui.js";


class DocumentLocationPageBlock extends HTMLElement {

    setData(value) {
        this.folders = value
        console.log(this.folders)
    }



    connectedCallback() {
        this.render();
    }



    render() {
        if (this.folders.length >= 6){ 
            this.folders[0] = {"id": "null", "name": ". . . . ."};

            // Remove the second element
            this.folders.splice(1, 1);
        }
        const folderPaths = [];
        this.folders.forEach(folder => {
            const folderPath = createCustomElement(folder, 'folder-path');
            const icon = document.createElement('i');
            icon.classList.add('bi');
            icon.classList.add('bi-chevron-right');

            folderPaths.push(folderPath);
            folderPaths.push(icon);           
        });
        folderPaths.pop();
        folderPaths.forEach(item => {
            this.appendChild(item);
        });
    }
}



class EntityOptionsMenu extends HTMLElement {
    constructor() {
        super();
    }

    /**
     * This method will provide the component with the necessary data
     * @param value {Object} - the object representing
     *                         The menu template, bounded HTML element and the bounded entity data
     */
    setData(value) {
        const { boundedElement, menuTemplate } = value;
        this.boundedElement = boundedElement;
        this.menuTemplate = menuTemplate;
    }



    connectedCallback() {
        this.render();
        this.addEventListeners();
    }



    render() {
        this.innerHTML = this.menuTemplate;

        // Place the options menu slightly above the card it's assigned to.
        const rect = this.boundedElement.getBoundingClientRect();
        const { x, y } = pixelToPercentage(rect.left, rect.top);

        this.style.left = `${x}%`;
        this.style.top =  `${y - 20}%`;
    }



    removeOptionsMenu(event) {
        if (!this.contains(event.target)) {
            this.remove();
            document.removeEventListener("click", this.removeOptionsMenu);
        }
    }


    /**
     * This method will determine which option the user clicked on, to then call the corresponding method
     *
     * @param event - The click event
     */
    handleOption(event) {
        // The ID's of all the options available
        const option = event.target.closest(
            '#bookmark-note-btn, #edit-folder-btn, #delete-note-btn, #delete-folder-btn, #delete-sticky-board-btn');

        switch (option.id) {
            case 'bookmark-note-btn':
                this.boundedElement.handleBookmarkClick();
                break;

            case 'edit-folder-btn':
                this.boundedElement.handleEditClick();
                break;

            case 'delete-note-btn':
            case 'delete-folder-btn':
            case 'delete-sticky-board-btn':
            case 'delete-flashcard-pack-btn':
            case 'delete-flashcard-btn':
                this.boundedElement.handleDeleteClick();
                break;
        }
    }



    addEventListeners() {
        document.addEventListener('click', (event) => { this.removeOptionsMenu(event) });
        this.addEventListener('click', (event) => { this.handleOption(event) });
    }
}





class NoteLink extends HTMLElement {
    constructor() {
        super();
    }


    connectedCallback() {
        this.contentEditable = false
        this.render();
        this.addEventListeners();
    }


    init(name, lastEditDate) {
        this.innerHTML = `
            <i class="bi bi-file-earmark"></i>
            <div>
                <span class="note-name">${name}</span>
                <span class="last-edit-date">${formatDate(lastEditDate)}</span>
            </div>
        `
    }


    render() {

    }

    addEventListeners() {
        this.dispatchEvent()
    }

}





class CodeSnippet extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const snippet = this.querySelector('code');
        hljs.highlightElement(snippet);
        this.addEventListeners();
    }


    render(language) {
        this.innerHTML = `
            <span>${language}</span>
            <pre>
                <code class="language-${language}" style="height: 50px;"></code>
            </pre>
        `
    }

    addEventListeners() {
        this.addEventListener('paste', (event) => {this.highlightOnPaste(event)})
    }

    highlightOnPaste(event) {
        event.preventDefault();

        // Access the clipboard data
        const clipboardData = event.clipboardData || window.clipboardData;
        const pastedContent = clipboardData.getData('text');
        
        const snippet = this.querySelector('code');
        snippet.textContent = pastedContent;

        hljs.highlightElement(snippet);
    }
}





class TerminalSnippet extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.contentEditable = false;
        this.render();
        this.addEventListeners();
    }

    render() {
        this.innerHTML = `
            <div class="terminal-bar">
                <p><i class="bi bi-copy"></i><span>Copy command</span></p>
            </div>
            <input type="text" class="terminal-command">
        `
        this.copyButton = this.querySelector('i');
        this.command = this.querySelector('.terminal-command');
        this.copyText = this.querySelector('span');
        this.renderCommand();
    
    }

    addEventListeners() {
        this.command.addEventListener('input', () => { this.setAttribute('data-command', this.command.value) });
        this.command.addEventListener('paste', () => { this.setAttribute('data-command', this.command.value) });
        this.copyButton.addEventListener('click', () => { this.handleCopyEvent() });
    }

    renderCommand() {
        const command = this.getAttribute('data-command');
    
        if (command !== null) {
            this.command.value = command;
        } else {
            this.setAttribute('data-command', '')
            this.command.value = '';
        }
    }


    handleCopyEvent() {
        navigator.clipboard.writeText(this.command.value);

        // apply bouncing class and remove it after animation is done.
        this.copyButton.setAttribute('class', 'bi bi-check-lg')
        this.copyButton.classList.add('bouncing');
        setTimeout(() => {
            this.copyButton.classList.remove('bouncing');
        }, 600);

        setTimeout(() => {
            this.copyButton.setAttribute('class', 'bi bi-copy')
        }, 2000);

    }
}
    

customElements.define('entity-options-menu', EntityOptionsMenu);
customElements.define('document-location-page-block', DocumentLocationPageBlock);
customElements.define('code-snippet', CodeSnippet);
customElements.define('terminal-snippet', TerminalSnippet);
