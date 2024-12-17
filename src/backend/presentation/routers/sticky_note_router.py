from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.backend.data.database import Database
from src.backend.application.services.sticky_note_service import StickyNoteService
from src.backend.data.managers.sticky_note_manager import StickyNoteManager
from src.backend.presentation.request_bodies.note_requests import PostStickyBoardRequest, PostStickyNoteRequest, PatchStickyBoardRequest, PatchStickyNoteRequest
from src.backend.presentation.http_status import HttpStatus
from src.backend.data.exceptions.exception_handler import handle_exceptions



class StickyNoteRouter:
    def __init__(self):
        self.route = APIRouter()
        self.service = StickyNoteService(StickyNoteManager())

        self.route.add_api_route('/stickyNote', self.add_sticky_note, methods=['POST'])
        self.route.add_api_route('/stickyNotes/{sticky_board_id}/{board_type}', self.get_sticky_notes, methods=['GET'])
        self.route.add_api_route('/stickyNote', self.update_sticky_note, methods=['PUT'])
        self.route.add_api_route('/stickyNote/{id}', self.delete_sticky_note, methods=['DELETE'])

        self.route.add_api_route('/stickyBoard', self.add_sticky_board, methods=['POST'])
        self.route.add_api_route('/stickyBoards', self.get_sticky_boards, methods=['GET'])
        self.route.add_api_route('/stickyBoard', self.patch_sticky_board, methods=['PATCH'])
        self.route.add_api_route('/stickyBoard/{id}', self.delete_sticky_board, methods=['DELETE'])
        

    @handle_exceptions
    def add_sticky_board(self, request: PostStickyBoardRequest, db: Session = Depends(Database.get_db)):
        return { 'status': HttpStatus.OK, 'StickyBoard': self.service.add_sticky_board(request, db) }


    @handle_exceptions
    def get_sticky_boards(self, db: Session = Depends(Database.get_db)):
        return { 'status': HttpStatus.OK, 'StickyBoards': self.service.get_sticky_boards(db) }
       

    @handle_exceptions
    def patch_sticky_board(self, request: PatchStickyBoardRequest, db: Session = Depends(Database.get_db)):
        return { 'status': HttpStatus.OK, 'Object': self.service.update_sticky_board(request, db) }
    

    @handle_exceptions
    def delete_sticky_board(self, id: str, db: Session = Depends(Database.get_db)):
        self.service.delete_sticky_board(id, db)
        return { 'status': HttpStatus.OK }
    





    @handle_exceptions
    def add_sticky_note(self, request: PostStickyNoteRequest, db: Session = Depends(Database.get_db)):
        return { 'status': HttpStatus.OK, 'Object': self.service.add_sticky_note(request, db) }
       

    @handle_exceptions
    def get_sticky_notes(self, sticky_board_id: int, board_type: str, db: Session = Depends(Database.get_db)):
        return {'status': HttpStatus.OK, 'Objects': self.service.get_sticky_notes(sticky_board_id, board_type, db)}
       

    @handle_exceptions
    def update_sticky_note(self, request: PatchStickyNoteRequest, db: Session = Depends(Database.get_db)):
        return { 'status': HttpStatus.OK, 'Object': self.service.update_sticky_note(request, db) }
    

    @handle_exceptions
    def delete_sticky_note(self, id: str, db: Session = Depends(Database.get_db)):
        self.service.delete_sticky_note(id, db)
        return { 'status': HttpStatus.OK }


    