from pydantic import BaseModel



class FolderRequest(BaseModel):
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
    - folder_id (str): The id of the folder that will be updated 
    - name (str): The new name of the folder.
    - color (str): The new color for the folder.
    """
    folder_id: int
    name: str
    color: str



class MoveFolderRequest(BaseModel):
    """
    - parent_id (str): The id of the folder that the dropped folder will move in to. 
    """
    parent_id: int
