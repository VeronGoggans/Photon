import { AnimationHandler } from "../handlers/animationHandler.js";
import { SlashCommandComponentDimensions, RichTextComponentDimensions } from "../constants/constants.js";


export function placeSlashCommandContainer(selection) {
    const slashCommandComponent = document.createElement("slash-command-component");

    const editor = document.querySelector('.editor');
    const rect = selection.getRangeAt(0).getBoundingClientRect();
    const xPosition = checkForWidthOverflow(rect);
    const overflow = checkForHeightOverflow(rect);


    editor.appendChild(slashCommandComponent);

    if (overflow) slashCommandComponent.style.top = `${rect.bottom + window.scrollY  + 5}px`;
    else slashCommandComponent.style.top = `${rect.top + window.scrollY - SlashCommandComponentDimensions.HEIGHT - this.paddingY}px`;

    slashCommandComponent.style.left = `${xPosition}px`;
    slashCommandComponent.style.display = 'grid';
    AnimationHandler.fadeIn(slashCommandComponent);

}


export function placeFormatBar(selection) {

}


export function placeSearchContainer(UIElement) {
    const viewElement = document.querySelector('.editor-wrapper');

    // PLace the reference search container
    UIElement.style.position = 'absolute';
    UIElement.style.bottom = '50px';
    UIElement.style.right = '50px';

    // Show the reference search container
    viewElement.appendChild(UIElement);
    AnimationHandler.fadeIn(UIElement);
}


export function placeContextMenu(contextMenu, boundedElement) {
    const padding = 15;                                     // Pixels used for the gap between the context menu and the boundedElement.
    const screenHeight = window.innerHeight;                // The height of the full viewport (app window).
    const screenWidth = window.innerWidth;                  // The width of the full viewport (app window).
    const rect = boundedElement.getBoundingClientRect();
    const menuHeight = contextMenu.offsetHeight;            // The full height of the context menu.
    const menuWidth = contextMenu.offsetWidth;              // The full width of the context menu.

    const menuTop = rect.top - padding - menuHeight;        // The max Y coordinate of the context menu.
    const menuBottom = rect.bottom + padding + menuHeight;  // The min Y coordinate of the context menu.
    const menuRight = rect.right + padding + menuWidth;     // The max X coordinate of the context menu.
    const menuLeft = rect.left - padding - menuWidth;       // The min X coordinate of the context menu.



    // First check if the context menu can be placed above the bounded element.
    if (menuTop > 0) {
        contextMenu.style.left = `${rect.left}px`;
        contextMenu.style.top =  `${menuTop}px`;
    }

    // If not, then check if the context menu can be placed on the right side of the bounded element.
    else if (menuRight < screenWidth) {
        contextMenu.style.left = `${rect.right + padding}px`;
        contextMenu.style.top =  `${rect.top}px`;
    }
    // If not, then check if the context menu can be placed below the bounded element.
    else if (menuBottom < screenHeight) {
        contextMenu.style.left = `${rect.left}px`;
        contextMenu.style.top =  `${rect.bottom + padding}px`;
    }
    // If none of the above sides fit, then check if the context menu can be placed on the left side of the bounded element.
    else if (menuLeft > 0) {
        contextMenu.style.left = `${menuLeft}px`;
        contextMenu.style.top =  `${rect.top}px`;
    }
}




/**
 * This method adjusts the spawn point of the
 * command/format containers if X axis overflow is taking place.
 * @param {DOMRect} rect
 */
function checkForWidthOverflow(rect) {
    const padding = 20; //Pixels
    const screenWidth = this.editor.clientWidth;
    const spawnPoint = rect.left + window.scrollX - this.sidebar.clientWidth;
    const totalWidth = spawnPoint + SlashCommandComponentDimensions.WIDTH;

    if (totalWidth > screenWidth) {
        const pixelOverflow = totalWidth - screenWidth;
        return spawnPoint - pixelOverflow - padding;
    }
    return spawnPoint;
}

/**
 * Same thing as the method above but now for
 * Y axis overflow.
 * @param {DOMRect} rect
 */
function checkForHeightOverflow(rect) {
    const spawnPoint = rect.top + window.scrollY;
    const totalHeight = spawnPoint - SlashCommandComponentDimensions.HEIGHT;
    return totalHeight <= 10
}