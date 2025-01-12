
let currentDirection = null;                  // Tracks the current scrolling direction.
let scrollInterval = null;                    // Interval ID for auto-scrolling.
const draggingSpeedUpOrLeft = -10;         // Speed for scrolling up or left.
const draggingSpeedDownOrRight = 10;       // Speed for scrolling down or right.
const dragProximity = 70;



/**
 * Starts auto-scrolling the parent element in a specified direction.
 *
 * @param { HTMLDivElement } scrollableElement - The parent element which should be scrollable.
 * @param {string} direction                   - The direction to scroll ('up', 'down', 'left', 'right').
 */
export function startScrolling(scrollableElement, direction) {
    if (currentDirection === direction) return; // Avoid restarting for the same direction.

    stopScrolling(); // Clear any existing interval

    currentDirection = direction;

    scrollInterval = setInterval(() => {
        if (direction === 'up' || direction === 'down') {
            scrollableElement.scrollBy({
                top: direction === 'up' ? draggingSpeedUpOrLeft : draggingSpeedDownOrRight,
                behavior: 'auto'
            });
        }

        else if (direction === 'left' || direction === 'right') {
            scrollableElement.scrollBy({
                left: direction === 'left' ? draggingSpeedUpOrLeft : draggingSpeedDownOrRight,
                behavior: 'auto'
            });
        }
    }, 16); // 60fps (~16ms per frame)
}


/**
 * Stops auto-scrolling.
 */
export function stopScrolling() {
    if (scrollInterval) {
        clearInterval(scrollInterval);
        scrollInterval = null;
        currentDirection = null; // Reset the current direction
    }
}


/**
 * Checks if the mouse pointer is near the edges of the parent element
 * and triggers auto-scrolling if necessary.
 *
 * @param { HTMLDivElement } scrollableElement - The parent element which should be scrollable.
 * @param { number } mouseX             - The x-coordinate of the mouse pointer.
 * @param { number } mouseY             - The y-coordinate of the mouse pointer.
 */
export function checkAutoScroll(scrollableElement, mouseX, mouseY)
{
    const rect = scrollableElement.getBoundingClientRect();
    const topEdge = rect.top;
    const bottomEdge = rect.bottom;
    const leftEdge = rect.left;
    const rightEdge = rect.right;

    if (mouseY < topEdge + dragProximity) {
        startScrolling(scrollableElement, 'up'); // Scroll up
    }
    else if (mouseY > bottomEdge - dragProximity) {
        startScrolling(scrollableElement, 'down'); // Scroll down
    }
    else if (mouseX < leftEdge + dragProximity) {
        startScrolling(scrollableElement, 'left'); // Scroll left
    }
    else if (mouseX > rightEdge - dragProximity) {
        startScrolling(scrollableElement, 'right'); // Scroll right
    }
    else {
        stopScrolling(); // Stop scrolling if not near any edge
    }
}