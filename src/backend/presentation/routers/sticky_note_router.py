from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.backend.data.database import Database
from src.backend.application.services.sticky_note_service import StickyNoteService
from src.backend.data.managers.sticky_note_manager import StickyNoteManager
from src.backend.presentation.request_bodies.note_requests import PostStickyBoardRequest, PostStickyNoteRequest, PatchStickyBoardRequest, PatchStickyNoteRequest
from src.backend.presentation.http_status import HttpStatus
from src.backend.data.exceptions.exception_handler import handle_exceptions
from src.backend.presentation.response import JSONResponse



class StickyNoteRouter:
    def __init__(self):
        self.route = APIRouter()
        self.manager = StickyNoteManager()
        self.service = StickyNoteService(self.manager)

        self.route.add_api_route('/stickyNotes',                                     self.add_sticky_note, methods=['POST'])
        self.route.add_api_route('/stickyNotes/{sticky_board_id}/{board_type}',      self.get_sticky_notes, methods=['GET'])
        self.route.add_api_route('/stickyNotes{sticky_note_id}',                     self.update_sticky_note, methods=['PUT'])
        self.route.add_api_route('/stickyNotes/{sticky_note_id}',                    self.delete_sticky_note, methods=['DELETE'])

        self.route.add_api_route('/stickyBoards',                                    self.add_sticky_board, methods=['POST'])
        self.route.add_api_route('/stickyBoards',                                    self.get_sticky_boards, methods=['GET'])
        self.route.add_api_route('/stickyBoards',                                    self.patch_sticky_board, methods=['PATCH'])
        self.route.add_api_route('/stickyBoards/{sticky_board_id}/{board_type}',     self.delete_sticky_board, methods=['DELETE'])
        


    @handle_exceptions
    def add_sticky_board(self, request: PostStickyBoardRequest, db: Session = Depends(Database.get_db)):
        sticky_board = self.service.add_sticky_board(request, db)
        return JSONResponse(status_code=HttpStatus.OK, content={'stickyBoard': sticky_board})



    @handle_exceptions
    def get_sticky_boards(self, db: Session = Depends(Database.get_db)):
        sticky_boards = self.manager.get_sticky_boards(db)
        return JSONResponse(status_code=HttpStatus.OK, content={'sticky-boards': sticky_boards})



    @handle_exceptions
    def patch_sticky_board(self, request: PatchStickyBoardRequest, db: Session = Depends(Database.get_db)):
        sticky_board = self.service.update_sticky_board(request, db)
        return JSONResponse(status_code=HttpStatus.OK, content={'sticky-board': sticky_board})
    


    @handle_exceptions
    def delete_sticky_board(self, sticky_board_id: int, board_type: str, db: Session = Depends(Database.get_db)):
        self.manager.delete_sticky_board(sticky_board_id, board_type, db);
        return JSONResponse(status_code=HttpStatus.NO_CONTENT)
    


    @handle_exceptions
    def add_sticky_note(self, request: PostStickyNoteRequest, db: Session = Depends(Database.get_db)):
        sticky_note = self.service.add_sticky_note(request, db)
        return JSONResponse(status_code=HttpStatus.OK, content={'sticky-note': sticky_note})
       


    @handle_exceptions
    def get_sticky_notes(self, sticky_board_id: int, board_type: str, db: Session = Depends(Database.get_db)):
        sticky_notes = self.manager.get_stickies(sticky_board_id, board_type, db)
        return JSONResponse(status_code=HttpStatus.OK, content={'sticky-notes': sticky_notes})



    @handle_exceptions
    def update_sticky_note(self, sticky_note_id: int,  request: PatchStickyNoteRequest, db: Session = Depends(Database.get_db)):
        sticky_note = self.manager.update_sticky(sticky_note_id, request.content, request.color, db)
        return JSONResponse(status_code=HttpStatus.OK, content={'sticky-note': sticky_note})
        


    @handle_exceptions
    def delete_sticky_note(self, sticky_note_id: int, db: Session = Depends(Database.get_db)):
        self.manager.delete_sticky(sticky_note_id, db)
        return JSONResponse(status_code=HttpStatus.NO_CONTENT)
    