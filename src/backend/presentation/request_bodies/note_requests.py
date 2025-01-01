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





# ________________________________ Sticky notes request bodies _______________________________________ #





class PostStickyBoardRequest(BaseModel):
    """
    - name (str): The name of the sticky wall
    - type (str): The board type (e.g. board or column)
    """
    name: str
    type: str




class PatchStickyBoardNameRequest(BaseModel):
    """
    - board_type (str): The type of sticky board
    - name (str): The new name of the sticky board
    """
    board_type: str
    name: str



class PatchStickyBoardDescriptionRequest(BaseModel):
    """
    - board_type (str): The type of sticky board
    - description (str): The new description of the sticky board
    """
    board_type: str
    description: str



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