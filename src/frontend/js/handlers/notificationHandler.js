
export function pushNotification(type, noteName = null) {
    const notification = document.createElement('push-notification');
    const object = {
        'type': type,
        'noteName': noteName
    }
    notification.setData(JSON.stringify(object));
    document.querySelector('.wrapper').appendChild(notification);
}


export function renderEmptyNotification(parentElement) {
    const H2 = document.createElement('h2');
    H2.classList.add('notify-empty-text');
    H2.textContent = "There is nothing here.";
    parentElement.appendChild(H2);
}