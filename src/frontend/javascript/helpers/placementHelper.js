export class PlacementHelper {
    constructor() {
        this.formatBarWidth = 611.8 //Pixels
        this.formatBarHeigth = 51.6 // Pixels
        this.commandBarHeigth = 300 //Pixels
        this.commandBarWidth = 300 // Pixels
        this.paddingY = 50 //Pixels

        this.sidebar = document.querySelector('.sidebar');
        this.editor = document.querySelector('.editor');
        this.formatBar = document.querySelector('rich-text-bar');
        this.forwardSlashCommandContainer = document.querySelector('slash-command-container');
    }


    placeFormatBar(selection) {
        const rect = selection.getRangeAt(0).getBoundingClientRect();
        const xPosition = this.#checkForWidthOverflow(rect, this.formatBarWidth);
        this.formatBar.style.top = `${rect.top + window.scrollY - this.formatBarHeigth - this.paddingY}px`;
        this.formatBar.style.left = `${xPosition}px`;
        this.formatBar.style.display = 'flex';        
    }


    placeCommandBar(selection) {
        const rect = selection.getRangeAt(0).getBoundingClientRect();

        const xPosition = this.#checkForWidthOverflow(rect, this.commandBarWidth);
        const overflow = this.#checkForHeightOverflow(rect);
        if (overflow) {
            this.forwardSlashCommandContainer.style.top = `${rect.bottom + window.scrollY  + 5}px`;
        } else {
            this.forwardSlashCommandContainer.style.top = `${rect.top + window.scrollY - this.commandBarHeigth - this.paddingY}px`;
        }
        this.forwardSlashCommandContainer.style.left = `${xPosition}px`;
        this.forwardSlashCommandContainer.style.display = 'grid';
        this.forwardSlashCommandContainer.scrollTop = 0;
    }

    /**
     * This method adjusts the spawn point of the
     * command/format containers if X axis overflow is taking place.
     * @param {DOMRect} rect 
     * @param {Number} width  
     */
    #checkForWidthOverflow(rect, width) {
        const padding = 20; //Pixels
        const screenWidth = this.editor.clientWidth;
        const spawnPoint = rect.left + window.scrollX - this.sidebar.clientWidth;
        const totalWidth = spawnPoint + width;

        if (totalWidth > screenWidth) {            
            const pixelOverflow = totalWidth - screenWidth;
            return spawnPoint - pixelOverflow - padding;
        }
        return spawnPoint;
    }

    /**
     * Same thing as the method above but now for 
     * Y axis overflow.
     * @param {DOMRect} rect 
     */
    #checkForHeightOverflow(rect) {
        const spawnPoint = rect.top + window.scrollY;
        const totalHeigth = spawnPoint - this.commandBarHeigth; 
        if (totalHeigth <= 10) { 
            return true
        }
        return false
    }
}