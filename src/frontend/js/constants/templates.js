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
        <h1 class="view-title"><div class="time-of-day-art"></div></h1>
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
    
        <div class="current-folder-name-container">
            <button class="exit-folder-btn"><i class="bi bi-chevron-left"></i></button>
            <div class="note-view-options-dropdown">
                <button><i class="bi bi-three-dots-vertical"></i></button>
                <ul class="dropdown-items soft-dropdown">
                    <li class="add-note-btn"><i class="bi bi-file-earmark"></i> Add a note</li>
                    <li class="add-folder-btn"><i class="bi bi-folder-plus"></i> Add a Folder</li>
                    <li class="view-bookmarks-btn"><i class="bi bi-bookmarks"></i> View bookmarks</li>
                </ul>
            </div>
            
            <h1 class="current-folder-name view-title">Home</h1>
        </div>

        <div class="searchbar">
            <i id="search-icon" class="bi bi-search"></i>
            <input type="text" placeholder="Search..." spellcheck="false">
            <ul class="dropdown-items soft-dropdown"></ul>
        </div>

    </div>
    <div class="notes-bottom">
        
        <div class="note-view-content">
            <p class="block-title" id="folders-block-title">Folders</p>
            <div class="folders"></div>
            <p class="block-title" id="notes-block-title">Documents</p>
            <div class="notes"></div>
        </div>
        
    </div>
    </div>
`;



const standardStickyBoardTemplate = `
    <div class="standard-sticky-board-view">
        <div class="sticky-board-name-container">
            <button class="exit-sticky-board-btn"><i class="bi bi-chevron-left"></i></button>
            <h2 contenteditable="true" spellcheck="false">Brainstorm Pomodoro features</h2>
        </div>
        <p class="description" contenteditable="true" spellcheck="false">Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae, in quos? Ab suscipit perspiciatis obcaecati vel iure vitae corporis veniam quas! Mollitia eos tempore ipsam doloribus hic. Laborum, enim praesentium.</p>
        <div class="standard-sticky-board-wrapper">
            <div class="sticky-small"><p>hello</p></div>
            <div class="sticky-long"></div>
            <div class="sticky-small"></div>
            <div class="sticky-wide"></div> 
            <div class="sticky-small"><p>hello</p></div>
            <div class="sticky-long"></div>
            <div class="sticky-small"></div>
            <div class="sticky-wide"></div> 
        </div>
        <button class="add-sticky-btn"><i class="bi bi-pencil"></i></button>
      </div>
`


const columnStickyBoardTemplate = `
    <div class="wrapper">
    <h2 contenteditable="true" spellcheck="false">Sticky wall</h2>
    <p class="description" contenteditable="true" spellcheck="false">Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae, in quos? Ab suscipit perspiciatis obcaecati vel iure vitae corporis veniam quas! Mollitia eos tempore ipsam doloribus hic. Laborum, enim praesentium.</p>
    <div class="board-wrapper">

      <div class="board-section">
        <div class="board-section-top">
          <input type="text" class="board-section-name" placeholder="Section name">
          <i class="bi bi-three-dots-vertical"></i>
        </div>
        <div class="stickies-container">
            <p class="no-stickies-message">No stickies here</p>
        </div>
        <button><i class="bi bi-plus-lg"></i></button> 
      </div>

      <div class="board-section">
        <div class="board-section-top">
          <input type="text" class="board-section-name" placeholder="Section name">
          <i class="bi bi-three-dots-vertical"></i>
        </div>
        <div class="stickies-container">
            <p class="no-stickies-message">No stickies here</p>
        </div>
        <button><i class="bi bi-plus-lg"></i></button> 
      </div>

      <div class="board-section">
        <div class="board-section-top">
          <input type="text" class="board-section-name" placeholder="Section name">
          <i class="bi bi-three-dots-vertical"></i>
        </div>
        <div class="stickies-container">
          <p class="no-stickies-message">No stickies here</p>
        </div>
        <button><i class="bi bi-plus-lg"></i></button> 
      </div>
    </div>
  </div>
`


const stickyNoteHomeTemplate = `
    <div class="sticky-home-view">
        <h1 class="view-title">Sticky walls</h1>
        <div class="sticky-presentation">
            <div class="sticky-image-container">
                <div class="pin"></div>
                <div class="sticky-one"></div>
                <div class="sticky-two">
                    <div class="line" style="width: 50%;"></div>
                    <div class="line" style="width: 70%;"></div>
                    <div class="line" style="width: 60%;"></div>
                </div>
            </div>
            <div class="presentation-text-container">
                <p class="context-text">Create sticky walls to jot down quick thoughts, capture ideas on the fly, and keep track of your brainstorming sessions effortlessly</p>
                <button class="add-sticky-board-btn">Create a board</button>
            </div>
        </div>
        <p id="standard-sticky-boards-block-title" class="block-title">Standard boards</p>
        <div id="standard-boards" class="sticky-boards"></div>

        <p id="column-sticky-boards-block-title" class="block-title">Column boards</p>
        <div id="column-boards" class="sticky-boards"></div>
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
                        <li color="invisible">Invisible</li>
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
            
            <div>
                <h3>Icon color</h3>
                <p>Select a folder icon color</p>
                <div class="folder-icon-color-dropdown">
                    <input type="text" spellcheck="false" placeholder="Folder icon color" class="folder-icon-color-input">
                    <ul class="dropdown-items">
                        <li iconColor="blue">Blue</li>
                        <li iconColor="gray">Gray</li>
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
            <div class="options" id="recently-viewed-notes-dropdown"></div>
          </div>
          <p class="document-location"></p>
          
          <div class="editor-options-dropdown">
            <i id="editor-options-btn" class="bi bi-three-dots-vertical"></i>
            <div class="options">
              <button class="new-note-span"><i class="bi bi-plus-lg"></i>New</button>
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
      </div>

      <rich-text-bar></rich-text-bar>
      <slash-command-container></slash-command-container>
    </div>
`



export const templates = {
    home: homeTemplate,
    notes: notesTemplate,
    standardStickyBoard: standardStickyBoardTemplate,
    columnStickyBoard: columnStickyBoardTemplate,
    stickyWallHome: stickyNoteHomeTemplate,
    settings: settingsTemplate,
    editor: editorTemplate
}