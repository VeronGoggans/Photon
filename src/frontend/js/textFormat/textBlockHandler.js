export class TextBlockHandler {
    constructor(page) {
        this.page = page;
        this.importantBlocks = []
        this.quoteBlocks = []
        this.copyBlocks = []
    }

    parse() {        
    }

    empty() {
        this.importantBlocks = []
        this.quoteBlocks = []
        this.copyBlocks = []
    }

    
}