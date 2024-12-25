from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.backend.data.database import Database
from src.backend.application.services.note_service import NoteService
from src.backend.data.managers.note_manager import NoteManager
from src.backend.presentation.request_bodies.note_requests import *
from src.backend.presentation.http_status import HttpStatus
from src.backend.data.exceptions.exception_handler import handle_exceptions
from src.backend.presentation.response import JSONResponse




class NoteRouter:
    def __init__(self):
        self.route = APIRouter()
        self.manager = NoteManager()
        self.service = NoteService(self.manager)

        self.route.add_api_route('/notes', self.add_note, methods=['POST'])
        self.route.add_api_route('/notes', self.get_notes, methods=['GET'])
        self.route.add_api_route('/notes/{note_id}', self.get_note_by_id, methods=['GET'])
        self.route.add_api_route('/notes/{note_id}/location', self.update_note_location, methods=['PATCH'])
        self.route.add_api_route('/notes/{note_id}/name', self.update_note_name, methods=['PATCH'])
        self.route.add_api_route('/notes/{note_id}/content', self.update_note_content, methods=['PATCH'])
        self.route.add_api_route('/notes/{note_id}/bookmark', self.update_note_bookmark, methods=['PATCH'])
        self.route.add_api_route('/notes/{note_id}/view-time', self.update_note_visit_time, methods=['PATCH'])
        self.route.add_api_route('/notes/{note_id}', self.delete_note, methods=['DELETE'])




    @handle_exceptions
    def add_note(self, request: PostNoteRequest, db: Session = Depends(Database.get_db)):
        note = self.service.add_note(request, db)
        return JSONResponse(status_code=HttpStatus.CREATED, content={'note': note})
            


    @handle_exceptions
    def get_notes(self, 
                  folder_id: int = None,
                  bookmarks: bool = False, 
                  recent: bool = False, 
                  recently_viewed: bool = False, 
                  search_items: bool = False, 
                  db: Session = Depends(Database.get_db)):
        
        # A dictionary with all the endpoint filters that can be applied to the GET "/notes" endpoint
        filters = {
            'bookmarks': bookmarks,
            'recent': recent,
            'recently-viewed': recently_viewed,
            'search-items': search_items
        }

        # Only one filter should be True with any given request
        if sum(filters.values()) > 1:
            raise ValueError("Only one filter can be applied at a time.")
        

        notes = self.service.get_notes(db, folder_id, filters)
        return JSONResponse(status_code=HttpStatus.OK, content={'notes': notes})
       


    @handle_exceptions
    def get_note_by_id(self, note_id: int, db: Session = Depends(Database.get_db)):
        note, hierarchy = self.manager.get_by_id(note_id, db)
        return JSONResponse(status_code=HttpStatus.OK, content={'note': note, 'location': hierarchy}) 



    @handle_exceptions
    def update_note_name(self, note_id: int, request: PatchNoteNameRequest, db: Session = Depends(Database.get_db)):
        self.manager.update_name(note_id, request.name, db)
        return JSONResponse(status_code=HttpStatus.NO_CONTENT)
    


    @handle_exceptions
    def update_note_content(self, note_id: int, request: PatchNoteContentRequest, db: Session = Depends(Database.get_db)):
        self.manager.update_content(note_id, request.content, db)
        return JSONResponse(status_code=HttpStatus.NO_CONTENT)



    @handle_exceptions
    def update_note_bookmark(self, note_id: int, request: PatchNoteBookmarkRequest, db: Session = Depends(Database.get_db)):
        self.manager.update_bookmark(note_id, request.bookmark, db)
        return JSONResponse(status_code=HttpStatus.NO_CONTENT)
    


    @handle_exceptions
    def update_note_visit_time(self, note_id: int, db: Session = Depends(Database.get_db)):
        self.manager.update_view_time(note_id, db) 
        return JSONResponse(status_code=HttpStatus.NO_CONTENT)



    @handle_exceptions
    def update_note_location(self, request: MoveNoteRequest, db: Session = Depends(Database.get_db)):
        self.manager.update_location(request.folder_id, request.note_id, db)
        return JSONResponse(status_code=HttpStatus.NO_CONTENT)
    


    @handle_exceptions
    def delete_note(self, note_id: int, db: Session = Depends(Database.get_db)):
        note = self.manager.delete(note_id, db)
        return JSONResponse(status_code=HttpStatus.OK, content={'note': note})