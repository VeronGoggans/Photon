import { CNode } from "./CNode.js";
import { NotificationHandler } from "../handlers/userFeedback/notificationHandler.js";

export function removeContent(contentDiv) {
    while (contentDiv.firstChild) 
        contentDiv.removeChild(contentDiv.firstChild);
}


export function decrementString(string) {
    let num = Number(string);
    num--
    return String(num)
}


export function incrementString(string) {
    let num = Number(string);
    num++
    return String(num)
}


export function addEmptyMessage(parentElement) {
    setTimeout(() => {
        if (parentElement.childElementCount === 0) {
            NotificationHandler.empty(parentElement);
        }    
    }, 710);
} 


export function removeEmptyMessage(parentElement) {
    if (parentElement.firstChild.className = 'notify-empty-text') {
        parentElement.removeChild(parentElement.firstChild);
    }
}


export function addDraggImage(event, imageType) {
    // Adding the drag image to the body
    const dragImage = new DragImage(imageType);
    document.body.appendChild(dragImage);
    event.dataTransfer.setDragImage(dragImage, 0, 0)
}


export function showContextMenu(event, parentElement, menuTemplate) {
    event.preventDefault()

    const existingMenu = document.querySelector(".options-menu");
    if (existingMenu) existingMenu.remove();

    const menu = document.createElement("div");
    menu.classList.add("options-menu");
    menu.innerHTML = menuTemplate

    parentElement.appendChild(menu);

    // Add an event listener to close the menu when clicking outside of it
    document.addEventListener("click", function hideMenu(e) {
    if (!menu.contains(e.target)) {
        menu.remove();
        document.removeEventListener("click", hideMenu);
    }});
}



// TODO Make this a function

class DragImage {
    constructor(type) {
        /**
         * type is either ( folder ) or ( file ) or ( thumbtack )
         * representing the fontAwesome icon class of 
         * ( fa-solid fa-folder ) or ( fa-solid fa-file ) or ( fa-solid fa-thumbtack )
        */
        this.HOST = CNode.create('div', {'class': 'drag-image'});
        this.ICON = CNode.create('i', {'class': `fa-solid fa-${type}`})
        this.HOST.appendChild(this.ICON);
        return this.HOST
    }
}