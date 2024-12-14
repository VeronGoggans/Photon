import { stickyNoteColors } from "../../constants/constants.js";
import { captureNewLines } from "../../util/formatters.js";


class StickyBoard extends HTMLElement {
    constructor() {
        super();
        this.boardIconsClasses = {
            'board': 'bi bi-stickies',
            'column': 'bi bi-layout-three-columns'
        }
    }



    setData(value) {
        this.board = value;
        this.render();
    }



    connectedCallback() {
        this.id = this.board.id;
        this.addEventListeners();
    }



    render() {
        this.innerHTML = `
            <i class=${this.boardIconsClasses[this.board.type]}></i>
            <div>
                <p>${this.board.name}</p>
                <span>${this.board.sticky_amount} stickies</span>
            </div>
        `
    }



    addEventListeners() {

    }




}



class StickyNote extends HTMLElement {
    static get observedAttributes() {
        return ['sticky']; 
    }

    constructor() {
        super();
    }


    connectedCallback() {
        this.sticky = JSON.parse(this.getAttribute('sticky'));
        this.id = this.sticky.id;
        this.style.backgroundColor = stickyNoteColors[Math.floor(Math.random()*stickyNoteColors.length)]
        
        this.render();
        this.addEventListener('click', this.handleCardClick.bind(this));
    }

    
    disconnectedCallback() {
        this.removeEventListener('click', this.handleCardClick.bind(this));
    }


    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'sticky') {
            this.sticky = JSON.parse(newValue);
            this.render();
        }
    }

    render() {
        this.innerHTML = `
            <h3>${this.sticky.name}</h3>
            <p>${captureNewLines(this.sticky.content)}</p>
        `;
    }

    handleCardClick() {
        this.dispatchEvent(new CustomEvent('StickyCardClick', { detail: { sticky: this.sticky }, bubbles: true}));
    }
}

customElements.define('sticky-card', StickyNote);
customElements.define('sticky-board', StickyBoard);