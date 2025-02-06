import { AnimationHandler } from "../handlers/animationHandler.js";
import { removeEmptyFolderNotification } from "../handlers/notificationHandler.js";
import { widgetStyles } from "../constants/constants.js";



/**
 * This method will remove all the child elements from the specified
 * parent element
 *
 * @param parentElement The element you want to remove all the children from
 */
export function removeContent(parentElement) {
    while (parentElement.firstChild) {
        parentElement.removeChild(parentElement.firstChild);
    }
    removeEmptyFolderNotification();
}





/**
 * This method will decrement a string number e.g. "1"
 *
 * "2" - "1"
 *
 * @param string        - The number string being decremented.
 * @returns { String }  - The decremented string
 */
export function decrementString(string) {
    let num = Number(string);
    num--
    return String(num)
}



/**
 * This method will increment a string number e.g. "1"
 *
 * "1" - "2"
 *
 * @param string        - The number string being incremented.
 * @returns { String }  - The incremented string
 */
export function incrementString(string) {
    let num = Number(string);
    num++
    return String(num)
}




export function applyWidgetStyle(componentElement) {
    componentElement.classList.add(widgetStyles[
        window.sessionStorage.getItem('widget-style')
        ]);
}

export function applyFolderIconColor(componentElement) {
    const colors = { 'blue': '#5c7fdd', 'gray': '#a4a8bf' }
    const iconColor = window.sessionStorage.getItem('folder-icon-color')
    componentElement.querySelector('i').style.color = colors[iconColor];
}



/**
 * Displays a context menu at the location of the triggering event and attaches it to the DOM.
 *
 * @param {Event} event                 - The event that triggered the context menu, typically a right-click or similar.
 * @param {HTMLElement} parentElement   - The element that the context menu is associated with, serving as the bounded element.
 * @param { string } menuTemplate       - A template defining the structure and options of the context menu.
 * Each object in the array represents a menu item with its properties (e.g., label, action).
 * @param {string} entityName           - The name of the entity for which the context menu is being displayed. This can be used for labeling or additional metadata.
 *
 * The function performs the following steps:
 * 1. Prevents the default context menu behavior of the browser.
 *
 * 2. Removes any existing context menu from the screen by:
 *    - Querying the DOM for an `entity-options-menu` element.
 *    - Fading it out using the `AnimationHandler.fadeOutContextMenu` method if it exists.
 *
 * 3. Creates a new `entity-options-menu` element and sets its data, including:
 *    - `boundedElement`: The element the menu is associated with.
 *    - `menuTemplate`: The template defining the menu structure.
 *    - `entityName`: The name of the entity tied to the menu.
 *
 * 4. Appends the new menu to the document body.
 *
 * 5. Fades the new menu in using the `AnimationHandler.fadeIn` method.
 */
export function showContextMenu(event, parentElement, menuTemplate, entityName) {
    event.preventDefault()

    // Remove existing context menu's on the screen.
    const existingMenu = document.querySelector('entity-options-menu');
    if (existingMenu) {
        AnimationHandler.fadeOutContextMenu(existingMenu);
    }

    // Create new context menu
    const newMenu = document.createElement('entity-options-menu');
    newMenu.setData({
        'boundedElement': parentElement,
        'menuTemplate': menuTemplate,
        'entityName': entityName
    })
    
    document.body.appendChild(newMenu);
    AnimationHandler.fadeIn(newMenu);
}



/**
 * Creates a visual representation of the draggable element
 * to follow the mouse pointer during dragging.
 *
 * @param { string } draggableEntityName - The type of entity being dragged (e.g., "folder", "note" or "sticky note").
 *
 * @returns { HTMLElement } The drag image element.
 */
export function addDragImage(event, draggableEntityName) {
    const folderDragIconClass = 'bi bi-folder';
    const noteDragIconClass = 'bi bi-file-earmark';

    const dragImage = document.createElement('div');
    const iconElement = document.createElement('i');

    let imageIconClass;
    if (draggableEntityName === 'folder') {
        imageIconClass = folderDragIconClass
    }

    if (draggableEntityName === 'note') {
        imageIconClass = noteDragIconClass;
    }

    iconElement.setAttribute('class', imageIconClass)
    dragImage.appendChild(iconElement);
    dragImage.classList.add('drag-image');

    document.body.appendChild(dragImage);
    event.dataTransfer.setDragImage(dragImage, 0, 0)

}


export function removeDragImage() {
    document.querySelector('.drag-image').remove();
}

















export function hideFolderBlockTitle() {
    // Hide both the block title and container elements from the screen.
    document.querySelector('#folders-block-title').style.display = 'none';
    document.querySelector('.folders').style.display = 'none';
}


export function resetFolderColorCircle() {
    const folderColorCircle = document.querySelector('#folder-color-circle');

    // Remove all the classes from the folder color circle element.
    folderColorCircle.classList.remove(...folderColorCircle.classList);
}