/**
 * This method will prevent names from overflowing by
 * truncating the name if the name exceeds 25 characters
 *
 * @param name         - The name of the component (e.g. folder, note, sticky board)
 * @returns { String } - The formatted name.
 */
export function formatName(name) {
    if (name.length <= 25) {
        return name;
    }
    else {
        return name.slice(0, 22) + '...';
    }
}



/**
 *
 *
 * @param content
 * @returns { String }
 */
export function filterNotePreview(content) {
    let segments = content.split("<div>");

    if (segments.length > 10) {
        segments = segments.slice(0, 10);
        return segments.join("<div>");
    }

    else {
        return segments.join("<div>");
    }
}



/**
 *
 * @param string
 * @returns { String }
 */
export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

