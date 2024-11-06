
class PushNotification extends HTMLElement {
    constructor() {
        super()
    }

    
    connectedCallback() {
        this.render();
        this.addEventListener('click', this.showNotification.bind(this));
    }


    render() {
        this.innerHTML = `
            <div>
                <div class="dot"></div>
                <p class="notification-title">Added note successful</p>
            </div>        
            <p class="notitication-message">Docker syntax has been added.</p>
        `
    }

    showNotification() {
        this.classList.add('show');
        setTimeout(() => {
            this.closeNotification();
        }, 4500);
    }

    closeNotification() {
        this.classList.remove('show');
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