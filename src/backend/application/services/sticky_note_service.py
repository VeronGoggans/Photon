from sqlalchemy.orm import Session
from src.backend.data.managers.sticky_note_manager import StickyNoteManager
from src.backend.presentation.request_bodies.note_requests import PostStickyNoteRequest, PostStickyBoardRequest, PatchStickyNoteRequest, PatchStickyBoardRequest
from src.backend.data.models import StickyNote, StandardStickyBoard, ColumnStickyBoard
from src.backend.data.exceptions.exceptions import *
from datetime import datetime



class StickyNoteService:
    def __init__(self, manager: StickyNoteManager) -> None:
        self.manager = manager


    def add_sticky_note(self, request: PostStickyNoteRequest, db: Session) -> StickyNote:    
        sticky_note = StickyNote(
            content = request.content,
            color = request.color,
            sticky_board_id = request.parent_id
            )
        
        return self.manager.add_sticky(sticky_note, db) 



    def get_sticky_notes(self, sticky_board_id: int, board_type: str, db: Session) -> list[StickyNote]:
        return self.manager.get_stickies(sticky_board_id, board_type, db)
        


    def update_sticky_note(self, request: PatchStickyNoteRequest, db: Session) -> StickyNote:
        return self.manager.update_sticky(request.id, request.content, request.color, db)



    def delete_sticky_note(self, id: int, db: Session) -> None:
        self.manager.delete_sticky(id, db)



    def add_sticky_board(self, request: PostStickyBoardRequest, db: Session) -> ( StandardStickyBoard | ColumnStickyBoard ):
        """
        This method will create a Sticky board based on the provided type
        (e.g. Board or Column) 
        """

        board_type: str = request.type
        board_name: str = request.name
        board_object = None

        if board_type == 'standard':
            board_object = StandardStickyBoard( name=board_name, type=board_type, creation=datetime.now() )
        elif board_type == 'column': 
            board_object = ColumnStickyBoard( name=board_name, type=board_type, creation=datetime.now() )

        db_board_object = self.manager.add_sticky_board(board_object, db).__dict__.copy()
        db_board_object['sticky_amount'] = 0
        return db_board_object


    def get_sticky_boards(self, db: Session) -> list[StandardStickyBoard, ColumnStickyBoard]:
        return self.manager.get_sticky_boards(db)
        

    def delete_sticky_board(self, sticky_board_id: str, board_type: str, db: Session) -> None:
        self.manager.delete_sticky_board(sticky_board_id, board_type, db)