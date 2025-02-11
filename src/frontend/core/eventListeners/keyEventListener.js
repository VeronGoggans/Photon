import { EditorKeyBindings } from "../constants/constants.js";


export class KeyEventListener {
    constructor(editorView, editorController) {
        this.view = editorView;
        this.controller = editorController
        this.keyBindings();
    }

    keyBindings() {
        const editor = document.querySelector('.editor-paper');
        if (!editor) return; // Prevent errors if element is not found

        const keyActions = {
            [EditorKeyBindings.N_KEY]: (e) => {e.preventDefault(); this.view.clearCurrentEditorObject()},
            [EditorKeyBindings.D_KEY]: (e) => {e.preventDefault(); this.view.renderNoteDeleteModal()},
            [EditorKeyBindings.E_KEY]: (e) => {e.preventDefault(); this.controller.loadPreviousView()},
            [EditorKeyBindings.I_KEY]: (e) => {e.preventDefault(); this.view.renderNoteDetailsModal()},
            [EditorKeyBindings.GREATER_KEY]: (e) => {e.preventDefault(); this.view.loadNextNote()},
            [EditorKeyBindings.LESS_KEY]: (e) => {e.preventDefault(); this.view.loadPreviousNote()},
        };

        editor.addEventListener('keydown', (event) => {
            if (!event.ctrlKey) return; // Exit if Ctrl is not pressed

            keyActions[event.key]?.(event) || console.log('Unknown key binding.');
        });
    }
}