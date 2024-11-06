import { CNode } from "../../util/CNode.js";
import { notificationTypes, notificationMessages } from "../../constants/constants.js";

export class NotificationHandler {
    
    
    static push(type, noteName = null, errorMsg = null) {
        const types = notificationTypes;
        const messages = notificationMessages;
        const notifications = {
            'saved': { message: messages.saved, type: types.saved},
            'updated': { message: messages.updated, type: types.updated},
            'deleted': { message: `<b>${noteName}</b> ${messages.deleted}`, type: types.deleted},
            'new': { message: messages.new, type: types.new},
            'empty': { message: messages.empty, type: types.empty},
            'error': { message: errorMsg, type: types.error}
        };
    
        const data = notifications[type.toLowerCase()];
        
        document.querySelector('.wrapper').appendChild(new Notification(data.message, data.type));
    }

    static empty(parentElement) {
        const H2 = document.createElement('h2');
        H2.classList.add('notify-empty-text');
        H2.textContent = "There is nothing here.";
        parentElement.appendChild(H2);
    }
}


class Notification {
    constructor(icon, message, title) {
        this.NOTIFICATION_CARD = CNode.create('div', {'class': 'notification-card'});
        this.ICON = CNode.create('i', {'class': icon, 'id': 'notification-icon'});
        this.TITLE = CNode.create('h3', {'textContent': title})
        this.MESSAGE = CNode.create('p', {'innerHTML': message});
        return this.#render();
    }

    #render() {
        this.NOTIFICATION_CARD.append(this.ICON, this.TITLE, this.MESSAGE);
        this.NOTIFICATION_CARD.addEventListener('click', () => {this.#slideDown(250)});
        setTimeout(() => {
            this.slideUp();
        }, 100);
        return this.NOTIFICATION_CARD
    }

    #slideDown(duration) {
        this.NOTIFICATION_CARD.classList.remove('show-notification');
        setTimeout(() => {
            this.NOTIFICATION_CARD.remove(); 
        }, duration);
    }

    slideUp() {
        this.NOTIFICATION_CARD.classList.add('show-notification');
        setTimeout(() => {
            this.#slideDown(250);
        },4500);   
    }
}