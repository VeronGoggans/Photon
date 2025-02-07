const homeTemplate = `
    <div class="home-view">
        <div class="top">
            
            <autocomplete-searchbar></autocomplete-searchbar>
        </div>
        <div class="middle">
            <h1 class="view-title"></h1>
            <p class="block-title">Recent folders</p>
        <div class="recent-folders"></div>
            <p class="block-title">Your recent work</p>
        <div class="recent-notes"></div>
            
    </div>
`;

const notesTemplate = `
    <div class="notes-view">
    <div class="notes-top">
    
        <div class="current-folder-options-container">
            <button class="exit-folder-btn"><i class="bi bi-chevron-left"></i></button>
            <div class="note-view-options-dropdown">
                <button><i class="bi bi-three-dots-vertical"></i></button>
                <ul class="dropdown-items soft-dropdown">
                    <span class="note-view-options-dropdown-section">Document</span>
                    <li class="add-note-btn"><i class="bi bi-file-earmark"></i> Create a note</li>
                    <li class="view-bookmarks-btn"><i class="bi bi-bookmarks"></i> Show bookmarks</li>
                    <span class="note-view-options-dropdown-section">Folder</span>
                    <li class="add-folder-btn"><i class="bi bi-folder-plus"></i> Create a folder</li>
                    <li class="edit-current-folder-btn"><i class="bi bi-pen"></i> Edit current folder</li>
                    <li class="pin-current-folder-btn"><i class="bi bi-pin"></i> Pin current folder</li>
                    <li class="export-current-folder-btn"><i class="bi bi-box-seam"></i> Export current folder</li>
                    <span class="note-view-options-dropdown-section">Other</span>
                    <li class="add-category-btn"><i class="bi bi-inboxes"></i> Create a category</li>
                </ul>
            </div>
            <div class="current-folder-name-container">
                <h1 class="current-folder-name view-title">Home</h1>
                <div id="folder-color-circle"></div>
            </div>
            
        </div>
        <autocomplete-searchbar></autocomplete-searchbar>

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
                        <li color="shadow">Shadow</li>
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
          
          <div class="toolbar-top-right">
            <div class="cycle-container">
                <i id="load-previous-note-btn" class="bi bi-caret-left"></i>
                <i id="load-next-note-btn" class="bi bi-caret-right"></i>
            </div>
            <div class="editor-options-dropdown">
            <i id="editor-options-btn" class="bi bi-three-dots-vertical"></i>
            <div class="options">
              <button class="new-note-span"><i class="bi bi-plus-lg"></i>New</button>
              <button class="delete-note-span"><i class="bi bi-trash3"></i>Delete</button>
              <button class="note-details-span"><i class="bi bi-info-circle"></i>Details</button>
            </div>
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

      <rich-text-bar></rich-text-bar>
    </div>
`



export const templates = {
    home: homeTemplate,
    notes: notesTemplate,
    settings: settingsTemplate,
    editor: editorTemplate
}