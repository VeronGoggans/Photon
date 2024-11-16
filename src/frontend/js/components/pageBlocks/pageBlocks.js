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


class CodeSnippit extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const snippit = this.querySelector('code');
        hljs.highlightElement(snippit);
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
        
        const snippit = this.querySelector('code');
        snippit.textContent = pastedContent;

        hljs.highlightElement(snippit);
    }
}
    

customElements.define('description-page-block', DescriptionPageBlock);
customElements.define('document-location-page-block', DocumentLocationPageBlock);
customElements.define('code-snippit', CodeSnippit);
