import json
from typing import Dict



def get_json_file(file_path: str) -> Dict:
    """
    Reads a JSON file and returns its contents as a dictionary.

    Args:
        file_path (str): The path to the JSON file.

    Returns:
        dict: The deserialized JSON content as a Python dictionary.

    Raises:
        FileNotFoundError: If the file does not exist.
        json.JSONDecodeError: If the file contains invalid JSON.
    """
    with open(file_path, 'r') as file:  # Open the settings file in read mode.
        return json.load(file)          # Deserialize the content into a dictionary.


def update_json_file(file_path: str, updated_json: Dict) -> None:
    """
    Writes a dictionary to a JSON file, overwriting existing content.

    Args:
        file_path (str): The path to the JSON file.
        updated_json (dict): The dictionary to serialize and save.

    Returns:
        None

    Raises:
        IOError: If there is an issue writing to the file.
    """
    with open(file_path, 'w') as file:           # Open the settings file in write mode.
        json.dump(updated_json, file, indent=4)  # Serialize and write the dictionary to the file.

