import { createCustomElement } from "../../util/ui/components.js";

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
        const folderPaths = []
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
    

customElements.define('description-page-block', DescriptionPageBlock);
customElements.define('document-location-page-block', DocumentLocationPageBlock);
