export function createListItemType1(item, itemType) {
    const listItemCard = document.createElement('list-item-card-1');
    listItemCard.setAttribute('list-item', JSON.stringify(item));
    listItemCard.setAttribute('list-item-type', itemType);
    return listItemCard 
}


export function createCustomElement(elementData, elementName) {
    const customComponent = document.createElement(elementName)
    customComponent.setData(elementData);
    return customComponent
}


// Page blocks 

export function createDocumentLocation(folders) {
    const documentLocation = document.createElement('document-location-page-block');
    documentLocation.setAttribute('folders', JSON.stringify(folders));
    return documentLocation;
}