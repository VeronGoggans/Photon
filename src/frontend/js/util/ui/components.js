export function createListItemType1(item, itemType) {
    const listItemCard = document.createElement('list-item-card-1');
    listItemCard.setAttribute('list-item', JSON.stringify(item));
    listItemCard.setAttribute('list-item-type', itemType);
    return listItemCard 
}


export function createFolder() {

}


export function createFolderPath(folder) {
    const folderPath = document.createElement('folder-path');
    folderPath.setAttribute('folder', JSON.stringify(folder));
    return folderPath;
}


export function createRecentFolder() {

}


// Page blocks 

export function createDocumentLocation(folders) {
    const documentLocation = document.createElement('document-location-page-block');
    documentLocation.setAttribute('folders', JSON.stringify(folders));
    return documentLocation;
}