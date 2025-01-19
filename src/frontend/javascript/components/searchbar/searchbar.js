class AutocompleteSearch extends HTMLElement {
    constructor() {
        super();
        this.selectedIndex = -1; // Tracks the currently selected suggestion
        this.allSuggestions = [];
        this.filteredSuggestions = this.allSuggestions;
    }


    connectedCallback() {
        this.render();
        this.eventListeners();
    }


    render() {
        this.innerHTML = `
            <i id="search-icon" class="bi bi-search"></i>
            <input type="text" placeholder="Search..." spellcheck="false">
            <div class="searchbar-dropdown soft-dropdown"></div>
        `;

        this.input = this.querySelector('input[type="text"]');
        this.searchbarDropdown = this.querySelector('.searchbar-dropdown');
        this.view = document.querySelector('.view');
    }


    eventListeners() {
        this.searchbarDropdown.addEventListener('SearchBarItemClick', (event) => this.handleSearchbarSearch(event));
        this.input.addEventListener("input", () => this.handleKeyInput());
        this.input.addEventListener('click', () => this.handleKeyInput());
        this.input.addEventListener("keydown", (event) => this.handleKeyDown(event));

        this.view.addEventListener('click', (event) => {
            if (!event.target.closest('autocomplete-searchbar')) {
                this.closeSearchbarDropdown();
            }
        });
    }


    /**
     * Inserts multiple search items with a specified search type.
     *
     * @param { string } searchType - The search type of the search items (e.g. note, folder, to do, sticky board).
     * @param { Array } searchItems - An array of items to be added to the searchbar.
     */
    insertItems(searchType, searchItems) {
        if (searchItems.length > 0) {
            for (let searchItem of searchItems) {
                this.addSearchItem(searchType, searchItem)
            }
        }
    }


    /**
     * Adds a new search item to the list of all suggestions.
     *
     * @param { string } searchType - The type/category of the search item (e.g., note, folder, to-do, etc.).
     * @param { Object } searchItem - The search item object to be added, containing relevant data like id, name, etc.
     */
    addSearchItem(searchType, searchItem) {
        this.allSuggestions.push({ type: searchType, item: searchItem });
    }


    /**
     * Deletes a search item from the list of all suggestions by its unique identifier.
     *
     * @param { string|number } searchItemId - The unique identifier (id) of the search item to be removed.
     */
    deleteSearchItem(searchItemId) {
        this.allSuggestions = this.allSuggestions.filter(obj => obj.item.id !== searchItemId);
    }


    /**
     * Updates an existing search item in the list of all suggestions.
     *
     * @param {Object} searchItem - The search item object containing updated data, including its unique identifier (id).
     */
    updateSearchItem(searchItem) {
        const option = this.allSuggestions.find(obj => obj.item.id === searchItem.id);
    }


    /**
     * This method will render searchbar suggestions inside the dropdown.
     */
    renderItems() {
        // Clear the previous suggestions.
        this.searchbarDropdown.innerHTML = '';

        const documentFragment = document.createDocumentFragment();

        // Iterate over the items and append to the document fragment
        this.filteredSuggestions.forEach((searchItem, index) => {
            const searchBarItem = document.createElement('searchbar-item');
            searchBarItem.setAttribute('searchbar-item', JSON.stringify(searchItem));

            // Highlight the selected suggestion
            if (index === this.selectedIndex) {
                searchBarItem.classList.add('selected-searchbar-item');
            }

            documentFragment.appendChild(searchBarItem);
        });

        // Append all created elements to the dropdown
        this.searchbarDropdown.appendChild(documentFragment);
    }



    handleKeyInput() {
        this.openSearchbarDropdown();

        // Filter through all the suggestions by the current user input.
        this.filteredSuggestions = this.allSuggestions.filter(suggestion =>
            suggestion.item.name.toLowerCase()
                .includes(this.input.value.toLowerCase())
        );

        // Reset selectedIndex for new search results
        this.selectedIndex = -1;

        // Render the filtered suggestions to the searchbar dropdown
        this.renderItems();
    }


    handleSearchbarSearch() {
        this.input.value = '';
    }



    /**
     * Opens the searchbar dropdown by resetting its scroll position
     * and making it visible with a smooth transition.
     */
    openSearchbarDropdown() {
        this.searchbarDropdown.scrollTo({ top: 0, behavior: 'smooth' })
        this.searchbarDropdown.style.opacity = '1';
        this.searchbarDropdown.style.visibility = 'visible';
    }


    /**
     * Closes the searchbar dropdown by hiding it with a smooth transition.
     */
    closeSearchbarDropdown() {
        this.searchbarDropdown.style.opacity = '0';
        this.searchbarDropdown.style.visibility = 'hidden';
    }


    /**
     *
     * @param event
     */
    handleKeyDown(event) {
        const suggestions = Array.from(this.searchbarDropdown.children);

        if (event.key === "ArrowDown") {
            // Move the selection down
            event.preventDefault();
            this.selectedIndex = (this.selectedIndex + 1) % suggestions.length;
            this.renderItems();
            this.scrollToSelected(suggestions);
        }

        else if (event.key === "ArrowUp") {
            // Move the selection up
            event.preventDefault();
            this.selectedIndex = (this.selectedIndex - 1 + suggestions.length) % suggestions.length;
            this.renderItems();
            this.scrollToSelected(suggestions);
        }

        else if (event.key === "Enter") {
            // Trigger selection if an item is selected
            if (this.selectedIndex >= 0 && this.selectedIndex < suggestions.length) {
                const selectedSuggestion = this.filteredSuggestions[this.selectedIndex];
                this.dispatchEvent(new CustomEvent('SearchBarItemClick', {
                    detail: {
                        searchItem: selectedSuggestion.item,
                        searchType: selectedSuggestion.type
                    },
                    bubbles: true
                }));
                this.closeSearchbarDropdown();
                this.input.value = ''; // Optionally clear the input after selection
            }
        }
    }


    scrollToSelected() {
        const suggestions = this.searchbarDropdown.children;

        // Get the currently selected suggestion element
        const selectedElement = suggestions[this.selectedIndex];

        if (selectedElement) {
            // Scroll the selected element into view within its container
            selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
    }
}







class SearchBarItem extends HTMLElement {
    static get observedAttributes() {
        return ['searchbar-item']
    }

    constructor() {
        super();
    }


    connectedCallback() {
        this.searchItemAttribute = JSON.parse(this.getAttribute('searchbar-item'));
        this.searchItem = this.searchItemAttribute.item;
        this.itemType = this.searchItemAttribute.type;

        this.render();

        this.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('SearchBarItemClick', {
                detail: {
                    searchItem: this.searchItem,
                    searchType: this.itemType
                },
                bubbles: true
            }))
        });
    }


    render() {
        this.innerHTML = this.initializeSearchItem();
    }


    initializeSearchItem() {
        if (this.itemType === 'note') {
            return `<i id="note-search-type" class="bi bi-file-earmark"></i> <span>${this.searchItem.name}</span>`;
        }

        else if (this.itemType === 'folder') {
            return `<i id="folder-search-type" class="bi bi-folder"></i> <span>${this.searchItem.name}</span>`;
        }

        else if (this.itemType === 'template') {
            return `<i id="template-search-type" class="bi bi-file-earmark-text"></i> <span>${this.searchItem.name}</span>`;
        }
    }
}



customElements.define('searchbar-item', SearchBarItem);
customElements.define('autocomplete-searchbar', AutocompleteSearch);
