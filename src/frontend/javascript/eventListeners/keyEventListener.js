export class KeyEventListener {
    constructor(view) {
        this.view = view; 
        this.keyBindings();
    }

    keyBindings() {
        document.querySelector('.editor-paper')
        .addEventListener('keydown', (event) => {
            if (event.ctrlKey) {
                switch (event.key) {
                    // case "n":
                    //   event.preventDefault();
                    //   this.view.new();
                    //   break;
                    // case "e":
                    //   event.preventDefault();
                    //   this.view.saveEditorObject();
                    //   break;
                    default:
                        console.log('Unknown key binding.');
                }
            }
        });
    }
}