from pydantic import BaseModel

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




class PostStickyWallRequest(BaseModel):
    """
    - name (str): The name of the sticky wall
    - description (str): The description of the sticky wall
    """
    name: str
    description: str


class PutStickyWallRequest(BaseModel):
    """
    - id (str): The ID of the sticky wall that will be updated.
    - name (str): The name of the sticky wall
    - content (str): The description of the sticky wall
    """
    id: int
    name: str
    description: str


class PostStickyNoteRequest(BaseModel):
    """
    - parent_id (int): The id of the sticky wall
    - name (str): The name of the sticky 
    - content (str): The content of the sticky
    """
    parent_id: int
    name: str
    content: str


class PutStickyNoteRequest(BaseModel):
    """
    - id (str): The ID of the sticky that will be updated.
    - name (str): The name of the sticky
    - content (str): The content of the sticky
    """
    id: int
    name: str
    content: str