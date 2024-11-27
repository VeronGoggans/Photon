from src.backend.data.models import Note
from src.backend.data.helpers import find_folder, find_note, get_hierarchy
from src.backend.presentation.request_bodies.note_requests import *
from src.backend.data.exceptions.exceptions import *
from sqlalchemy.orm import Session
from datetime import datetime


class NoteManager:    

    def add(self, folder_id: int, note: Note, db: Session) -> (Note | NotFoundException):
        find_folder(folder_id, db)
        db.add(note)
        db.commit()
        db.refresh(note)
        return note

    
    def get(self, folder_id: int, db: Session) -> (list[Note] | NotFoundException):
        find_folder(folder_id, db)
        notes = (
            db.query(Note)
            .filter(Note.folder_id == folder_id)
            .order_by(Note.bookmark.desc())
            .all()
        )
        return notes


    def get_by_id(self, id: int, db: Session) -> (Note | NotFoundException):
        note = find_note(id, db)
        hierarchy = get_hierarchy(id, db, is_note=True)
        return note, hierarchy
    

    def get_recent(self, db: Session) -> list[Note]:
        recent_notes = (
            db.query(Note)
            .order_by(Note.last_edit.desc())
            .limit(10)
            .all()
        )
        return recent_notes
    

    def get_recent_viewed(self, db: Session) -> list[Note]:
        recent_notes = (
            db.query(Note)
            .order_by(Note.last_visit.desc())
            .limit(5)
            .all()
        )
        return recent_notes


    def get_name_id(self, db: Session) -> list[dict]:
        search_items = (db.query(Note.id, Note.name).all())
        return [{"id": item.id, "name": item.name} for item in search_items]
    

    def get_bookmarks(self, db: Session) -> list[Note]:
        return db.query(Note).filter(Note.bookmark == True).all()
               

    def update(self, note_id: int, name: str, content: str, bookmark: bool, db: Session) -> (Note | NotFoundException):
        note = find_note(note_id, db)

        # Updating the note 
        note.name = name
        note.content = content
        note.bookmark = bookmark
        note.last_edit = datetime.now()

        # Commiting the changes to the database
        db.commit()
        db.refresh(note)
        return note
    

    def update_bookmark(self, note_id: int, new_bookmark_value: bool, db: Session) -> None:
        note = find_note(note_id, db)
        note.bookmark = new_bookmark_value
        db.commit()


    def update_visit_date(self, note_id: int, db: Session) -> (None | NotFoundException):
        note = find_note(note_id, db)
        note.last_visit = datetime.now()
        db.commit()


    def move(self, parent_id: int, note_id: int, db: Session) -> Note:
        find_folder(parent_id, db)

        note = find_note(note_id, db)
        note.folder_id = parent_id

        db.commit()
        db.refresh(note)
        return note


    def delete(self, id: int, db: Session) -> Note:
        note = find_note(id, db)
        db.delete(note)
        db.commit()
        return note