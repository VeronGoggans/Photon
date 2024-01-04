class SidebarView {
    constructor() {
        window.addEventListener('resize', () => this.sidebarWidth());
        this._sidebar = document.querySelector('.sidebar');
        this._wrapper = document.querySelector('.wrapper');
        this._createNoteButton = document.querySelector('.create-note-btn');
        this._createSNoteSpan = this._createNoteButton.querySelector('span');
        this._backButton = document.querySelector('.exit-folder-btn');
        this._backSpan = this._backButton.querySelector('span');
        this._homeButton = document.querySelector('.home-screen-btn');
        this._homeSpan = this._homeButton.querySelector('span');
        this._collapsed = false;
    }

    collapseButtons() {
        this._createSNoteSpan.textContent = '';
        this._backSpan.textContent = '';
        this._homeSpan.textContent = '';
    }

    openButtons() {
        this._createSNoteSpan.textContent = 'Note';
        this._backSpan.textContent = 'Back';
        this._homeSpan.textContent = 'Home';
    }


    sidebarWidth() {
        if (window.innerWidth < 700) {
            this._collapsed = true;
            this.collapseButtons();
        } else if (window.innerWidth >= 700 && this._collapsed === true) {
            this._collapsed = false;
            this.openButtons();
        }
    }
}

const VIEW = new SidebarView();