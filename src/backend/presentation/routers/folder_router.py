from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.backend.data.database import Database
from src.backend.data.managers.folder_manager import FolderManager
from src.backend.presentation.request_bodies.folder_requests import FolderRequest, MoveFolderRequest, PutFolderRequest
from src.backend.presentation.http_status import HttpStatus
from src.backend.application.services.folder_service import FolderService
from src.backend.data.exceptions.exception_handler import handle_exceptions

class FolderRouter:
    def __init__(self):
        self.route = APIRouter()
        self.service = FolderService(FolderManager())

        self.route.add_api_route('/folder', self.add_folder, methods=['POST'])
        self.route.add_api_route('/folders/{parent_id}', self.get_folders, methods=['GET'])
        self.route.add_api_route('/recentFolders', self.get_recent_folders, methods=['GET'])
        self.route.add_api_route('/folderSearchItems', self.get_search_items, methods=['GET'])
        self.route.add_api_route('/folderById/{folder_id}', self.get_folder_by_id, methods=['GET'])
        self.route.add_api_route('/folder', self.update_folder, methods=['PUT'])
        self.route.add_api_route('/moveFolder', self.move_folder, methods=['PUT'])
        self.route.add_api_route('/folder/{folder_id}', self.delete_folder, methods=['DELETE'])
        self.route.add_api_route('/viewedFolderTime/{folder_id}', self.folder_visit, methods=['PATCH'])


    @handle_exceptions
    def add_folder(self, request: FolderRequest, db: Session = Depends(Database.get_db)):
        return {'status': HttpStatus.OK, "folder": self.service.add_folder(request, db)}
        

    @handle_exceptions
    def get_folders(self, parent_id: int, db: Session = Depends(Database.get_db)):
        return {"status": HttpStatus.OK, "folders": self.service.get_folders(parent_id, db)}

        
    @handle_exceptions
    def get_recent_folders(self, db: Session = Depends(Database.get_db)):
        return {"status": HttpStatus.OK, "folders": self.service.get_recent_folders(db)}
        

    @handle_exceptions
    def get_search_items(self, db: Session = Depends(Database.get_db)):
        return {'status': HttpStatus.OK, 'folders': self.service.get_search_items(db)}
        

    @handle_exceptions
    def get_folder_by_id(self, folder_id: int, db: Session = Depends(Database.get_db)):
        folder, hierarchy = self.service.get_folder_by_id(folder_id, db)
        return {'status': HttpStatus.OK, 'folder': folder, 'location': hierarchy}


    @handle_exceptions
    def update_folder(self, request: PutFolderRequest, db: Session = Depends(Database.get_db)):
        return {'status': HttpStatus.OK, "folder": self.service.update_folder(request, db)}
    

    @handle_exceptions
    def move_folder(self, request: MoveFolderRequest, db: Session = Depends(Database.get_db)):
        return {'status': HttpStatus.OK, "folder": self.service.move_folder(request, db)}
        

    @handle_exceptions
    def folder_visit(self, folder_id: int, db: Session = Depends(Database.get_db)):
        self.service.update_visit(folder_id, db) 
        return {'status': HttpStatus.OK}
       
        
    @handle_exceptions
    def delete_folder(self, folder_id: int, db: Session = Depends(Database.get_db)):
        return {'status': HttpStatus.OK, "folder": self.service.delete_folder(folder_id, db)}