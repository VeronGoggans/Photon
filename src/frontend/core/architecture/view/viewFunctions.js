import { removeEmptyFolderNotification } from "../../handlers/notificationHandler.js";



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
 * This method is used to hide (not remove) the notes/folders block title if needed.
 * 
 * @param { HTMLElement } blockTitle - The corrisponding block title that needs to be hidden. 
 * @param { HTMLElement } container - The corrisponding element containing the folders or notes that needs to be hidden. 
 */
export function removeBlockTitle(blockTitle, container) {    
    // Hide both the block title and container elements from the screen.
    blockTitle.style.display = 'none';
    container.style.display = 'none';
}





/**
 * This method is used to show (not add) the notes/folders block title if needed.
 * 
 * @param { HTMLElement } blockTitle - The corrisponding block title that needs to be shown. 
 * @param { HTMLElement } container - The corrisponding element containing the folders or notes that needs to be shown. 
 */
export function showBlockTitle(blockTitle, container) {
    // Show both the block title and container elements from the screen.
    blockTitle.style.display = '';
    container.style.display = '';
}





/**
 * 
 */
export function resetFolderColorCircle() {
    const folderColorCircle = document.querySelector('#folder-color-circle');

    // Remove all the classes from the folder color circle element.
    folderColorCircle.classList.remove(...folderColorCircle.classList);
}