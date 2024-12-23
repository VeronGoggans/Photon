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


export function addDraggImage(event, imageType) {
    // Adding the drag image to the body
    const dragImage = createDragImage(imageType);
    document.body.appendChild(dragImage);
    event.dataTransfer.setDragImage(dragImage, 0, 0)
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
 *
 * @param {Number} x
 * @param {number} y
 */
export function pixelToPercentage(x, y) {
    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;

    const xPercentage = x / winWidth * 100;
    const yPercentage = y / winHeight * 100;

    return { x: xPercentage, y: yPercentage }
}



function createDragImage(type) {
     /**
     * type is either ( folder ) or ( file ) or ( thumbtack )
     * representing the fontAwesome icon class of 
     * ( fa-solid fa-folder ) or ( fa-solid fa-file ) or ( fa-solid fa-thumbtack )
    */    
    const image = document.createElement('div');
    const icon = document.createElement('i');
    icon.setAttribute('class', `fa-solid fa-${type}`)
    image.classList.add('drag-image');
    image.appendChild(icon);
    return image
}