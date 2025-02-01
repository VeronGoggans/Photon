


export const folderColorOptionsTemplate = `
    <div class="color-option-wrapper">
        <div id="color-option" style="background-color: rgb(121, 144, 255)" data-entity-css-class="color-blue-1"></div>
    </div>
    <div class="color-option-wrapper">
        <div id="color-option" style="background-color: rgb(169, 215, 255)" data-entity-css-class="color-blue-2"></div>
    </div>
    <div class="color-option-wrapper">
         <div id="color-option" style="background-color: rgb(217, 237, 255)" data-entity-css-class="color-blue-3"></div>
    </div>
    <div class="color-option-wrapper">
       <div id="color-option" style="background-color: rgb(124, 199, 211)"  data-entity-css-class="color-blue-4"></div>
    </div>
    <div class="color-option-wrapper">
        <div id="color-option" style="background-color: rgb(158, 213, 197)" data-entity-css-class="color-green-1"></div>
    </div>
    <div class="color-option-wrapper">
       <div id="color-option" style="background-color: rgb(203, 255, 197)" data-entity-css-class="color-green-2"></div>
    </div>
    <div class="color-option-wrapper">
        <div id="color-option" style="background-color: rgb(173, 255, 164)" data-entity-css-class="color-green-3"></div>
    </div>
    <div class="color-option-wrapper">
        <div id="color-option" style="background-color: rgb(142, 122, 181)" data-entity-css-class="color-purple-1"></div>
    </div>
    <div class="color-option-wrapper">
        <div id="color-option" style="background-color: rgb(223, 193, 255)" data-entity-css-class="color-purple-2"></div>
    </div>
    <div class="color-option-wrapper">
        <div id="color-option" style="background-color: rgb(255, 163, 163)" data-entity-css-class="color-red-1"></div>
    </div>
    <div class="color-option-wrapper">
        <div id="color-option" style="background-color: rgb(255, 197, 197)" data-entity-css-class="color-red-2"></div>
    </div>
    <div class="color-option-wrapper">
        <div id="color-option" style="background-color: rgb(255, 182, 116)" data-entity-css-class="color-orange-1"></div>
    </div>
    <div class="color-option-wrapper">
        <div id="color-option" style="background-color: rgb(255, 224, 158)" data-entity-css-class="color-orange-2"></div>
    </div>
    <div class="color-option-wrapper">
        <div id="color-option" class="color-original" style="background-color: #f6f6f9; border-color: var(--border-card)" data-entity-css-class="color-original"></div>
    </div>
`



export const categoryColorOptionsTemplate = `
    <div class="color-option-wrapper">
        <div id="color-option" style="background-color: rgb(99,118,231)" data-entity-css-class="color-blue-1"></div>
    </div>
    <div class="color-option-wrapper">
        <div id="color-option" style="background-color: rgb(128,145,246)" data-entity-css-class="color-blue-2"></div>
    </div>
    <div class="color-option-wrapper">
         <div id="color-option" style="background-color: rgb(211,217,255)" data-entity-css-class="color-blue-3"></div>
    </div>
    <div class="color-option-wrapper">
       <div id="color-option" style="background-color: rgb(204,224,255)"  data-entity-css-class="color-blue-4"></div>
    </div>
    <div class="color-option-wrapper">
        <div id="color-option" style="background-color: rgb(140,236,141)" data-entity-css-class="color-green-1"></div>
    </div>
    <div class="color-option-wrapper">
       <div id="color-option" style="background-color: rgb(177,255,177)" data-entity-css-class="color-green-2"></div>
    </div>
    <div class="color-option-wrapper">
        <div id="color-option" style="background-color: rgb(203,255,203)" data-entity-css-class="color-green-3"></div>
    </div>
    <div class="color-option-wrapper">
        <div id="color-option" style="background-color: rgb(209,177,255)" data-entity-css-class="color-purple-1"></div>
    </div>
    <div class="color-option-wrapper">
        <div id="color-option" style="background-color: rgb(230,212,255)" data-entity-css-class="color-purple-2"></div>
    </div>
    <div class="color-option-wrapper">
        <div id="color-option" style="background-color: rgb(255,172,172)" data-entity-css-class="color-red-1"></div>
    </div>
    <div class="color-option-wrapper">
        <div id="color-option" style="background-color: rgb(255,212,212)" data-entity-css-class="color-red-2"></div>
    </div>
    <div class="color-option-wrapper">
        <div id="color-option" style="background-color: rgb(255,200,153)" data-entity-css-class="color-orange-1"></div>
    </div>
    <div class="color-option-wrapper">
        <div id="color-option" style="background-color: rgb(255,231,210)" data-entity-css-class="color-orange-2"></div>
    </div>
    <div class="color-option-wrapper">
        <div id="color-option" class="color-original" style="background-color: #f6f6f9; border-color: var(--border-card)" data-entity-css-class="color-original"></div>
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