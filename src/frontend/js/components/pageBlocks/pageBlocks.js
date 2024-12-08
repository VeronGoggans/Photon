import { createCustomElement } from "../../util/ui/components.js";
import { formatDate } from "../../util/date.js";


class DescriptionPageBlock extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }
    

    render() {
        this.innerHTML = `
            <span class="page-property">
                <i class="bi bi-grip-vertical"></i>Description
            </span>
            <p class="description-block-content">
                <span class="description-block-placeholder">Add your description here...</span>
            </p>
        `;
    }
}





class DocumentLocationPageBlock extends HTMLElement {
    connectedCallback() {
        this.folders = JSON.parse(this.getAttribute('folders'));
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
    

customElements.define('description-page-block', DescriptionPageBlock);
customElements.define('document-location-page-block', DocumentLocationPageBlock);
customElements.define('code-snippit', CodeSnippet);
customElements.define('terminal-snippet', TerminalSnippet);
