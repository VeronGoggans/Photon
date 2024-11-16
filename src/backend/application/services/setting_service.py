from src.backend.util.paths import SETTINGS_PATH
from json import load, dump

THEME = 'theme'
SIDEBAR_COLOR = 'sidebarColor'
WIDGET_STYLE = 'widgetStyle'


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
    

    def __get_config(self) -> str:
        with open(SETTINGS_PATH, 'r') as config:
            return load(config)  


    def __update_config(self, updated_config) -> None:
        with open(SETTINGS_PATH, 'w') as config:
            dump(updated_config, config, indent=4)