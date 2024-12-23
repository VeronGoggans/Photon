from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.backend.data.database import Database
from src.backend.data.managers.folder_manager import FolderManager
from src.backend.presentation.request_bodies.folder_requests import FolderRequest, MoveFolderRequest, PutFolderRequest
from src.backend.presentation.http_status import HttpStatus
from src.backend.application.services.folder_service import FolderService
from src.backend.data.exceptions.exception_handler import handle_exceptions
from src.backend.presentation.response import JSONResponse



class FolderRouter:
    def __init__(self):
        self.route = APIRouter()
        self.manager = FolderManager()
        self.service = FolderService(self.manager)

        self.route.add_api_route('/folders', self.add_folder, methods=['POST'])
        self.route.add_api_route('/folders', self.get_folders, methods=['GET'])
        self.route.add_api_route('/folders/{folder_id}', self.get_folder_by_id, methods=['GET'])
        self.route.add_api_route('/folders', self.update_folder, methods=['PUT'])
        self.route.add_api_route('/folders/{folder_id}/location', self.update_folder_location, methods=['PUT'])
        self.route.add_api_route('/folders/{folder_id}/view-time', self.update_folder_view_time, methods=['PATCH'])
        self.route.add_api_route('/folders/{folder_id}', self.delete_folder, methods=['DELETE'])



    @handle_exceptions
    def add_folder(self, request: FolderRequest, db: Session = Depends(Database.get_db)):
        folder = self.service.add_folder(request, db)
        return JSONResponse(status_code=HttpStatus.CREATED, content={'folder': folder})
        


    @handle_exceptions
    def get_folders(self, 
                    parent_id: int = None,
                    recent: bool = False,
                    search_items: bool = False,
                    db: Session = Depends(Database.get_db)):
        
        # A dictionary with all the endpoint filters that can be applied to the GET "/notes" endpoint
        filters = { 
            'recent': recent,
            'search-items': search_items 
            }


        # Only one filter should be True with any given request
        if sum(filters.values()) > 1:
            raise ValueError("Only one filter can be applied at a time.")


        folders = self.service.get_folders(db, parent_id, filters)
        return JSONResponse(status_code=HttpStatus.OK, content={'folders': folders})



    @handle_exceptions
    def get_folder_by_id(self, folder_id: int, db: Session = Depends(Database.get_db)):
        folder, hierarchy = self.manager.get_by_id(folder_id, db)
        return JSONResponse(status_code=HttpStatus.OK, content={'folder': folder, 'location': hierarchy})



    @handle_exceptions
    def update_folder(self, request: PutFolderRequest, db: Session = Depends(Database.get_db)):
        folder = self.manager.update(request, db)
        return JSONResponse(status_code=HttpStatus.OK, content={'folder': folder})
    


    @handle_exceptions
    def update_folder_location(self, request: MoveFolderRequest, db: Session = Depends(Database.get_db)):
        folder = self.manager.update_location(request, db)
        return JSONResponse(status_code=HttpStatus.OK, content={'folder': folder})
        


    @handle_exceptions
    def update_folder_view_time(self, folder_id: int, db: Session = Depends(Database.get_db)):
        self.manager.update_view_time(folder_id, db) 
        return JSONResponse(status_code=HttpStatus.NO_CONTENT)
       

        
    @handle_exceptions
    def delete_folder(self, folder_id: int, db: Session = Depends(Database.get_db)):
        folder = self.manager.delete(folder_id, db)
        return JSONResponse(status_code=HttpStatus.OK, content={'folder': folder})