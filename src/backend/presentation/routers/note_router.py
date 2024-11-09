from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.backend.data.database import Database
from src.backend.application.services.note_service import NoteService
from src.backend.data.managers.note_manager import NoteManager
from src.backend.presentation.request_bodies.note_requests import *
from src.backend.presentation.http_status import HttpStatus
from src.backend.data.exceptions.exception_handler import handle_exceptions


class NoteRouter:
    def __init__(self):
        self.route = APIRouter()
        self.service = NoteService(NoteManager())

        self.route.add_api_route('/note', self.add_note, methods=['POST'])
        self.route.add_api_route('/notes/{folder_id}', self.get_notes, methods=['GET'])
        self.route.add_api_route('/noteById/{note_id}', self.get_note_by_id, methods=['GET'])
        self.route.add_api_route('/noteSearchItems', self.get_search_items, methods=['GET'])
        self.route.add_api_route('/recentNotes', self.get_recent_notes, methods=['GET'])
        self.route.add_api_route('/note', self.update_note, methods=['PUT'])
        self.route.add_api_route('/moveNote', self.move_note, methods=['PUT'])
        self.route.add_api_route('/note/{note_id}', self.delete_note, methods=['DELETE'])
        self.route.add_api_route('/note/{note_id}/bookmark', self.update_bookmark, methods=['PATCH'])


    @handle_exceptions
    def add_note(self, request: PostNoteRequest, db: Session = Depends(Database.get_db)):
        return {'status': HttpStatus.OK, 'note': self.service.add_note(request, db)}


    @handle_exceptions
    def get_notes(self, folder_id: int, db: Session = Depends(Database.get_db)):
        return {'status': HttpStatus.OK, 'notes': self.service.get_notes(folder_id, db)}
       

    @handle_exceptions
    def get_note_by_id(self, note_id: int, db: Session = Depends(Database.get_db)):
        note, hierarchy = self.service.get_note_by_id(note_id, db)
        return {'status': HttpStatus.OK, 'note': note, 'location': hierarchy}


    @handle_exceptions
    def get_search_items(self, db: Session = Depends(Database.get_db)):
        return {'status': HttpStatus.OK, 'notes': self.service.get_search_options(db)}
        

    @handle_exceptions
    def get_recent_notes(self, db: Session = Depends(Database.get_db)):
        return {'status': HttpStatus.OK, 'notes': self.service.get_recent_notes(db)}
    

    @handle_exceptions
    def update_note(self, request: PutNoteRequest, db: Session = Depends(Database.get_db)):
        return {'status': HttpStatus.OK, 'note': self.service.update_note(request, db)}
    

    @handle_exceptions
    def update_bookmark(self, note_id: int, request: BookmarkRequest, db: Session = Depends(Database.get_db)):
        self.service.update_bookmark(note_id, request, db)
        return { 'status': HttpStatus.OK}


    @handle_exceptions
    def move_note(self, request: MoveNoteRequest, db: Session = Depends(Database.get_db)):
        return {'status': HttpStatus.OK, 'note': self.service.move_note(request.folder_id, request.note_id, db)}


    @handle_exceptions
    def delete_note(self, note_id: int, db: Session = Depends(Database.get_db)):
        return {'status': HttpStatus.OK, 'note': self.service.delete_note(note_id, db)}