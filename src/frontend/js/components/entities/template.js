import { formatName, filterNotePreview } from "../../util/formatters.js";
import { showContextMenu } from "../../util/ui.js";


const optionsMenuTemplate = `
    <div id="delete-btn">
        <i class="fa-solid fa-trash"></i>
        <span>Delete template</span>
    </div>
`


class Template extends HTMLElement {
    constructor() {
        super();
    }

    setData(value) {
        this.template = value;
        this.render();
    }

    connectedCallback() {
        this.id = this.template.id;
        this.addEventListeners();
    }
    

    render() {        
        this.innerHTML = `
            <h4>${formatName(this.template.name)}</h4>
            <div class="note-content-box">${filterNotePreview(this.template.content)}</div>
        `;
    }


    addEventListeners() {
        this.addEventListener('click', (event) => {this.handleCardClick(event)});
        this.addEventListener('contextmenu', (event) => {showContextMenu(event, this, optionsMenuTemplate)});
    }


    handleCardClick(event) {
        if (!event.target.closest('.options-menu')){
            this.dispatchEvent(new CustomEvent('TemplateCardClick', { detail: { template: this.template }, bubbles: true }));
        }
    }

    handleDeleteClick() {
        this.dispatchEvent(new CustomEvent('DeleteTemplate', { detail: { template: this.template }, bubbles: true }));
    }
}

customElements.define('template-card', Template);
