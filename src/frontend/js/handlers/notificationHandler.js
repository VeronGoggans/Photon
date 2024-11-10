import { AnimationHandler } from "./animationHandler.js";


export function pushNotification(type, noteName = null) {
    const notification = document.createElement('push-notification');
    const object = {
        'type': type,
        'noteName': noteName
    }
    notification.setData(JSON.stringify(object));
    document.querySelector('.wrapper').appendChild(notification);
}


export function renderEmptyFolderNotification() {
    setTimeout(() => {
        const parentElement = document.querySelector('.note-view-content');
        const notesAndFolders = document.querySelectorAll('folder-card, note-card');
        
        // Check if there are any folders or notes
        if (notesAndFolders.length === 0) {
            const msg = document.createElement('empty-notification');
            parentElement.appendChild(msg);
            AnimationHandler.fadeInFromBottom(msg);
        }
    }, 5)
}