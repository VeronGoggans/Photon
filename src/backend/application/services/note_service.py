from src.backend.data.managers.note_manager import NoteManager
from src.backend.presentation.request_bodies.note_requests import PostNoteRequest, PutNoteRequest, BookmarkRequest
from src.backend.data.models import Note
from sqlalchemy.orm import Session
from src.backend.data.exceptions.exceptions import *


class NoteService:
    def __init__(self, manager: NoteManager):
        self.manager = manager


    def add_note(self, request: PostNoteRequest, db: Session) -> Note:
        parent_id = request.folder_id
        note = Note(
            name = request.name, 
            content = request.content,
            folder_id = parent_id
            )
        return self.manager.add(parent_id, note, db)


    def get_notes(self, folder_id: int, db: Session) -> list[Note]:
        if folder_id == -1:
            return self.manager.get_bookmarks(db)
        return self.manager.get(folder_id, db)


    def get_note_by_id(self, note_id: int, db: Session) -> Note:
        return self.manager.get_by_id(note_id, db)
        
    
    def get_recent_notes(self, db: Session) -> list[Note]:
        return self.manager.get_recent(db)
    

    def get_recent_viewed_notes(self, db: Session) -> list[Note]:
        return self.manager.get_recent_viewed(db)
    

    def update_note(self, request: PutNoteRequest, db: Session) -> Note:
        return self.manager.update(request.note_id, request.name, request.content, request.bookmark, db)
    

    def update_bookmark(self, note_id: int, request: BookmarkRequest, db: Session) -> None:
        self.manager.update_bookmark(note_id, request.bookmark, db) 


    def update_visit(self, note_id: int, db: Session) -> None:
        self.manager.update_visit_date(note_id, db)


    def delete_note(self, note_id: int, db: Session) -> Note:
        return self.manager.delete(note_id, db)


    def move_note(self, folder_id: int, note_id: int, db: Session) -> Note:
        return self.manager.move(folder_id, note_id, db)


    def get_search_options(self, db: Session) -> list[dict]:
        return self.manager.get_name_id(db)
