from src.backend.data.models import Note
from src.backend.data.helpers import find_folder, find_note, get_entity_path, is_templates_folder_in_path
from src.backend.presentation.request_bodies.note_requests import *
from src.backend.data.exceptions.exceptions import *
from src.backend.util.event_bus import event_bus, convert_notes_event
from sqlalchemy.orm import Session
from sqlalchemy.engine.row import Row
from datetime import datetime
from typing import List, Tuple


class NoteManager:    
    def __init__(self):
        event_bus.subscribe(convert_notes_event, self.convert_notes)
    

    

    def add(self, folder_id: int, note: Note, db: Session) -> Note:
        find_folder(folder_id, db)
        db.add(note)
        db.commit()
        db.refresh(note)
        return note

    

    def get(self, folder_id: int, db: Session) -> list[Note]:
        find_folder(folder_id, db)
        notes = (
            db.query(Note)
            .filter(Note.folder_id == folder_id)
            .order_by(Note.bookmark.desc())
            .all()
        )
        return notes



    def get_by_id(self, id: int, db: Session) -> tuple[Note, list[object]]:
        note: Note = find_note(id, db)
        hierarchy: list[object] = get_entity_path(id, db, is_note=True)
        return note, hierarchy
    


    def get_recent(self, db: Session) -> list[Note]:
        recent_notes = (
            db.query(Note)
            .order_by(Note.last_edit.desc())
            .limit(10)
            .all()
        )
        return recent_notes
    


    def get_recently_viewed(self, db: Session) -> list[Note]:
        recent_notes = (
            db.query(Note)
            .order_by(Note.last_visit.desc())
            .limit(10)
            .all()
        )
        return recent_notes



    def get_search_items(self, notes: bool, db: Session) -> list[dict]:
        if notes:
            results = db.query(Note.id, Note.name).filter(Note.is_template == False).all()
        else:
            results = db.query(Note.id, Note.name).filter(Note.is_template == True).all()
        
        return [{"id": row.id, "name": row.name} for row in results]
    


    def get_bookmarks(self, db: Session) -> list[Note]:
        return db.query(Note).filter(Note.bookmark == True).all()
    


    def get_templates(self, db: Session) -> list[Note]:
        return db.query(Note).filter(Note.is_template == True).all()
    


    def update_name(self, note_id: int, name: str, db: Session) -> Note:
        note = find_note(note_id, db)
        note.name = name
        note.last_edit = datetime.now()
        db.commit()
        db.refresh(note)
        return note



    def update_content(self, note_id: int, content: str, db: Session) -> Note:
        note = find_note(note_id, db)
        note.content = content
        note.last_edit = datetime.now()
        db.commit()
        db.refresh(note)
        return note



    def update_bookmark(self, note_id: int, bookmark: bool, db: Session) -> None:
        note = find_note(note_id, db)
        note.bookmark = bookmark
        db.commit()



    def update_view_time(self, note_id: int, db: Session) -> None:
        note = find_note(note_id, db)
        note.last_visit = datetime.now()
        db.commit()


    
    def convert_notes(self, folder_id: int, to_template: bool, db: Session ) -> None:
        """
            Convert all notes in a folder to templates or vice versa.
        """
        notes: list[Note] = self.get(folder_id, db)

        for note in notes:
            note.is_template = to_template

        db.commit()



    def update_location(self, parent_id: int, note_id: int, db: Session) -> Note:
        # Check to see if the parent folder exists
        find_folder(parent_id, db)

        # Retrieve the note and update the folder_id to its new parent
        note = find_note(note_id, db)
        note.folder_id = parent_id

        # Check if the new parent is a template folder
        is_parent_folder_related_to_the_templates_folder: bool = is_templates_folder_in_path(parent_id, db)

        if is_parent_folder_related_to_the_templates_folder:
            note.is_template = True
        else:
            note.is_template = False

        db.commit()
        db.refresh(note)
        return note



    def delete(self, id: int, db: Session) -> Note:
        note = find_note(id, db)
        db.delete(note)
        db.commit()
        return note
    