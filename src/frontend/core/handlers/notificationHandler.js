import { AnimationHandler } from "./animationHandler.js";


export function pushNotification(type, noteName = null) {
    const notification = document.createElement('push-notification');    

    notification.setData({ type: type, noteName: noteName });
    document.querySelector('.wrapper').appendChild(notification);
}


export function renderEmptyFolderNotification(timeout = 50) {
    setTimeout(() => {
        const parentElement = document.querySelector('.note-view-content');
        const notesAndFolders = document.querySelectorAll('folder-card, note-card');
        
        // Check if there are any folders or notes
        if (notesAndFolders.length === 0) {
            const emptyMessage = document.createElement('empty-notification');
            parentElement.appendChild(emptyMessage);
            AnimationHandler.fadeInFromBottom(emptyMessage);
        }
    }, timeout)
}


export function removeEmptyFolderNotification() {
    const emptyMessage = document.querySelector('empty-notification');
    if (emptyMessage !== null) emptyMessage.remove();
}