import { UIWebComponentNames } from "../../constants/constants.js";
import { showContextMenu } from "../../util/ui.js";


const optionsMenuTemplate = `
    <div id="edit-category-btn" >
        <i class="bi bi-pen"></i>
        <span>Edit category</span>
    </div>
    <div id="delete-category-btn">
        <i class="bi bi-trash"></i>
        <span>Delete category</span>
    </div>
` 




class Category extends HTMLElement {
    static get observedAttributes() {
        return [UIWebComponentNames.CATEGORY];
    }


    constructor() {
        super();
    }


    attributeChangedCallback(name, oldValue, newValue) {
        if (name === UIWebComponentNames.CATEGORY) {
            this.category = JSON.parse(newValue);
            this.render();
        }
    }


    connectedCallback() {
        this.category = JSON.parse(this.getAttribute(UIWebComponentNames.CATEGORY));
        this.id = this.category.id;
        this.render();
    }


    render() {
        this.innerHTML = `
            <i class="bi bi-journal"></i>
            <span>${this.category.name}</span>
        `
        this.classList.add(this.category.color);
        this.#defineEvents();
    }


    handleClick() {
        this.dispatchEvent(new CustomEvent('categoryClick', { detail: { categoryId: this.id }, bubbles: true }));
    }


    #defineEvents() {
        this.addEventListener('contextmenu', (event) => {
            showContextMenu(event, this, optionsMenuTemplate, 'category-component');
        });

        this.addEventListener('click', this.handleClick.bind(this));
    }
}



customElements.define(UIWebComponentNames.CATEGORY, Category);