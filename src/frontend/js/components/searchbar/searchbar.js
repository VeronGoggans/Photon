import { Trie } from "../../datastuctures/trie";


class SearchBar extends HTMLElement {
    constructor() {
        super();
        this.trie = new Trie();
        this.selectedIndex = -1; // Keeps track of the currently highlighted suggestion
        this.currentSuggestions = []; // Stores the current list of suggestions
    }

    connectedCallback() {
        this.render();
        this.addEventListeners();
    }

    render() {
        this.innerHTML = `
            <i id="search-icon" class="bi bi-search"></i>
            <input type="text" placeholder="Search..." spellcheck="false">
            <span id="autocomplete"></span>
            <ul class="dropdown-items"></ul>
        `;
    }

    fill(searchType, searchObjects) {        
        if (searchObjects.length > 0) {
            for (let i = 0; i < searchObjects.length; i++) {
                this.addSearchItem(searchType, searchObjects[i])  
            }
        } 
    }

    addItem(searchType, searchObject) {
        this.searchItems.push({ type: searchType, object: searchObject});
    }

    deleteItem(searchObjectId) {
        this.searchItems = this.searchItems.filter(obj => obj.object.id !== searchObjectId);
    }

    updateItem(searchObjectId, newName) {
        const option = this.searchItems.find(obj => obj.object.id === searchObjectId);
        option.name = newName;
    }

    // Method to get suggestions based on prefix
    getSuggestions(prefix) {
        return trie.searchPrefix(prefix);
    }

    addEventListeners() {
        this.querySelector('input', (event) => {this.handleInput(event)});
    }

    // Event listener for search bar input
    handleInput(event) {
        const prefix = event.target.value;
        this.currentSuggestions = getSuggestions(prefix); // Update current suggestions
        displaySuggestions(this.currentSuggestions);
        showAutoComplete(prefix, this.currentSuggestions);
        this.selectedIndex = -1; // Reset index whenever input changes
    }

    handleKeyInput(event) {
        const searchBar = this.querySelector('input');
  
        if (event.key === "Enter") {
            event.preventDefault();
            if (this.selectedIndex >= 0 && this.currentSuggestions[this.selectedIndex]) {
                searchBar.value = this.currentSuggestions[this.selectedIndex];
                this.clearSuggestions();
            } 
            else if (this.currentSuggestions.length > 0) {
                searchBar.value = this.currentSuggestions[0];
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
            } 
            else {
                this.selectedIndex = -1;
                this.updateHighlightedSuggestion();
            }
        }
    };
  
    showAutoComplete(prefix, suggestions) {
        const autocompleteSpan = this.querySelector('#autocomplete');
  
        if (suggestions.length > 0) {
            const firstSuggestion = suggestions[0];
            const leftover = firstSuggestion.slice(prefix.length);
            autocompleteSpan.textContent = prefix + leftover;
        } 
        else {
            autocompleteSpan.textContent = '';
        }
    }
  
    displaySuggestions(suggestions) {
        const suggestionsDiv = this.querySelector('ul');
        suggestionsDiv.innerHTML = ''; // Clear previous suggestions
        
        suggestions.forEach((suggestion, index) => {
            const suggestionElement = document.createElement('li');
            let content = '';
            
        

            if (index === this.selectedIndex) {
                div.classList.add('highlighted');
            }
            div.addEventListener('mousedown', () => {
                this.querySelector('input').value = suggestion;
                this.clearSuggestions();
            });
            suggestionsDiv.appendChild(div);
        });
  }

    renderItems(searchItems) { 
        const suggestionsDiv = this.querySelector('ul').innerHTML = '';
        searchItems.forEach(suggestion => {
            const suggestionElement = document.createElement('li');
            let content = '';

            if (suggestion.type === 'note') {
                content = `<i id="note-search-type" class="fa-solid fa-file"></i> ${suggestion.object.name}`;
                suggestionElement.dataset.searchType = 'note'
            } 
            else if (suggestion.type === 'folder') {
                content = `<i id="folder-search-type" class="bi bi-folder-fill"></i> ${suggestion.object.name}`;
                suggestionElement.dataset.searchType = 'folder'
            } 
            else if (suggestion.type === 'template') {
                content = `<i id="template-search-type" class="bi bi-file-earmark-text-fill"></i> ${suggestion.object.name}`;
                suggestionElement.dataset.searchType = 'template'
            } 
            else if (suggestion.type === 'flashcard') {
                content = `<i id="flashcard-search-type" class="bi bi-card-text"></i> ${suggestion.object.name}`;
                suggestionElement.dataset.searchType = 'flashcard'
            }

            suggestionElement.innerHTML = content;
            suggestionElement.id = suggestion.object.id;
            suggestionsDiv.appendChild(suggestionElement);
        })
    }
  
    updateHighlightedSuggestion() {
        const suggestionItems = this.querySelectorAll('li');

        suggestionItems.forEach((item, index) => {
        if (index === this.selectedIndex) {
            item.classList.add("highlighted");
        } 
        else {
            item.classList.remove("highlighted");
        }});
    }
  
    clearSuggestions() {
        this.querySelector('ul').innerHTML = "";
        this.querySelector('#autocomplete').textContent = "";
        this.currentSuggestions = [];
        this.selectedIndex = -1;
    }
}

// SearchBar.js
class SearchBar extends HTMLElement {
  constructor() {
    super();
    // Trie instance
    this.trie = new Trie();
    ['Project', 'Personal', 'Programming', 'Proactive', 'Product', 'Promotion'].forEach(word => this.trie.insert(word));

    // State variables
    this.suggestions = [];
    this.selectedIndex = -1;

    // Bind methods
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.renderSuggestions = this.renderSuggestions.bind(this);

    // Initial render
    this.render();
  }

  connectedCallback() {
    this.querySelector('#search-input').addEventListener('input', this.handleInputChange);
    this.shadowRoot.querySelector('#search-input').addEventListener('keydown', this.handleKeyDown);
    this.shadowRoot.querySelector('#suggestions').addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('suggestion-item')) {
        this.selectSuggestion(e.target.innerText);
      }
    });
  }

  disconnectedCallback() {
    this.shadowRoot.querySelector('#search-input').removeEventListener('input', this.handleInputChange);
    this.shadowRoot.querySelector('#search-input').removeEventListener('keydown', this.handleKeyDown);
  }

  handleInputChange(event) {
    const prefix = event.target.value;
    this.suggestions = prefix ? this.trie.searchPrefix(prefix) : [];
    this.selectedIndex = -1;
    this.renderSuggestions();

    // Update the autocomplete ghost text
    const autocomplete = this.shadowRoot.querySelector('#autocomplete');
    autocomplete.innerText = this.suggestions.length > 0 ? prefix + this.suggestions[0].slice(prefix.length) : '';
  }

  handleKeyDown(event) {
    const suggestionItems = Array.from(this.shadowRoot.querySelectorAll('.suggestion-item'));
    if (event.key === 'Enter') {
      event.preventDefault();
      if (this.selectedIndex >= 0 && this.suggestions[this.selectedIndex]) {
        this.selectSuggestion(this.suggestions[this.selectedIndex]);
      } else if (this.suggestions.length > 0) {
        this.selectSuggestion(this.suggestions[0]);
      }
    } else if (event.key === 'ArrowDown') {
      this.selectedIndex = (this.selectedIndex + 1) % this.suggestions.length;
      this.highlightSuggestion(suggestionItems);
    } else if (event.key === 'ArrowUp') {
      this.selectedIndex = (this.selectedIndex - 1 + this.suggestions.length) % this.suggestions.length;
      this.highlightSuggestion(suggestionItems);
    }
  }

  selectSuggestion(value) {
    const input = this.shadowRoot.querySelector('#search-input');
    input.value = value;
    this.suggestions = [];
    this.renderSuggestions();
    this.shadowRoot.querySelector('#autocomplete').innerText = ''; // Clear autocomplete on selection
  }

  highlightSuggestion(suggestionItems) {
    suggestionItems.forEach((item, index) => {
      item.classList.toggle('highlighted', index === this.selectedIndex);
    });
  }

  renderSuggestions() {
    const suggestionsContainer = this.shadowRoot.querySelector('#suggestions');
    suggestionsContainer.innerHTML = this.suggestions.map((suggestion, index) =>
      `<div class="suggestion-item ${index === this.selectedIndex ? 'highlighted' : ''}">${suggestion}</div>`
    ).join('');
  }

  render() {
    this.shadowRoot.innerHTML = `
      <div id="search-bar">
        <input type="text" id="search-input" placeholder="Search..." autocomplete="off" />
        <div id="autocomplete"></div>
        <div id="suggestions"></div>
      </div>
    `;
  }
}

customElements.define('search-bar', SearchBar);
