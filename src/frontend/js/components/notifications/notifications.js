import { notificationTypes, notificationMessages } from "../../constants/constants.js";

class PushNotification extends HTMLElement {
    constructor() {
        super()
        this.notifications = {
            'saved': { message: `<b>${this.noteName}</b> ${notificationMessages.saved}`, type: notificationTypes.saved },
            'updated': { message: notificationMessages.updated, type: notificationTypes.updated },
            'deleted': { message: `<b>${this.noteName}</b> ${notificationMessages.deleted}`, type: notificationTypes.deleted },
            'new': { message: notificationMessages.new, type: notificationTypes.new },
        };
    }

    setData(value) {
        const data = JSON.parse(value);
        this.noteName = data.noteName;
        this.notification = this.notifications[data.type];
    }

    
    connectedCallback() {
        this.render();
        this.addEventListener('click', this.closeNotification.bind(this));
        this.showNotification()
    }


    render() {
        this.innerHTML = `
            <div>
                <div class="dot"></div>
                <p class="notification-title">${this.notification.type}</p>
            </div>        
            <p class="notitication-message">${this.notification.message}</p>
        `   
    }

    showNotification() {
        this.classList.add('show-push-notification');
        setTimeout(() => {
            this.closeNotification();
        }, 4500);
    }

    closeNotification() {
        this.classList.remove('show-push-notification');
        setTimeout(() => {
            this.remove(); 
        }, 250);
    }
}




class EmptyFolderNotification extends HTMLElement {
    constructor() {
        super()
    }

    connectedCallback() {
        this.render();
        this.addEventListeners();
    }

    render() {
        this.innerHTML = `
            <div class="icons">
                <i id="center-icon" class="bi bi-folder2-open"></i>
                <i id="floating-icon1" class="bi bi-file-earmark"></i>
                <i id="floating-icon2" class="bi bi-file-earmark-text"></i>
                <i id="floating-icon3" class="bi bi-sticky"></i>
                <i id="floating-icon4" class="bi bi-image"></i>
            </div>
            <div class="empty-message">
                <p>Nothing found</p>
                <span>This folder is currently empty, start by creating a folder or note.</span>
            </div>
            <div class="emtpy-message-buttons">
                <button class="empty-create-folder-btn">Create folder</button>
                <button class="empty-create-note-btn">Create note</button>
            </div>
        `   
    }

    addEventListeners() {
        this.querySelector('.empty-create-folder-btn').addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('CreateNewFolder', { detail: {}, bubbles: true }));
        });

        this.querySelector('.empty-create-note-btn').addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('CreateNewNote', { detail: {}, bubbles: true }));
        });
    }
}


customElements.define('empty-notification', EmptyFolderNotification);
customElements.define('push-notification', PushNotification);