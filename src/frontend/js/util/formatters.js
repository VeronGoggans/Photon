
export function formatName(name) {
    if (name.length <= 25) return name;
    else return name.slice(0, 22) + '...';
}


export function filterNotePreview(content) {
    let segments = content.split("<div>");

    if (segments.length > 10) {
        segments = segments.slice(0, 10);
        return segments.join("<div>");
    } else {
        return segments.join("<div>");
    }
}


export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function captureNewLines(text) {
    // Display the text with visible newline characters
    var htmlText = text.replace(/\n/g, '<br>');
    return htmlText;
}
