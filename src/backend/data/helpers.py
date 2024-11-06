from sqlalchemy.orm import Session
from src.backend.data.models import Folder, Note, Flashcard, FlashcardSet
from src.backend.data.exceptions.exceptions import NotFoundException


def find_folder(folder_id: int, db: Session) -> (Folder | NotFoundException):
    folder = db.query(Folder).filter(Folder.id == folder_id).first()
    
    if folder is None:
        raise NotFoundException(f"Folder with id {folder_id} not found.")
    return folder


def find_note(note_id: int, db: Session) -> ( Note | NotFoundException ):
    note = db.query(Note).filter(Note.id == note_id).first()
    
    if note is None:
        raise NotFoundException(f"Note with id {note_id} not found.")
    return note


def find_deck(id: int, db: Session) -> ( FlashcardSet | NotFoundException ):
    deck = db.query(FlashcardSet).filter(FlashcardSet.id == id).first()
    
    if deck is None:
        raise NotFoundException(f"Deck with id {id} not found.")
    return deck


def find_flashcard(id: int, db: Session) -> ( Flashcard | NotFoundException ):
    flashcard = db.query(Flashcard).filter(Flashcard.id == id).first()
    
    if flashcard is None:
        raise NotFoundException(f"Flashcard with id {id} not found.")
    return flashcard


def get_hierarchy(item_id: int, db: Session, is_note: bool) -> list[dict]:
    """
    Retrieve the folder hierarchy for a given folder or note ID.
    The hierarchy is a list of dictionaries with {id, name} for each folder in the path.
    """

    path = []
    
    # Start from the folder or the folder linked to the note
    if is_note:
        note = db.query(Note).filter_by(id=item_id).one_or_none()
        if note is None or note.folder_id is None:
            return []  # Note or folder not found
        current_folder_id = note.folder_id
    else:
        folder = db.query(Folder).filter_by(id=item_id).one_or_none()
        if folder is None:
            return []  # Folder not found
        current_folder_id = folder.id
    
    # Traverse the hierarchy of folders
    while current_folder_id:
        folder = db.query(Folder).filter_by(id=current_folder_id).one_or_none()
        if not folder:
            break
        path.append(folder.name)
        current_folder_id = folder.parent_id  # Move up to the parent folder
    
    # Reverse the path to show the hierarchy from top to bottom
    return path[::-1]
