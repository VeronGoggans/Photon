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
        }, 400500);
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

}


customElements.define('push-notification', PushNotification);