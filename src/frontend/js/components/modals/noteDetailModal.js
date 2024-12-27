import { formatDate } from "../../util/date.js";


export class NoteDetailModal {
    constructor(modalData) {
        this.editor = document.querySelector('.editor');
        this.modal = document.createElement('div');
        this.modal.classList.add('note-details-modal');
        this.modal.innerHTML = `
            <h2>Note details</h2>
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
}