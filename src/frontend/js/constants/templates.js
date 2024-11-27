const homeTemplate = `
    <div class="home">
        <div class="top">

        <div class="searchbar">
            <i id="search-icon" class="bi bi-search"></i>
            <input type="text" placeholder="Search..." spellcheck="false">
            <ul class="dropdown-items soft-dropdown"></ul>
        </div>
        
        </div>
        <div class="middle">
        <h1 class="view-title"></h1>
        <p class="block-title">Recent folders</p>
        <div class="recent-folders"></div>
        <p class="block-title">Your recent work</p>
        <div class="recent-notes"></div>
        <p class="block-title">Jump back in</p>
        <div class="flashcard-decks"></div>
        </div>
    </div>
`;

const notesTemplate = `
    <div class="notes-view">
    <div class="notes-top">

        <div class="searchbar">
            <i id="search-icon" class="bi bi-search"></i>
            <input type="text" placeholder="Search..." spellcheck="false">
            <ul class="dropdown-items soft-dropdown"></ul>
        </div>

    </div>
    <div class="notes-bottom">
        <div class="current-folder-name-container">
            <button class="exit-folder-btn"><i class="bi bi-chevron-left"></i></button>
            <div class="note-view-options-dropdown">
                <button><i class="bi bi-three-dots-vertical"></i></button>
                <ul class="dropdown-items soft-dropdown">
                    <li class="add-note-btn"><i class="bi bi-file-earmark"></i> Add a note</li>
                    <li class="add-folder-btn"><i class="bi bi-folder-plus"></i> Add a Folder</li>
                    <li class="view-bookmarks-btn"><i class="bi bi-bookmark"></i> View bookmarks</li>
                </ul>
            </div>
            
            <h1 class="current-folder-name view-title">Home</h1>
        </div>
        <div class="note-view-content">
            <p class="block-title" id="folders-block-title">Folders</p>
            <div class="folders"></div>
            <p class="block-title" id="notes-block-title">Notes</p>
            <div class="notes"></div>
        </div>
        
    </div>
    </div>
`;

const flashcardsTemplate = `
    <div class="flashcards-view">
        <h1 class="view-title">Flashcards</h1>
        <div class="stats-section">
            <p>Current streak: <span class="study-streak">0</span>d</p>
            <p>Time studied: <span class="hours-studied">0</span>h <span class="minutes-studied">0</span>m</p>
            <p>Total cards: <span class="flashcard-count">0</span></p>
        </div>
        <div class="deck-section">
            <h2 class="subtitle">Flashcard decks</h2>
            <button class="create-deck-btn">Add a deck</button>
            <div class="flashcard-deck-container"></div>
        </div>
    </div>
    </div>
`;

const flashcardPracticeTemplate = `
    <div class="flashcard-practice">
    <previous-view-button></previous-view-button>
        <div class="center">
            <div class="deck-section">
                <i id="previous-card-btn" class="bi bi-caret-left"></i>
                <i id="next-card-btn" class="bi bi-caret-right"></i>
                <h2 class="deck-name"></h2>
                <span class="current-card-number">1 out of 0</span>
                <div class="flashcard">
                    <div class="flashcard-content">
                    </div>
                </div>
                <div class="progress">
                    <div class="progress__fill"></div>
                </div>
                <div class="button-bar">
                    <i id="restart-btn" class="bi bi-arrow-repeat"></i>
                    <i id="wrong-btn" class="bi bi-x-lg"></i>
                    <i id="correct-btn" class="bi bi-check2"></i>
                </div>
            </div>
        </div>
    </div>
`

const flashcardEditTemplate = `
    <div class="flashcard-edit-view">
        <previous-view-button></previous-view-button>
        <h1 contenteditable="true" spellCheck="false"></h1>
        <button class="add-flashcard-btn">Add flashcard</button>

        <div class="flashcards"></div>
    </div>
`

const templatesTemplate =  `
    <div class="templates">
        <h1 class="view-title">Templates</h1>
        <div class="stats-section">
            <p>Uses: <span class="total-uses-count">0</span></p>
            <p>Templates: <span class="template-count">0</span></p>
            <p>Most used: <span class="most-used-template"></span></p>
        </div>
        <div class="recent-section">
            <p class="block-title">Recent templates</p>
            <button class="add-template-btn">Add a template</button>
            <div class="recent-templates"></div>
        </div>
        <div claa="other-section">
            <p class="block-title">Other templates</p>
            <div class="other-templates"></div>
        </div>
    </div>
`;

const stickyWallTemplate = `
    <div class="sticky-wall-view">
        <previous-view-button></previous-view-button>
        <h1>Sticky Wall</h1>
        <description-page-block></description-page-block>
        <div class="sticky-wall">
            <button class="add-sticky-btn"><i class="fa-solid fa-plus"></i></button>
        </div>
    </div>
`


const stickyNoteHomeTemplate = `
    <div class="sticky-home-view">
        <h1 class="view-title">Sticky walls</h1>
        <p class="context-text">Create sticky walls to jot down quick thoughts, capture ideas on the fly, and keep track of your brainstorming sessions effortlessly</p>
        <div class="sticky-walls">
            <div class="util-bar-type-2">
                <button class="add-sticky-wall-btn"><i class="fa-solid fa-plus"></i></button>
            </div>
            <div class="sticky-wall-cards"></div>
        </div>
    </div>
`


const settingsTemplate = `
    <div class="settings">
        <h1 class="view-title">Settings</h1>
        <div class="settings-container">
            <div>
                <h3>Theme</h3>
                <p>Select a theme</p>
                <div class="theme-dropdown">
                    <input type="text" spellcheck="false" placeholder="Theme" class="theme-input">
                    <ul class="dropdown-items">
                        <li theme="light">Light</li>
                        <li theme="dark">Dark</li>
                    </ul>
                </div>
            </div>

            <div>
                <h3>Sidebar</h3>
                <p>Select a sidebar color</p>
                <div class="sidebar-color-dropdown">
                    <input type="text" spellcheck="false" placeholder="Sidebar color" class="sidebar-color-input">
                    <ul class="dropdown-items">
                        <li color="original">Original</li>
                        <li color="soft">Soft</li>
                    </ul>
                </div>
            </div>

            <div>
                <h3>Widget style</h3>
                <p>Select a widget style</p>
                <div class="widget-style-dropdown">
                    <input type="text" spellcheck="false" placeholder="Widget style" class="widget-style-input">
                    <ul class="dropdown-items">
                        <li widgetStyle="border">Border</li>
                        <li widgetStyle="shadow">Shadow</li>
                    </ul>
                </div>
            </div>
        </div>
            
    </div>
`;

const editorTemplate = `
    <div class="editor-wrapper">
      <div class="toolbar">
        <div class="toolbar-top">
          <i id="exit-editor-btn" class="bi bi-arrow-left"></i>
          <div class="recently-viewed-notes-dropdown">
            <i id="recently-viewed-notes-btn" class="bi bi-clock-history"></i>
            <div class="options"></div>
          </div>
          <p class="document-location"></p>
          <div class="save-note-btn">Save</div>
          
          <div class="editor-options-dropdown">
            <i id="editor-options-btn" class="bi bi-three-dots-vertical"></i>
            <div class="options">
              <button class="new-note-span"><i class="bi bi-plus-lg"></i>New</button>
              <button class="save-note-span"><i class="bi bi-save"></i>Save</button>
              <button class="delete-note-span"><i class="bi bi-trash3"></i>Delete</button>
              <button class="note-details-span"><i class="bi bi-info-circle"></i>Details</button>
            </div>
          </div>

        </div>
        <div class="toolbar-bottom">
          <input class="note-name-input" type="text" placeholder="Untitled" spellcheck="false">
        </div>
        
      </div>
      <div class="editor">
        <div class="editor-paper" contenteditable="true" spellcheck="false"></div>
      </div>

      <div class="editor-util-btns-container">
        <i id="editor-flashcard-set-btn" class="bi bi-card-text"></i>
      </div>

      
      <rich-text-bar></rich-text-bar>
      <slash-command-container></slash-command-container>
      
    
    </div>
`

export const templates = {
    home: homeTemplate,
    notes: notesTemplate,
    flashcardsHome: flashcardsTemplate,
    flashcardsPractice: flashcardPracticeTemplate,
    flashcardEdit: flashcardEditTemplate,
    templates: templatesTemplate,
    stickyWall: stickyWallTemplate,
    stickyWallHome: stickyNoteHomeTemplate,
    settings: settingsTemplate,
    editor: editorTemplate
}