from enum import Enum
from sqlalchemy.orm import Session
from src.backend.data.models import StickyNote, StickyBoardColumn, StandardStickyBoard, ColumnStickyBoard
from src.backend.data.exceptions.exceptions import NotFoundException
from sqlalchemy import union_all, select, text
from src.backend.data.helpers import find_column_sticky_board, find_standard_sticky_board, find_column, find_sticky_note


class BoardType(Enum):
    STANDARD = 'standard'
    COLUMN = 'column'




class StickyNoteManager:

    def add_sticky(self, sticky_note: StickyNote, db: Session) -> StickyNote:
        db.add(sticky_note)
        db.commit()
        db.refresh(sticky_note)
        return sticky_note



    def get_stickies(self, sticky_board_id: int, board_type: str, db: Session) -> list[StickyNote]:
        if board_type == BoardType.STANDARD:
            return db.query(StickyNote).filter(StickyNote.sticky_board_id == sticky_board_id).all()
        
        elif board_type == BoardType.COLUMN:
            pass



    def update_sticky(self, sticky_note_id: int, content: str, color: str, db: Session) -> (StickyNote | NotFoundException):
        sticky_note = find_sticky_note(id, db)
        sticky_note.content = content
        sticky_note.color = color

        db.commit()
        db.refresh(sticky_note)
        return sticky_note



    def delete_sticky(self, sticky_note_id: int, db: Session) -> (None | NotFoundException):
        sticky_note = find_sticky_note(id, db)
        db.delete(sticky_note)
        db.commit()

    





    def add_sticky_board(self, sticky_board, db: Session) -> ( StandardStickyBoard | ColumnStickyBoard ):
        db.add(sticky_board)
        db.commit()
        db.refresh(sticky_board)
        return sticky_board



    def get_sticky_boards(self, db: Session) -> object:
        standard_sticky_boards = db.query(StandardStickyBoard).all()
        column_sticky_boards = db.query(ColumnStickyBoard).all()

        return {
            'standardStickyBoards': standard_sticky_boards,
            'columnStickyBoards': column_sticky_boards
        }




    def delete_sticky_board(self, sticky_board_id: int, board_type: str, db: Session) -> None:
        sticky_board = None

        if board_type == BoardType.STANDARD.value:
            sticky_board = find_standard_sticky_board(sticky_board_id, db)

        elif board_type == BoardType.COLUMN.value:
            sticky_board = find_column_sticky_board(sticky_board_id, db)


        db.delete(sticky_board)
        db.commit()


