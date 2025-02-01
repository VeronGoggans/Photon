from sqlalchemy.orm import Session
from src.backend.data.models import Folder
from src.backend.data.helpers import find_folder, get_entity_path, is_templates_folder_in_path
from src.backend.data.exceptions.exceptions import NotFoundException
from src.backend.util.event_bus import event_bus, convert_notes_event
from datetime import datetime


class FolderManager:

    def add(self, parent_id: int, folder: Folder, db: Session) -> Folder:
        find_folder(parent_id, db)
        db.add(folder)
        db.commit()
        db.refresh(folder)
        return folder
    


    def get(self, parent_id: int, db: Session) -> (list[Folder] | NotFoundException):
        find_folder(parent_id, db)
        return db.query(Folder).filter(Folder.parent_id == parent_id).all()
        

        
    def get_recent(self, db: Session) -> list:
        recent_folders = (
            db.query(Folder)
            .order_by(Folder.last_visit.desc()) 
            .limit(4) 
            .all()  
        )
        return recent_folders
    


    def get_search_items(self, db: Session) -> list:
        search_items = (db.query(Folder.id, Folder.name).all() )
        return [{"id": item.id, "name": item.name} for item in search_items]
    


    def get_pinned(self, db: Session) -> list:
        pinned_folders = (db.query(Folder).filter(Folder.pinned == True).all())
        return pinned_folders



    def get_by_id(self, folder_id: int, db: Session) -> (Folder | NotFoundException):
        folder = find_folder(folder_id, db)
        hierarchy = get_entity_path(folder_id, db)
        return folder, hierarchy
    


    def update(self, folder_id: int, folder_name: str, folder_color: str, db: Session) -> (Folder | NotFoundException):
        folder = find_folder(folder_id, db)
        folder.name = folder_name
        folder.color = folder_color

        db.commit()
        db.refresh(folder)
        return folder
    


    def update_location(self, folder_id: int, parent_folder_id: int, db: Session) -> Folder :
        # Check to see if the parent folder exists
        find_folder(parent_folder_id, db)

        # Retrieve the folder and update its parent_id to the new parent folder id
        folder = find_folder(folder_id, db)
        folder.parent_id = parent_folder_id

        # Check if the folder is related to the templates folder
        is_folder_related_to_the_templates_folder = is_templates_folder_in_path(parent_folder_id, db)  

        convert_notes_to_templates: bool = False

        if is_folder_related_to_the_templates_folder:
            convert_notes_to_templates = True
        
        # Emit an event that'll convert all notes in the folder to templates or notes 
        # based on the folder's relation to the templates folder
        event_bus.emit(
            convert_notes_event, 
            folder_id=folder_id, 
            to_template=convert_notes_to_templates, 
            db=db)
        

        db.commit()
        db.refresh(folder)
        return folder
    


    def update_view_time(self, folder_id: int, db: Session) -> (None | NotFoundException):
        folder = find_folder(folder_id, db)
        folder.last_visit = datetime.now()
        db.commit()



    def update_pin_value(self, folder_id: int, db: Session) -> (Folder | NotFoundException):
        folder = find_folder(folder_id, db)

        toggle_pin_value: bool = not folder.pinned
        folder.pinned = toggle_pin_value
        db.commit()
        db.refresh(folder)

        return folder



    def delete(self, folder_id: int, db: Session) -> (Folder | NotFoundException):
        folder = find_folder(folder_id, db)
        db.delete(folder)
        db.commit()
        return folder
    