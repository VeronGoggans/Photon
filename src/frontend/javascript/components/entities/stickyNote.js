import {applyWidgetStyle, showContextMenu } from "../../util/ui.js";


const optionsMenuTemplate = `
    <div id="delete-sticky-board-btn">
        <i class="bi bi-pin-angle"></i>
        <span>Pin board</span>
    </div>
    <div id="delete-sticky-board-btn">
        <i class="bi bi-trash"></i>
        <span>Delete board</span>
    </div>
`


/**
 * 
 */
class StickyBoard extends HTMLElement {
    constructor() {
        super();
        this.boardIconsClasses = {
            'standard': 'bi bi-stickies',
            'column': 'bi bi-layout-three-columns'
        }
    }



    setData(value) {
        this.board = value;
        this.render();
    }



    connectedCallback() {
        this.id = this.board.id;
        this.setAttribute('data-type', this.board.type)
        this.addEventListeners();
    }



    render() {
        this.innerHTML = `
            <i></i>
            <div>
                <p>${this.board.name}</p>
                <span>${this.board.sticky_amount} stickies</span>
            </div>
        `
        this.querySelector('i').setAttribute('class', this.boardIconsClasses[this.board.type])
        applyWidgetStyle(this);
    }


    handleDeleteClick() {
        this.dispatchEvent(new CustomEvent('DeleteStickyBoard', { detail: { stickyBoard: this.board }, bubbles: true }));
    }

    handleCardClick() {
        this.dispatchEvent(new CustomEvent('StickyBoardClick', { detail: { stickyBoard: this.board }, bubbles: true }));
        console.log('click click click')
    }

    addEventListeners() {
        this.addEventListener('contextmenu', (event) => { showContextMenu(event, this, optionsMenuTemplate) });
        this.addEventListener('click', () => { this.handleCardClick() });
    }
}





/**
 * This class represents the sticky notes that will be placed on the column sticky board type
 * These sticky notes have a fixed size which differs them from the DynamicStickyNote class
 */
class StickyNote extends HTMLElement {
    constructor() {
        super();
    }

    setData(value) {
        this.sticky = value;
    }

    connectedCallback() {
        this.id = this.sticky.id;
        
        this.render();
        this.addEventListeners();
    }


    render() {
        this.innerHTML = `
            <p>${this.sticky.content}</p>
        `;
    }


    addEventListeners() {
        this.addEventListener('click', this.handleCardClick.bind(this));
    }

    handleCardClick() {
        this.dispatchEvent(new CustomEvent('StickyCardClick', { detail: { sticky: this.sticky }, bubbles: true}));
    }
}






/**
 * This class represents the sticky notes that will be placed on the standard sticky board type
 * The word dynamic stems from the feature that these stickies will resize based on the textcontent of them.  
 */
class DynamicStickyNote extends HTMLElement {
    constructor() {
        super();
    }

    setData(value) {
        this.sticky = value
    }


    connectedCallback() {
        this.id = this.sticky.id;
        this.render();
    }

    
    disconnectedCallback() {
        this.removeEventListener('click', this.handleCardClick.bind(this));
        this.stickyContent.removeEventListener('input', this.handleStickyResize.bind(this));
    }


    render() {
        this.innerHTML = `
            <p>${this.sticky.content}</p>
        `;
        this.stickyContent = this.querySelector('p');
    }


    handleCardClick() {
        this.dispatchEvent(new CustomEvent('StickyCardClick', { 
            detail: { 
                stickyId: this.sticky.id, 
                message: 'currently editing' 
            }, bubbles: true
        }));
    }


    /**
     * This method is responsible for the automatic resizing of the sticky note 
     * based on its content
     */
    handleStickyResize() {
        // resize logic here
    }


    addEventListeners() {
        this.addEventListener('click', this.handleCardClick.bind(this));
        this.stickyContent.addEventListener('input', this.handleStickyResize.bind(this));
    }
}





customElements.define('dynamic-sticky-note', DynamicStickyNote);
customElements.define('sticky-note', StickyNote);
customElements.define('sticky-board', StickyBoard);