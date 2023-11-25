from backend.data.note.folder_note_manager import FolderNoteManager
from backend.data.note.subfolder_note_manager import SubFolderNoteManager
from backend.presentation.request_bodies.note_request import NoteRequest
from backend.application.generators.Id_generator import IDGenerator
from backend.domain.note import Note
from backend.data.file.json_manager import Json
from backend.domain.enums.responseMessages import RespMsg
import os 

class NoteService:
    def __init__(self, folder_note_manager: FolderNoteManager, subfolder_note_manager: SubFolderNoteManager):
        self.folder_note_manager = folder_note_manager
        self.subfolder_note_manager = subfolder_note_manager
        self.folders_path = os.getcwd() + '/storage/json/notes.json'



    def get_notes(self, folder_id: int, note_type: str):
        folder_structure = Json.load_json_file(self.folders_path)
        folders = folder_structure['categories']
        notes = self.folder_note_manager.get_notes(folders, folder_id, note_type)

        if notes:
            return notes
        return RespMsg.NOT_FOUND

    


    def get_note_by_id(self, note_id: int):
        folders = Json.load_json_file(self.folders_path)['categories']
        note = self.folder_note_manager.get_note_by_id(folders, note_id)
        if note:
            return note
        return RespMsg.NOT_FOUND
    


    def add_note(self, folder_id: int, note_data: NoteRequest):
        note : Note = self.__construct_note_object(note_data)
        note.set_content_path()
        folder_structure = Json.load_json_file(self.folders_path)
        folders = folder_structure['categories']
        new_note = self.folder_note_manager.add_note(folders, folder_id, note)

        if new_note:
            Json.update_json_file(self.folders_path, folder_structure)
            return new_note
        return RespMsg.NOT_FOUND
    
    

    def update_note(self, note_id: int, note_data: NoteRequest):
        folder_structure = Json.load_json_file(self.folders_path)
        folders = folder_structure['categories']
        note = self.folder_note_manager.update_note(folders, note_id, note_data)

        if note:
            Json.update_json_file(self.folders_path, folder_structure)
            return note 
        return RespMsg.NOT_FOUND
    


    def delete_note(self, note_id: int):
        folder_structure = Json.load_json_file(self.folders_path)
        folders = folder_structure['categories']
        deleted_note = self.folder_note_manager.delete_note(folders, note_id)

        if deleted_note:
            Json.update_json_file(self.folders_path, folder_structure)
            return RespMsg.OK
        return RespMsg.NOT_FOUND



    def __construct_note_object(self, note_data: NoteRequest):
        note_id = IDGenerator.ID("note")
        return Note(
            note_id, 
            note_data.title, 
            note_data.content, 
            note_data.bookmark, 
            note_data.password_protected
            )