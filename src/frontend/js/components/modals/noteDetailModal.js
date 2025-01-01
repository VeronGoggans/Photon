import { formatDate } from "../../util/date.js";


export class NoteDetailModal {
    constructor(modalData) {
        this.editor = document.querySelector('.editor');
        this.modal = document.createElement('div');
        this.modal.classList.add('note-details-modal');
        this.modal.innerHTML = `
            <h2>Note details</h2>
            <span class="note-name-details"><i class="bi bi-file-earmark"></i> ${modalData.name}</span>
            <table>
                <tr>
                    <td class="property"><i class="bi bi-list-columns-reverse"></i> Words</td>
                    <td class="property-value">${this.#getWordCount()}</td>
                </tr>
                <tr>
                    <td class="property"><i class="bi bi-list-columns-reverse"></i> Characters</td>
                    <td class="property-value">${this.#getCharCount()}</td>
                </tr>
                <tr>
                    <td class="property"><i class="bi bi-list-columns-reverse"></i> Characters excluding spaces</td>
                    <td class="property-value">${this.#getCharCountExcludingSpaces()}</td>
                </tr>
                <tr>
                    <td class="property"><i class="bi bi-clock"></i> Date created</td>
                    <td class="property-value">${this.#checkDateForNull(modalData.creation)}</td>
                </tr>
                <tr>
                    <td class="property"><i class="bi bi-pen"></i> Last change made </td>
                    <td class="property-value">${this.#checkDateForNull(modalData.last_edit)}</td>
                </tr>
                <tr>
                    <td class="property"><i class="bi bi-book"></i> Read time </td>
                    <td class="property-value">${this.#getReadingTime()}</td>
                </tr>
            </table>
        `        
        return this.modal;
    }

    #checkDateForNull(date) {
        return date === null ? 'Not available' : formatDate(date);
    }

    #getWordCount() {
        let text = this.editor.textContent || this.editor.innerText;
        return text.split(/[ \n]+/).length;
    }

    #getCharCount() {
        let text = this.editor.textContent || this.editor.innerText;
        return text.length
    }

    #getCharCountExcludingSpaces() {
        let text = this.editor.textContent || this.editor.innerText;
        return text.replace(/\s/g, '').length
    }

    /**
     * The average WPM when reading out loud is 183,
     * while it increases to 231 when reading in silence.
     *
     * This function assumes an average of 210 WPM for calculating reading time.
     * It returns a human-readable string, e.g., "1 minute", "2 hours".
     */
    #getReadingTime() {
        const words = this.#getWordCount();
        const WPM = 210; // Average words read per minute
        let timeUnit;
        let readTime = Math.ceil(words / WPM); // Total reading time in minutes

        if (readTime >= 60) {
            // Convert minutes to hours
            readTime = readTime / 60;
            timeUnit = readTime === 1 ? 'hour' : 'hours';
            readTime = Math.floor(readTime); // Floor for whole hours
        }
        else {
            timeUnit = readTime === 1 ? 'minute' : 'minutes';
        }

        return `${readTime} ${timeUnit}`;
    }
}