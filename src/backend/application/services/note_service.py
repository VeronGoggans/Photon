from src.backend.data.managers.note_manager import NoteManager
from src.backend.presentation.request_bodies.note_requests import PostNoteRequest
from src.backend.data.models import Note
from sqlalchemy.orm import Session
from src.backend.data.exceptions.exceptions import *
from datetime import datetime



class NoteService:
    def __init__(self, manager: NoteManager):
        self.manager = manager



    def add_note(self, request: PostNoteRequest, db: Session) -> Note:
        """
        
        """
        parent_id = request.folder_id
        note = Note(
            name = request.name, 
            content = request.content,
            folder_id = parent_id,
            creation = datetime.now()
            )
        return self.manager.add(parent_id, note, db)



    def get_notes(self, db: Session, folder_id: int = None, filters: dict = None) -> list[Note]:
        """
        
        """

        if folder_id is not None:
            return self.manager.get(folder_id, db)
        
        if filters:
            if filters.get("bookmarks"):
                return self.manager.get_bookmarks(db)

            elif filters.get("recent"):
                return self.manager.get_recent(db)

            elif filters.get("recently-viewed"):
                return self.manager.get_recently_viewed(db)

            elif filters.get("search-items"):
                return self.manager.get_search_items(db)
        
        