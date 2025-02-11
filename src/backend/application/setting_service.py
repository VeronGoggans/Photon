from os import getcwd
from src.backend.util.file_utils import get_json_file, update_json_file
from src.backend.application.enums import SettingsAttributeKeys




class SettingService():
    SETTINGS_PATH = f'{getcwd()}/storage/settings.json'


    @staticmethod
    def get_settings() -> object:
        return get_json_file(SettingService.SETTINGS_PATH)
    


    @staticmethod
    def update_setting_attribute(attribute_key: str, attribute: str) -> str:
        config = get_json_file(SettingService.SETTINGS_PATH)
        config[attribute_key] = attribute

        update_json_file(SettingService.SETTINGS_PATH, config)
        return attribute
    


    @staticmethod
    def update_collapse_sidebar_subsection(subsection: str) -> bool:
        """
            Toggles the collapse state of a specified subsection in the sidebar.

            This method retrieves the current configuration, toggles the collapse 
            state for the specified subsection, updates the configuration, 
            and returns the new state.

            Args:
                subsection (str): The name of the subsection to toggle. 
                                Expected values: 'pinned-folder' or 'categories'.

            Returns:
                bool: The new collapse state (True for collapsed, False for expanded).

            Raises:
                KeyError: If the specified subsection is not valid or not found in the configuration.

            Behavior:
                - If `subsection` is 'pinned-folders', toggles the `COLLAPSED_PINNED_FOLDER` value.
                - If `subsection` is 'categories', toggles the `COLLAPED_CATEGORIES` value.
        """
        config: dict = get_json_file(SettingService.SETTINGS_PATH)
        current_state: bool = None 

        if subsection == 'pinned-folders':
            current_state = config[SettingsAttributeKeys.COLLAPSED_PINNED_FOLDER_ATTRIBUTE.value]

        elif subsection == 'categories':
            current_state = config[SettingsAttributeKeys.COLLAPED_CATEGORIES_ATTRIBUTE.value]

        else:
            raise KeyError(f"Invalid subsection: {subsection}")

        # Toggle the current state using the NOT operator.
        new_state: bool = not current_state

        # Update the configuration with the new state.
        if subsection == 'pinned-folders':
            config[SettingsAttributeKeys.COLLAPSED_PINNED_FOLDER_ATTRIBUTE.value] = new_state
        elif subsection == 'categories':
            config[SettingsAttributeKeys.COLLAPED_CATEGORIES_ATTRIBUTE.value] = new_state


        update_json_file(SettingService.SETTINGS_PATH, config)
        return new_state

