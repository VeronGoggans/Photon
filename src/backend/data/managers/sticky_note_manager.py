from sqlalchemy.orm import Session
from src.backend.data.models import StickyNote, StickyBoard, StickyColumnBoard, StickyColumn
from src.backend.data.exceptions.exceptions import InsertException, NotFoundException
from sqlalchemy import union_all, select, text



class StickyNoteManager:

    def add_sticky(self, sticky_note: StickyNote, db: Session) -> (StickyNote | InsertException):
        db.add(sticky_note)
        db.commit()
        db.refresh(sticky_note)
        return sticky_note


    def get_stickies(self, sticky_wall_id: int, db: Session):
        return db.query(StickyNote).filter(StickyNote.sticky_wall_id == sticky_wall_id).all()


    def update_sticky(self, id: int, content: str, color: str, db: Session) -> (StickyNote | NotFoundException):
        sticky_note = self.__find_sticky_note(id, db)
        sticky_note.content = content
        sticky_note.color = color

        db.commit()
        db.refresh(sticky_note)
        return sticky_note


    def delete_sticky(self, id: int, db: Session) -> (None | NotFoundException):
        sticky_note = self.__find_sticky_note(id, db)
        db.delete(sticky_note)
        db.commit()

    





    def add_sticky_board(self, sticky_board, db: Session) -> ( StickyBoard | StickyColumnBoard ):
        db.add(sticky_board)
        db.commit()
        db.refresh(sticky_board)
        return sticky_board



    def get_sticky_boards(self, db: Session) -> list[StickyBoard, StickyColumnBoard]:
        sticky_boards = db.query(StickyBoard).all()
        sticky_column_boards = db.query(StickyColumnBoard).all()

        all_boards = sticky_boards + sticky_column_boards
        all_boards_sorted = sorted(all_boards, key=lambda board: board.creation)

        return all_boards_sorted
    

    def update_sticky_board(self, id: int, name: str, description: str, db: Session) -> StickyBoard:
        sticky_board = self.__find_sticky_board(id, db)
        sticky_board.name = name
        sticky_board.description = description
        db.commit()
        db.refresh(sticky_board)
        return sticky_board


    def delete_sticky_board(self, id: int, db: Session) -> None:
        sticky_wall = self.__find_sticky_board(id, db)
        db.delete(sticky_wall)
        db.commit()





    def __find_sticky_board(self, id: int, db: Session) -> ( StickyBoard | NotFoundException ):
        sticky_board = db.query(StickyBoard).filter(StickyBoard.id == id).first()

        if sticky_board is None:
            raise NotFoundException(f'Sticky board with id {id} not found.')
        return sticky_board
    

    def __find_sticky_column_board(self, id: int, db: Session) -> ( StickyColumnBoard | NotFoundException ):
        sticky_column_board = db.query(StickyColumnBoard).filter(StickyColumnBoard.id == id).first()

        if sticky_column_board is None:
            raise NotFoundException(f'Sticky column board with id {id} not found.')
        return sticky_column_board
    

    def __find_column(self, id: int, db: Session) -> ( StickyColumn | NotFoundException ):
        sticky_column = db.query(StickyColumn).filter(StickyColumn.id == id).first()

        if sticky_column is None:
            raise NotFoundException(f'Sticky column with id {id} not found.')
        return sticky_column


    def __find_sticky_note(self, id: int, db: Session) -> ( StickyNote | NotFoundException ):
        sticky_note = db.query(StickyNote).filter(StickyNote.id == id).first()

        if sticky_note is None:
            raise NotFoundException(f'Sticky note with id {id} not found.')
        return sticky_note
