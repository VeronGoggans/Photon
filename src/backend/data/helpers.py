from sqlalchemy.orm import Session
from src.backend.data.models import Folder, Note, StandardStickyBoard, ColumnStickyBoard, StickyBoardColumn, StickyNote, Category
from src.backend.data.exceptions.exceptions import NotFoundException


def find_folder(folder_id: int, db: Session) -> (Folder | NotFoundException):
    folder = db.query(Folder).filter(Folder.id == folder_id).first()
    
    if folder is None:
        raise NotFoundException(f"Folder with id {folder_id} not found.")
    return folder


def find_category(category_id: int, db: Session) -> (Category | NotFoundException):
    category = db.query(Category).filter(Category.id == category_id).first()

    if category is None:
        raise NotFoundException(f"Category with id {category_id} not found.")
    return category


def find_note(note_id: int, db: Session) -> ( Note | NotFoundException ):
    note = db.query(Note).filter(Note.id == note_id).first()
    
    if note is None:
        raise NotFoundException(f"Note with id {note_id} not found.")
    return note


def find_standard_sticky_board(id: int, db: Session) -> ( StandardStickyBoard | NotFoundException ):
    sticky_board = db.query(StandardStickyBoard).filter(StandardStickyBoard.id == id).first()

    if sticky_board is None:
        raise NotFoundException(f'Sticky board with id {id} not found.')
    return sticky_board
    

def find_column_sticky_board(id: int, db: Session) -> ( ColumnStickyBoard | NotFoundException ):
    sticky_column_board = db.query(ColumnStickyBoard).filter(ColumnStickyBoard.id == id).first()

    if sticky_column_board is None:
        raise NotFoundException(f'Sticky column board with id {id} not found.')
    return sticky_column_board


def find_column(id: int, db: Session) -> ( StickyBoardColumn | NotFoundException ):
    sticky_column = db.query(StickyBoardColumn).filter(StickyBoardColumn.id == id).first()

    if sticky_column is None:
        raise NotFoundException(f'Sticky column with id {id} not found.')
    return sticky_column


def find_sticky_note(id: int, db: Session) -> ( StickyNote | NotFoundException ):
    sticky_note = db.query(StickyNote).filter(StickyNote.id == id).first()

    if sticky_note is None:
        raise NotFoundException(f'Sticky note with id {id} not found.')
    return sticky_note





def get_entity_path(item_id: int, db: Session, is_note: bool = False) -> list[dict]:
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
        path.append(folder)
        
        current_folder_id = folder.parent_id  # Move up to the parent folder
    
    # Reverse the path to show the hierarchy from top to bottom
    return path[::-1]




def is_templates_folder_in_path(parent_folder_id: int, db: Session) -> bool:

    hierarchy: list[object] = get_entity_path(parent_folder_id, db)

    # Checking to see if the Templates folder is inside of the path to the note.
    # If so the app will register that note as a template. 
    for folder in hierarchy:
        if 'Templates' in folder.name or 'templates' in folder.name:
            return True
    return False