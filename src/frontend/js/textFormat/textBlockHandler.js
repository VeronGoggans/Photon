export class TextBlockHandler {
    constructor(page) {
        this.page = page;
    }

    parse() {        
        this.headings = this.page.querySelectorAll('h1, h2, h3, h4');
        this.anchorTags = this.page.querySelectorAll('a');
        this.images = this.page.querySelectorAll('img');
        this.#eventListeners();
    }

    renderLinkPreview() {
        console.log("Preview ?");
        
    }

    #eventListeners() {
        this.headings.forEach(heading => {
            heading.addEventListener('keydown', (event) => {              
              // If the Backspace key is pressed and heading text is empty, remove the heading
              if (event.key === 'Backspace' && heading.textContent.trim() === '') {
                event.preventDefault();
                heading.remove();
              }
            });
        });

        // When links are loaded in they don't have eventlisteners on them by default.
        // This method creates those event listener for each link.

        this.anchorTags.forEach(function(link) {
            link.addEventListener('click', () => {
                window.open(link.href)
            });
        });

        this.anchorTags.forEach((link) => {
            link.addEventListener('mouseover', () => {
                this.renderLinkPreview();
            });
        });

        this.images.forEach(image => {
            image.addEventListener('click', () => {
                image.classList.toggle('selected-image');
            })
        });


    }
}
