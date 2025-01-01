export const editFolderModalTemplate = `
<h2>New folder</h2>
<div class="folder-settings">
    <span id="title">Folder name</span>
    <p>You can change the name of the folder below</p>
    <input type="text" placeholder="Untitled" spellcheck="false">

    <span id="title">Folder color</span>
    <p>Select a color for this folder</p>
    <div class="folder-color-options">
        <div style="background-color: rgb(121, 144, 255)" data-folder-css-class="color-blue-1"></div>
        <div style="background-color: rgb(169, 215, 255)" data-folder-css-class="color-blue-2"></div>
        <div style="background-color: rgb(217, 237, 255)" data-folder-css-class="color-blue-3"></div>
        <div style="background-color: rgb(124, 199, 211)"  data-folder-css-class="color-blue-4"></div>
        <div style="background-color: rgb(158, 213, 197)" data-folder-css-class="color-green-1"></div>
        <div style="background-color: rgb(203, 255, 197)" data-folder-css-class="color-green-2"></div>
        <div style="background-color: rgb(173, 255, 164)" data-folder-css-class="color-green-3"></div>
        <div style="background-color: rgb(142, 122, 181)" data-folder-css-class="color-purple-1"></div>
        <div style="background-color: rgb(223, 193, 255)" data-folder-css-class="color-purple-2"></div>
        <div style="background-color: rgb(255, 163, 163)" data-folder-css-class="color-red-1"></div>
        <div style="background-color: rgb(255, 197, 197)" data-folder-css-class="color-red-2"></div>
        <div style="background-color: rgb(255, 182, 116)" data-folder-css-class="color-orange-1"></div>
        <div style="background-color: rgb(255, 224, 158)" data-folder-css-class="color-orange-2"></div>
        <div class="color-original" style="background-color: #fff" data-folder-css-class="color-original"></div>
    </div>
    <div class="buttons-container">
        <button class="modal-cancel-button cancel-btn">Cancel</button>
        <button class="modal-confirm-button save-btn">Add folder</button>
    </div>
</div>
`

export const newStickyBoardModalTemplate = `
<h2>New sticky board</h2>
<div class="board-settings">
    <span id="title">Sticky board name</span>
    <p>You can change the name of the sticky board below</p>
    <input type="text" class="sticky-board-title" placeholder="Untitled">
    <span id="title">Sticky board type</span>
    <p>Select a type for your new sticky board</p>
</div>
<div class="board-types">
    <div class="type-one selected-board-type">
        <i class="bi bi-stickies"></i>
        <span>Standard</span>
    </div>
    <div class="type-two">
        <i class="bi bi-layout-three-columns"></i>
        <span>Column</span>
    </div>
</div>
<div class="buttons-container">
    <button class="modal-cancel-button cancel-btn">Cancel</button>
    <button class="modal-confirm-button save-btn">Create</button>
</div>
`


export const deleteModalTemplate = `
<i class="bi bi-trash3"></i>        
<p>Type <b></b> to confirm</p>
<span>Do note that this action is permanent</span>
<input type="text" spellcheck="false">
<div class="button-container">
    <button class="modal-cancel-button cancel-btn">Cancel</button>
    <button class="modal-confirm-button delete-btn">Confirm</button>
</div>
`