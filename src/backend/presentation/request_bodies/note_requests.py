from pydantic import BaseModel
from typing import Optional




class PostNoteRequest(BaseModel):
    """
    - folder_id (int): The ID of the folder to which the note will be added to.
    - name (str): The name of the note.
    - content (str): The content of the note.
    """
    folder_id: int
    name: str
    content: str




class PatchNoteContentRequest(BaseModel):
    """
    - content (str): The updated content of the note.
    """
    content: str




class PatchNoteNameRequest(BaseModel):
    """
    - name (str): The updated name of the note.
    """
    name: str




class PatchNoteBookmarkRequest(BaseModel):
    """
    - bookmark (bool): the new bookmark value.
    """
    bookmark: bool




class PatchNoteLocationRequest(BaseModel):
    """
    - parent_id (str): is the id of the folder the note is moved into
    """
    parent_id: int
