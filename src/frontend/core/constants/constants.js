


export const notificationTypes = {
    'saved': 'Added note successfully',
    'updated': 'Changes saved successfully',
    'deleted': 'Deleted',
    'new': 'New',
}


export const notificationMessages = {
    'saved': 'has been saved to the folder.',
    'updated': 'Your changes have been saved.',
    'deleted': 'has been deleted.',
    'new': 'Changes saved.\nCreating a new note.',
}


export const folderIconColors = {
    "folder-appearance-blue-1": "var(--folder-background-blue-1)",
    "folder-appearance-blue-2": "var(--folder-background-blue-2)",
    "folder-appearance-blue-3": "var(--folder-background-blue-3)",
    "folder-appearance-blue-4": "var(--folder-background-blue-4)",
    "folder-appearance-green-1": "var(--folder-background-green-1)",
    "folder-appearance-green-2": "var(--folder-background-green-2)",
    "folder-appearance-green-3": "var(--folder-background-green-3)",
    "folder-appearance-purple-1": "var(--folder-background-purple-1)",
    "folder-appearance-purple-2": "var(--folder-background-purple-2)",
    "folder-appearance-red-1": "var(--folder-background-red-1)",
    "folder-appearance-red-2": "var(--folder-background-red-2)",
    "folder-appearance-orange-1": "var(--folder-background-orange-1)",
    "folder-appearance-orange-2": "var(--folder-background-orange-2)",
    'folder-appearance-original': 'rgb(164, 168, 191)'
};



export const sidebarButtonText = ['Home', 'Documents', 'Settings']



export const widgetStyles = {
    border: 'widget-style-border',
    shadow: 'widget-style-shadow'
}


export const organisationModalNewTitleText = {
    folder: 'Create a new folder',
    category: 'Create a new category'
}


export const organisationModalUpdateTitleText = {
    folder: 'Edit current folder',
    category: 'Edit current category'
}


export const organisationModalNewButtonText = {
    folder: 'Create folder',
    category: 'Create category'
}


export const organisationModalUpdateButtonText = {
    folder: 'Save folder',
    category: 'Save category'
}


export const organisationModalContextText = {
    folder: 'Folders help you organise your notes in a hierarchical fashion',
    category: 'Categories help you organise your notes in a flat and straight forward manner'
}


export const organisationModalEntityNameText = {
    folder: 'Folder name',
    category: 'Category name'
}


export const organisationModalIcons = {
    folder: 'bi bi-folder',
    category: 'bi bi-inboxes'
}








// ___________________________ Enums ________________________________ //


export const ReferenceItemTypes = {
    NOTES: 'notes',
    FOLDERS: 'folders',
    TEMPLATES: 'templates'
}


export const SlashCommands = {
    H1: 'h1',
    H2: 'h2',
    H3: 'h3',
    H4: 'h4',
    OL: 'ol',
    UL: 'ul',
    TODO: 'todo',
    URL: 'url',
    VIDEO: 'video',
    DIVIDER: 'divider',
    TERMINAL: 'terminal',
    HTML: 'html',
    LINK_TO_NOTE: 'link to note',
    LINK_TO_FOLDER: 'link to folder',
    TEMPLATE: 'template',
}


export const SlashCommandComponentDimensions = {
    WIDTH: 300,
    HEIGHT: 300,
}


export const RichTextComponentDimensions = {
    WIDTH: 612,
    HEIGHT: 52,
}


export const EditorKeyBindings = {
    E_KEY: 'e',
    N_KEY: 'n',
    D_KEY: 'd',
    I_KEY: 'i',
    GREATER_KEY: '>',
    LESS_KEY: '<',
}


export const CssAnimationClasses = {
    BOUNCING_ANIMATION: 'bouncing'
}


export const CssAnimationDurations = {
    BOUNCING_ANIMATION: 600
}




export const UIWebComponentNames = {
    
    FOLDER: 'folder-component',
    PINNED_FOLDER: 'pinned-folder-component',
    FOLDER_PATH: 'folder-path-component',
    RECENT_FOLDER: 'recent-folder-component',

    NOTE: 'note-component',
    RECENTLY_CHANGED_NOTE: 'recently-changed-note-component',
    RECENTLY_VIEWED_NOTE: 'recently-viewed-note-component',

    DOCUMENT_LOCATION: 'document-location-component',
    CATEGORY: 'category-component'

}


export const ViewRouteIDs = {

    NOTES_VIEW_ID: 'notes_view_id',
    HOME_VIEW_ID: 'home_view_id',
    EDITOR_VIEW_ID: 'editor_view_id',
    SETTINGS_VIEW_ID: 'settings_view_id'

}