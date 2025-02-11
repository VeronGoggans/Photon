import { placeContextMenu } from "../dynamicElementPlacer.js";
import { folderColorOptionsTemplate, categoryColorOptionsTemplate } from "../../constants/modalTemplates.js";
import {CssAnimationClasses, CssAnimationDurations, ReferenceItemTypes, UIWebComponentNames} from "../../constants/constants.js";
import { UIWebComponentFactory } from "../../patterns/factories/webComponentFactory.js";


class DocumentLocationPageBlock extends HTMLElement {

    setData(value) {
        this.folders = value
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
            const folderPath = UIWebComponentFactory.createUIWebComponent(folder, UIWebComponentNames.FOLDER_PATH, false);
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
        const { boundedElement, menuTemplate, entityName } = value;
        this.boundedElement = boundedElement;
        this.menuTemplate = menuTemplate;
        this.entityName = entityName;
    }



    connectedCallback() {
        this.render();
        this.addEventListeners();
    }



    render() {
        this.innerHTML = this.menuTemplate;
        this.checkCorrectOptionStates();
        placeContextMenu(this, this.boundedElement);
    }



    checkCorrectOptionStates() {
        // Set the pin folder button's text content to Unpin if the folder is pinned.
        if (this.entityName === 'folder-card' && this.boundedElement.folder.pinned) {
            this.querySelector('#pin-folder-btn span').textContent = 'Unpin folder'
        }

        // Set the bookmark note button's text content to Remove bookmark if the note is bookmarked.
        if (this.entityName === 'note-card' && this.boundedElement.note.bookmark) {
            this.querySelector('#bookmark-note-btn span').textContent = 'Remove bookmark'
        }

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
            '#bookmark-note-btn, #edit-folder-btn, #delete-note-btn, #delete-folder-btn, #delete-sticky-board-btn, #pin-folder-btn');

        switch (option.id) {
            case 'bookmark-note-btn':
                this.boundedElement.handleBookmarkClick();
                break;

            case 'edit-folder-btn':
                this.boundedElement.handleEditClick();
                break;

            case 'pin-folder-btn':
                this.boundedElement.handlePinClick();
                break;

            case 'delete-note-btn':
            case 'delete-folder-btn':
            case 'delete-sticky-board-btn':
            case 'delete-flashcard-pack-btn':
            case 'delete-flashcard-btn':
                this.boundedElement.handleDeleteClick();
                break;
        }
        this.remove();
    }



    addEventListeners() {
        document.addEventListener('click', (event) => { this.removeOptionsMenu(event) });
        this.addEventListener('click', (event) => { this.handleOption(event) });
    }
}





class AppearanceOptions extends HTMLElement {
    constructor() {
        super();
    }


    connectedCallback() {
        this.entity = this.getAttribute('entity-name');
        this.render();
        this.addEventListeners();
    }


    render() {
        if (this.entity === 'folder') {
            this.innerHTML = folderColorOptionsTemplate;
        }
        else if (this.entity === 'category') {
            this.innerHTML = categoryColorOptionsTemplate;
        }

        this.colorOptions = this.querySelectorAll('#color-option');
        this.colorOptionWrappers = this.querySelectorAll('.color-option-wrapper');
    }


    addEventListeners() {
        /**
         * This event listener will listen for clicks on the  color options for that entity.
         * Clicking on a color option will give a visual indication to clarify that's the selected color.
         */
        this.colorOptions.forEach(colorOption => {
            const entityCSSClass = colorOption.getAttribute('data-entity-css-class');

            colorOption.addEventListener('click', () => {
                this.showSelectedAppearance(entityCSSClass);
            });
        });
    }


    /**
     * The `#showActiveFolderColor` method updates the visual state of folder color options
     * in the UI by highlighting the currently selected color and storing it as the preferred
     * folder color. It iterates over an array of color options, modifies their classes to
     * reflect the active selection, and updates the internal state.
     *
     * @private
     * @method
     * @name #showActiveFolderColor
     * @description This method ensures that only the folder color option matching the
     * given `styleClass` is highlighted by adding the `selected-folder-color` class to it.
     * Other color options have the `selected-folder-color` class removed. The selected
     * color is saved as `this.preferredEntityColor`.
     *
     * @param {string} entityCSSClass   - The CSS class corresponding to the selected entity color.
     */
    showSelectedAppearance(entityCSSClass) {
        for (let i = 0; i < this.colorOptions.length; i++) {
            const colorOption = this.colorOptions[i];
            let borderColor = colorOption.style.backgroundColor;

            if (colorOption.getAttribute('data-entity-css-class') !== entityCSSClass) {
                this.colorOptionWrappers[i].style.borderColor = 'transparent';
                continue
            }

            if (borderColor === '#f6f6f9' || borderColor === 'rgb(246, 246, 249)') {
                borderColor = '#5c7fdd';
            }

            this.colorOptionWrappers[i].style.borderColor = borderColor;
        }
        this.dispatchEvent(new CustomEvent('appearance-option-click', { detail: { color: entityCSSClass }, bubbles: true }));
    }
}





class ReferenceItemCard extends HTMLElement {
    constructor() {
        super();
    }


    connectedCallback() {
        this.draggable = true;
        this.contentEditable = 'false';
        this.referenceItem = JSON.parse(this.getAttribute('reference-item'));
        this.id = this.referenceItem.id;
        this.name = this.referenceItem.name;
        this.type = this.referenceItem.type;

        this.render();
        this.addEventListeners();
    }


    render() {
        this.innerHTML = `
            <i class="${this.determineIcon()}"></i>
            <span class="note-name">${this.name}</span>
        `
    }


    determineIcon() {
        switch (this.type) {
            case ReferenceItemTypes.NOTES:
                return 'bi bi-file-earmark';
            case ReferenceItemTypes.FOLDERS:
                return 'bi bi-folder';
            case ReferenceItemTypes.BOARDS:
                return 'bi bi-columns';   
        }

    }



    addEventListeners() {
        this.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('ReferenceItemClick', {
                detail: {
                    id: this.id,
                    type: this.type
                },
                bubbles: true
            }));
        })
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
        this.copyButton.classList.add(CssAnimationClasses.BOUNCING_ANIMATION);
        setTimeout(() => {
            this.copyButton.classList.remove(CssAnimationClasses.BOUNCING_ANIMATION);
        }, CssAnimationDurations.BOUNCING_ANIMATION);

        setTimeout(() => {
            this.copyButton.setAttribute('class', 'bi bi-copy')
        }, 2000);

    }
}
    


customElements.define('entity-options-menu', EntityOptionsMenu);
customElements.define(UIWebComponentNames.DOCUMENT_LOCATION, DocumentLocationPageBlock);
customElements.define('terminal-snippet', TerminalSnippet);
customElements.define('appearance-options', AppearanceOptions);
customElements.define('reference-item-card', ReferenceItemCard);
