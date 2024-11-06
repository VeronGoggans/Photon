const homeTemplate = `
    <div class="home">
        <div class="top">

        <div class="searchbar">
            <i id="search-icon" class="bi bi-search"></i>
            <input type="text" placeholder="Search..." spellcheck="false">
            <ul class="dropdown-items"></ul>
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
            <ul class="dropdown-items"></ul>
        </div>

    </div>
    <div class="notes-bottom">
        <div class="current-folder-name-container">
            <h1 class="current-folder-name view-title">Home</h1>
            <div>
                <button title="Back" class="exit-folder-btn"><i class="bi bi-backspace-fill"></i></button>
                <button title="Create folder" class="create-folder-btn"><i class="bi bi-folder-fill"></i></button>
                <button title="Create note" class="create-note-btn"><i class="bi bi-file-earmark-fill"></i></button>
                <button title="Return home" class="home-folder-btn"><i class="bi bi-house-fill"></i></button>
                <button title="Show bookmarks" class="bookmarks-btn"><i class="bi bi-bookmark-fill"></i></button>
            </div>
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
            <h2 class="subtitle">Recent templates</h2>
            <button class="add-template-btn">Add a template</button>
            <div class="recent-templates"></div>
        </div>
        <div claa="other-section">
            <h2 class="subtitle">Other templates</h2>
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
    <div class="center">
        <h1 class="view-title">Settings</h1>
        <div class="settings-container">
            <h3>Theme</h3>
            <p>Select a theme</p>
            <div class="theme-dropdown">
                <input type="text" spellcheck="false" placeholder="Theme" class="theme-input">
                <ul class="dropdown-items">
                    <li theme="light">Light</li>
                    <li theme="dark">Dark</li>
                </ul>
            </div>

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
    </div>
    </div>
`;

const editorTemplate = `
    <div class="editor-wrapper">
      <div class="toolbar">
        <div class="toolbar-top">
          <i id="exit-editor-btn" class="bi bi-arrow-left"></i>
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

        <div class="templates-dropdown">
            <i id="editor-template-btn" class="fa-solid fa-file-lines"></i>
            <div class="options">
            <span>Templates</span>
            <ul class="templates-container">
            </ul>
            </div>
        </div>

        <i id="editor-flashcard-set-btn" class="bi bi-card-text"></i>
      </div>

      <div class="rich-text-option-container">
        <div class="btn-group">
            <button id="boldBtn" onclick="formatText('bold')"><i class="bi bi-type-bold"></i></button>
            <button id="italicBtn" onclick="formatText('italic')"><i class="bi bi-type-italic"></i></button>
            <button id="underlineBtn" onclick="formatText('underline')"><i class="bi bi-type-underline"></i></button>
            <button id="strikeBtn" onclick="formatText('strikethrough')"><i class="bi bi-type-strikethrough"></i></button>
            <button onclick="formatText('createLink')"><i class="bi bi-link-45deg"></i></button>
        </div>
        <div class="btn-group">
            <button onclick="formatText('justifyLeft')"><i class="bi bi-text-left"></i></button>
            <button id="centerAlignBtn" onclick="formatText('justifyCenter')"><i class="bi bi-text-center"></i></button>
            <button id="rightAlignBtn" onclick="formatText('justifyRight')"><i class="bi bi-text-right"></i></button>
        </div>
        <div class="btn-group">
            <button onclick="formatText('insertUnorderedList')"><i class="bi bi-list-task"></i></button>
            <button onclick="formatText('insertOrderedList')"><i class="bi bi-list-ol"></i></button>
        </div>
        <div class="btn-group">
            <button onclick="formatText('removeFormat')"><i class="fa-solid fa-text-slash" style="font-size: 15px;"></i></button>
        </div>
        <div class="btn-group">
            <div class="color-dropdown">
                <button><i class="bi bi-eyedropper"></i></button>
                <ul>
                    <li style="background-color: #ff0000"></li>
                    <li style="background-color: #0000ff"></li>
                    <li style="background-color: #ffff00"></li>
                    <li style="background-color: #008000"></li>
                    <li style="background-color: #800080"></li>
                    <li style="background-color: #ffa500"></li>
                    <li style="background-color: #ffc0cb"></li>

                    <li style="background-color: #ff5555"></li>
                    <li style="background-color: #4e6eff"></li>
                    <li style="background-color: #ffff4f"></li>
                    <li style="background-color: #39dd39"></li>
                    <li style="background-color: #e632e6"></li>
                    <li style="background-color: #ffb938"></li>
                    <li style="background-color: #ffd0d8"></li>

                    <li style="background-color: #ff8383"></li>
                    <li style="background-color: #849bff"></li>
                    <li style="background-color: #ffff7d"></li>
                    <li style="background-color: #81ff81"></li>
                    <li style="background-color: #ff82ff"></li>
                    <li style="background-color: #ffcf78"></li>
                    <li style="background-color: #ffdce2"></li>

                    <li style="background-color: #ffbaba"></li>
                    <li style="background-color: #b3c1ff"></li>
                    <li style="background-color: #ffffb2"></li>
                    <li style="background-color: #b4ffb4"></li>
                    <li style="background-color: #ffaeff"></li>
                    <li style="background-color: #ffdea0"></li>
                    <li style="background-color: #ffe9ed"></li>
                </ul>
            </div>
        </div>
      </div>

      <div class="foreward-slash-command-container">
        <input type="text" placeholder="Command..." spellcheck="false">
        <div class="commands">
            <div class="link-option"><i class="fa-solid fa-link"></i>Add a url</div>
            <div class="embed-video-option"><i class="fa-solid fa-play"></i>Add a video</div>
            <div class="horizontal-line-option"><i class="fa-solid fa-ruler-horizontal"></i>Add a horizontal line</div>
            <div class="quote-block"><i class="fa-solid fa-quote-right"></i>Quote block</div>   
            <div class="important-block"><i class="fa-solid fa-exclamation"></i>Important block</div>   
            <div class="unordered-list"><i class="fa-solid fa-list-ul"></i>Bullet list</div>
            <div class="ordered-list"><i class="fa-solid fa-list-ol"></i>Numbered list</div> 
            <div class="heading-1"><i class="fa-solid fa-h"></i>Add heading 1</div>
            <div class="heading-2"><i class="fa-solid fa-h"></i>Add heading 2</div>
            <div class="heading-3"><i class="fa-solid fa-h"></i>Add heading 3</div>
            <div class="heading-4"><i class="fa-solid fa-h"></i>Add heading 4</div>
            <div class="date"><i class="fa-regular fa-calendar"></i>Current date</div>
            <div class="insert-html"><i class="fa-brands fa-html5"></i>Insert HTML</div>
        </div>
    </div>
    
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