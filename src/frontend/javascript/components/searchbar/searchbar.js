class AutocompleteSearch extends HTMLElement {
    constructor() {
        super();
        this.selectedIndex = -1;
        this.currentSuggestions = [];
    }

    connectedCallback() {
        this.render();
        this.eventListeners();
    }

    render() {
        this.innerHTML = `
          <div class="searchbar">
            <i id="search-icon" class="bi bi-search"></i>
            <input type="text" placeholder="Search..." spellcheck="false">
            <ul class="dropdown-items"></ul>
          </div>
        `;
    }



    eventListeners() {
        const input = this.querySelector('input[type="text"]');
        input.addEventListener("input", (event) => this.handleInput(event));
        input.addEventListener("keydown", (event) => this.handleKeyDown(event));
    }



    fillSearchbar(searchType, searchItems) {
        if (searchItems.length > 0) {
            for (let searchItem of searchItems) {
                this.addSearchItem(searchType, searchItem)
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



    handleInput(event) {
        const inputValue = event.target.value.toLowerCase();
        this.currentSuggestions = this.getSuggestions(inputValue);
        this.displaySuggestions(inputValue);
        this.selectedIndex = -1; // Reset index on input change
    }



    handleKeyDown(event) {
        const input = this.querySelector('input[type="text"]');

        if (event.key === "Enter") {
            event.preventDefault();
            if (this.selectedIndex >= 0 && this.currentSuggestions[this.selectedIndex]) {
                input.value = this.currentSuggestions[this.selectedIndex].text;
                this.clearSuggestions();
            } else if (this.currentSuggestions.length > 0) {
                input.value = this.currentSuggestions[0].text;
                this.clearSuggestions();
            }
        }

        if (event.key === "ArrowDown") {
            event.preventDefault();
            if (this.selectedIndex < this.currentSuggestions.length - 1) {
                this.selectedIndex++;
                this.updateHighlightedSuggestion();
            }
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();
            if (this.selectedIndex > 0) {
                this.selectedIndex--;
                this.updateHighlightedSuggestion();
            } else {
                this.selectedIndex = -1;
                this.updateHighlightedSuggestion();
            }
        }
    }



    getSuggestions(query) {
        if (!query) return [];

        return this.searchItems.filter(item => item.toLowerCase().includes(query))
            .map(item => ({ text: item, match: this.getHighlightedText(item, query) }));
    }



    getHighlightedText(text, query) {
        const index = text.toLowerCase().indexOf(query);
        if (index === -1) return text; // No match found

        // Highlight the part of the suggestion that matches the query
        const before = text.slice(0, index);
        const match = text.slice(index, index + query.length);
        const after = text.slice(index + query.length);

        return `${before}<span class="highlight">${match}</span>${after}`;
    }



    displaySuggestions() {
        const suggestionsDiv = this.querySelector(".dropdown-items");
        suggestionsDiv.innerHTML = ""; // Clear previous suggestions

        this.currentSuggestions.forEach((suggestion, index) => {
            const li = document.createElement("li");
            li.innerHTML = suggestion.match; // Insert the highlighted text
            if (index === this.selectedIndex) {
                li.classList.add("highlighted");
            }
            li.addEventListener("mousedown", () => {
                this.querySelector('input[type="text"]').value = suggestion.text;
                this.clearSuggestions();
            });
            suggestionsDiv.appendChild(li);
        });

        suggestionsDiv.style.display = this.currentSuggestions.length > 0 ? "block" : "none";
    }



    updateHighlightedSuggestion() {
        const suggestionItems = this.querySelectorAll(".dropdown-items li");
        suggestionItems.forEach((item, index) => {
            if (index === this.selectedIndex) {
                item.classList.add("highlighted");
            } else {
                item.classList.remove("highlighted");
            }
        });
    }



    clearSuggestions() {
        this.querySelector(".dropdown-items").innerHTML = "";
        this.currentSuggestions = [];
        this.selectedIndex = -1;
    }
}



customElements.define('autocomplete-searchbar', AutocompleteSearch);
