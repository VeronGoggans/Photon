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
            [EditorKeyBindings.N_KEY]: () => this.view.clearCurrentEditorObject(),
            [EditorKeyBindings.D_KEY]: () => this.view.renderNoteDeleteModal(),
            [EditorKeyBindings.E_KEY]: () => this.controller.loadPreviousView(),
            [EditorKeyBindings.I_KEY]: () => this.view.renderNoteDetailsModal(),
            [EditorKeyBindings.GREATER_KEY]: () => this.view.loadNextNote(),
            [EditorKeyBindings.LESS_KEY]: () => this.view.loadPreviousNote(),
        };

        editor.addEventListener('keydown', (event) => {
            if (!event.ctrlKey) return; // Exit if Ctrl is not pressed
            event.preventDefault();

            keyActions[event.key]?.() || console.log('Unknown key binding.');
        });
    }
}