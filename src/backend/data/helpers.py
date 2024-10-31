from sqlalchemy.orm import Session
from src.backend.data.models import Folder, Note, Taskboard, Flashcard, FlashcardSet, Task, NoteBook, NotebookItem, Milestone
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


def find_task(id: int, db: Session) -> ( Task | NotFoundException ):
    task = db.query(Task).filter(Task.id == id).first()

    if task is None:
        raise NotFoundException(f"Task with id {id} not found.")
    return task


def find_milestone(id: int, db: Session) -> ( Milestone | NotFoundException ):
    milestone = db.query(Milestone).filter(Milestone.id == id).first()

    if milestone is None:
        raise NotFoundException(f"Milestone with id {id} not found.")
    return milestone


def find_taskboard(id: int, db: Session) -> ( Taskboard | NotFoundException ):
    taskboard = db.query(Taskboard).filter(Taskboard.id == id).first()

    if taskboard is None:
        raise NotFoundException(f"Taskboard with id {id} not found.")
    return taskboard


def find_deck(id: int, db: Session) -> ( FlashcardSet | NotFoundException ):
    deck = db.query(FlashcardSet).filter(FlashcardSet.id == id).first()
    
    if deck is None:
        raise NotFoundException(f"Deck with id {id} not found.")
    return deck


def find_notebook(id: int, db: Session) -> ( NoteBook | NotFoundException ):
    notebook = db.query(NoteBook).filter(NoteBook.id == id).first()
    
    if notebook is None:
        raise NotFoundException(f"Notebook with id {id} not found.")
    return notebook


def find_notebook_item(id: int, db: Session) -> ( NotebookItem | NotFoundException ):
    notebook_item = db.query(NotebookItem).filter(NotebookItem.id == id).first()
    
    if notebook_item is None:
        raise NotFoundException(f"Notebook item with id {id} not found.")
    return notebook_item


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
