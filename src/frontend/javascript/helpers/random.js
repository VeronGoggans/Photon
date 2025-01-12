export function viewToLoad(searchType) {
    if (searchType === 'note' || searchType === 'template') {
        return 'editor';
    }
    else if (searchType === 'folder') {
        return 'notes';
    } 
    else if (searchType === 'flashcard') {
        return 'flashcardsPractice';
    }
}