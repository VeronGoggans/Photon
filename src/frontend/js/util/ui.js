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



export function showContextMenu(event, parentElement, menuTemplate) {
    event.preventDefault()

    const existingMenu = document.querySelector('entity-options-menu');
    if (existingMenu) {
        AnimationHandler.fadeOutContextMenu(existingMenu);
    }

    const newMenu = document.createElement('entity-options-menu');
    newMenu.setData({
        'boundedElement': parentElement,
        'menuTemplate': menuTemplate
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