

export function createCustomElement(elementData, elementName) {
    const customComponent = document.createElement(elementName)
    customComponent.setData(elementData);
    return customComponent
}


// Page blocks 

export function createDocumentLocation(folders) {
    const documentLocation = document.createElement('document-location-page-block');
    documentLocation.setData(folders);
    return documentLocation;
}