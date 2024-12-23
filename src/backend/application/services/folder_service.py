from src.backend.data.managers.folder_manager import FolderManager
from sqlalchemy.orm import Session
from src.backend.presentation.request_bodies.folder_requests import *
from src.backend.data.exceptions.exceptions import *
from src.backend.data.models import Folder



class FolderService:
    def __init__(self, manager: FolderManager):
        self.manager = manager


    def add_folder(self, schema: FolderRequest, db: Session) -> Folder:
        new_folder = Folder(
            name = schema.name, 
            color = schema.color, 
            parent_id = schema.parent_id
            )
        return self.manager.add(schema.parent_id, new_folder, db)



    def get_folders(self, db: Session, parent_id: int = None, filters: dict = None) -> list[Folder]:
        """
        
        """
        if parent_id is not None:
            return self.manager.get(parent_id, db)
        
        if filters:
            if filters.get('recent'):
                return self.manager.get_recent(db)
            
            elif filters.get('search-items'):
                return self.manager.get_search_items(db)
            
