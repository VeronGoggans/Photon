from src.backend.domain.folder import Folder

class FolderManager:

    def get_folders(self, folders) -> list:
        """
        Retrieve a list of information (id, name) of folders/subfolders from the notes structure.

        Args:
            folders (List[dict]): The list of folders to search within.
        
        Returns:
            list[dict]:
            - Each dictionary includes 'id' and 'name' keys representing the directory's unique identifier and name.
        """
        folder_list = []
        for folder in folders:
            folder_list.append({
                'id': folder['id'], 
                'name': folder['name'],
                'color': folder['color']
                })
        return folder_list


    def add_folder(self, folders, folder: Folder):
        """
        Add a new folder to the notes structure.

        Args:
            folders (List[dict]): The list of folders to search within.
            folder (Folder): a folder object that will be added to the notes structure.

        Returns:
           dict:
            - If successful, it returns the folder.
        """
        folders.append(folder.__dict__)
        return folder

    
    def update_folder(self, folders, folder_id: str, folder_name: str, folder_color: str):
        """
        Update the name of a folder in the notes structure.

        Args:
            folders (List[dict]): The list of folders to search within.
            folder_id (str): The unique identifier of the folder to update.
            folder_name (str): The new name for the folder.
            folder_color (str): The new color for the folder.

        Returns:
            dict or None:
            - If successful, it returns the folder.
            - If the folder is not found, it returns None.
        """        
        for folder in folders:
            if folder.get('id') == folder_id:
                folder['name'] = folder_name
                folder['color'] = folder_color
                return {'name': folder_name, 'id': folder_id, 'color': folder_color}
        return None
        
    
    def delete_folder(self, folders, folder_id: str):
        """
        Delete a folder from the notes structure.

        Args:
            folders (List[dict]): The list of folders to search within.
            folder_id (str): The unique identifier of the folder to delete.

        Returns:
            dict or None:
            - If successful, it returns the folder.
            - If the folder is not found, it returns None.
        """
        for folder in folders:
            if folder.get('id') == folder_id:
                folders.remove(folder)
                return folder 
        return None