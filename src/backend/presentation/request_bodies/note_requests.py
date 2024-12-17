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




class PutNoteRequest(BaseModel):
    """
    - note_id (int): The ID of the note that will be updated.
    - name (str): The name of the note.
    - content (str): The content of the note.
    - bookmrk (bool): A boolean indicating if the note is boomarked or not.
    """
    note_id: int
    name: str
    content: str
    bookmark: bool




class BookmarkRequest(BaseModel):
    """
    - bookmark (bool): the new bookmark value
    """
    bookmark: bool




class MoveNoteRequest(BaseModel):
    """
    FolderId is the id of the folder the note is moved into
    """
    folder_id: int
    note_id: int





# ________________________________ Sticky notes request bodies _______________________________________ #





class PostStickyBoardRequest(BaseModel):
    """
    - name (str): The name of the sticky wall
    - type (str): The board type (e.g. board or column)
    """
    name: str
    type: str




class PatchStickyBoardRequest(BaseModel):
    """
    - id (str): The ID of the sticky wall that will be updated.
    - name (str): The name of the sticky wall
    - content (str): The description of the sticky wall
    """
    id: int
    name: Optional[str] = None
    description: Optional[str] = None




class PostStickyNoteRequest(BaseModel):
    """
    - parent_id (int): The id of the sticky board
    - content (str): The content of the sticky
    - color (str): the color of the sticky
    """
    parent_id: int
    content: str
    color: str




class PatchStickyNoteRequest(BaseModel):
    """
    - id (str): The ID of the sticky that will be updated
    - content (str): The content of the sticky
    - color (str): the color of the sticky
    """
    id: int
    content: Optional[str] = None
    color: Optional[str] = None