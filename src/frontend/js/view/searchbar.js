export class Searchbar {
    constructor(controller) {
        this.controller = controller;
        this.searchItems = []
        this.#initElements();
        this.#eventListeners();
    }

    fillSearchbar(searchType, searchObjects) {        
        if (searchObjects.length > 0) {
            for (let i = 0; i < searchObjects.length; i++) {
                this.addSearchItem(searchType, searchObjects[i])  
            }
        } 
    }

    addSearchItem(searchType, searchObject) {
        this.searchItems.push({ type: searchType, object: searchObject});
    }

    deleteSearchItem(searchObjectId) {
        this.searchItems = this.searchItems.filter(obj => obj.object.id !== searchObjectId);
    }

    updateSearchItem(searchObjectId, newName) {
        const option = this.searchItems.find(obj => obj.object.id === searchObjectId);
        option.name = newName;
    }
    
    listenForClicks() {
        const searchItems = this.searchList.children;
        for (let i = 0; i < searchItems.length; i++) {

            const id = searchItems[i].id;
            const searchType = searchItems[i].dataset.searchType;
            const child = searchItems[i];

            if (child.nodeName === 'LI') {
                searchItems[i].addEventListener('click', () => {
                    this.controller.handleSearch(id, searchType);
                    this.input.value = '';
                });
            }
        }
    }

    
    handleInput() {
        this.searchList.style.opacity = '1';
        this.searchList.style.visibility = 'visible';
        const inputValue = this.input.value.toLowerCase();
        const filteredItems = this.searchItems.filter(suggestion =>
          suggestion.object.name.toLowerCase().includes(inputValue)
        );
        this.renderItems(filteredItems);
    }


    renderItems(searchItems) { 
        this.searchList.innerHTML = '';
        searchItems.forEach(suggestion => {
            const suggestionElement = document.createElement('li');
            let content = '';

            if (suggestion.type === 'note') {
                content = `<i id="note-search-type" class="bi bi-file-earmark"></i> ${suggestion.object.name}`;
                suggestionElement.dataset.searchType = 'note'
            } else if (suggestion.type === 'folder') {
                content = `<i id="folder-search-type" class="bi bi-folder"></i> ${suggestion.object.name}`;
                suggestionElement.dataset.searchType = 'folder'
            } else if (suggestion.type === 'template') {
                content = `<i id="template-search-type" class="bi bi-file-earmark-text"></i> ${suggestion.object.name}`;
                suggestionElement.dataset.searchType = 'template'
            } else if (suggestion.type === 'flashcard') {
                content = `<i id="flashcard-search-type" class="bi bi-card-text"></i> ${suggestion.object.name}`;
                suggestionElement.dataset.searchType = 'flashcard'
            }

            suggestionElement.innerHTML = content;
            suggestionElement.id = suggestion.object.id;
            this.searchList.appendChild(suggestionElement);
        })
        this.listenForClicks();
    }


    #initElements() {
        this.input = document.querySelector('.searchbar input');
        this.searchList = document.querySelector('.searchbar ul');
        this.viewContent = document.querySelector('.content');

    }

    #eventListeners() {
        this.input.addEventListener('input', () => {this.handleInput()});
        this.input.addEventListener('click', () => {this.handleInput()});
        this.viewContent.addEventListener('click', (event) => {
            if (!event.target.closest('.searchbar')) {
                this.searchList.style.opacity = '0';
                this.searchList.style.visibility = 'hidden';
            }
        })
    }
}