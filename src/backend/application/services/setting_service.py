from os import getcwd
from json import load, dump



# Constants for the configuration keys.
THEME = 'theme'
SIDEBAR_COLOR = 'sidebarColor'
WIDGET_STYLE = 'widgetStyle'
FOLDER_ICON_COLOR = 'folderIconColor'
SIDEBAR_STATE = 'sidebarState'
COLLAPSED_PINNED_FOLDER = 'collapsePinnedFolders'
COLLAPED_CATEGORIES = 'collapseCategories'
SETTINGS_PATH = f'{getcwd()}/storage/settings.json'





class SettingService():
    
    def get_settings(self) -> object:
        return self.__get_config()
    


    def update_theme(self, theme: str) -> str:
        config = self.__get_config()
        config[THEME] = theme
        self.__update_config(config)
        return theme
    


    def update_sidebar_color(self, color: str) -> str:
        config = self.__get_config()
        config[SIDEBAR_COLOR] = color
        self.__update_config(config)
        return color
    


    def update_widget_style(self, widget_style: str) -> str:
        config = self.__get_config()
        config[WIDGET_STYLE] = widget_style
        self.__update_config(config)
        return widget_style



    def update_folder_icon_color(self, color: str) -> str:
        config = self.__get_config()
        config[FOLDER_ICON_COLOR] = color
        self.__update_config(config)
        return color
    


    def update_sidebar_state(self, state: str) -> str:
        config = self.__get_config()
        config[SIDEBAR_STATE] = state
        self.__update_config(config)
        return state
    



    def update_collapse_sidebar_subsection(self, subsection: str) -> bool:
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
        config: dict = self.__get_config()
        current_state: bool = None 

        if subsection == 'pinned-folders':
            current_state = config[COLLAPSED_PINNED_FOLDER]

        elif subsection == 'categories':
            current_state = config[COLLAPED_CATEGORIES]

        else:
            raise KeyError(f"Invalid subsection: {subsection}")

        # Toggle the current state using the NOT operator.
        new_state: bool = not current_state

        # Update the configuration with the new state.
        if subsection == 'pinned-folders':
            config[COLLAPSED_PINNED_FOLDER] = new_state
        elif subsection == 'categories':
            config[COLLAPED_CATEGORIES] = new_state

        self.__update_config(config)

        return new_state




    def __get_config(self) -> dict:
        """
            Reads the current configuration from a settings file.

            This method opens the file located at `SETTINGS_PATH`, reads its content, 
            and deserializes it into a dictionary using the `load` function (e.g., from the `json` module).

            Returns:
                dict: The configuration data as a dictionary.

            Raises:
                FileNotFoundError: If the settings file at `SETTINGS_PATH` does not exist.
                JSONDecodeError: If the file content is not a valid JSON format.
        """
        with open(SETTINGS_PATH, 'r') as config:  # Open the settings file in read mode.
            return load(config)                   # Deserialize the content into a dictionary.




    def __update_config(self, updated_config: dict) -> None:
        """
            Updates the configuration file with the given data.

            This method opens the file located at `SETTINGS_PATH` in write mode, 
            serializes the `updated_config` dictionary into JSON format, and writes it 
            to the file with an indentation of 4 spaces for better readability.

            Args:
                updated_config (dict): The updated configuration data to be written 
                                    to the settings file.

            Raises:
                FileNotFoundError: If the settings file at `SETTINGS_PATH` cannot be accessed.
                TypeError: If `updated_config` contains data that is not JSON-serializable.
        """
        with open(SETTINGS_PATH, 'w') as config:    # Open the settings file in write mode.
            dump(updated_config, config, indent=4)  # Serialize and write the dictionary to the file.
