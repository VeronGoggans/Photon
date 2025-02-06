export class CNode {

    static create(element_name, element_attributes) {
        let element = document.createElement(`${element_name}`);
        const keys = Object.keys(element_attributes);
        const values = Object.values(element_attributes);

        for (let i = 0; i < keys.length; i++) {
            if (keys[i] === 'textContent') {
                element.textContent = values[i];
            }
            if (keys[i] === 'innerHTML') {
                element.innerHTML = values[i];
            }
            else {
                element.setAttribute(keys[i], values[i]);
            }
        } return element;
    } 
}
