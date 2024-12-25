from pydantic import BaseModel



class PostFolderRequest(BaseModel):
    """
    - parent_id (int): The id of the parent folder.
    - color (str): The color for the new folder.
    - name (str): The name of the new folder.
    """
    parent_id: int
    color: str
    name: str



class PutFolderRequest(BaseModel): 
    """
    - name (str): The new name of the folder.
    - color (str): The new color for the folder.
    """
    name: str
    color: str



class PatchFolderLocationRequest(BaseModel):
    """
    - parent_id (str): The id of the folder that the dropped folder will move in to. 
    """
    parent_id: int
