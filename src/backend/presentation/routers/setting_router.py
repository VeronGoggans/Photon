from fastapi import APIRouter
from src.backend.presentation.http_status import HttpStatus
from src.backend.application.services.setting_service import SettingService
from src.backend.presentation.response import JSONResponse



class SettingRouter:
    def __init__(self):
        self.route = APIRouter()
        self.service = SettingService()
        
        self.route.add_api_route('/settings',                                               self.get_settings, methods=['GET'])
        self.route.add_api_route('/settings/theme/{theme}',                                 self.update_app_theme, methods=['PATCH'])
        self.route.add_api_route('/settings/sidebar-color/{color}',                         self.update_sidebar_color, methods=['PATCH'])
        self.route.add_api_route('/settings/widget-style/{widget_style}',                   self.update_widget_style, methods=['PATCH'])
        self.route.add_api_route('/settings/folder-icon-color/{folder_icon_color}',         self.update_folder_icon_color, methods=['PATCH'])
        self.route.add_api_route('/settings/sidebar-state/{state}',                         self.update_sidebar_state, methods=['PATCH'])
        self.route.add_api_route('/settings/sidebar-subsection-state/{sidebar_subsection}', self.update_sidebar_subsection_state, methods=['PATCH'])

        

    def get_settings(self):
        settings: object = self.service.get_settings()
        return JSONResponse(status_code=HttpStatus.OK, content={'settings': settings})
    


    def update_sidebar_color(self, color: str):
        sidebar_color: str = self.service.update_sidebar_color(color)
        return JSONResponse(status_code=HttpStatus.OK, content={'sidebarColor': sidebar_color})



    def update_app_theme(self, theme: str):
        theme: str = self.service.update_theme(theme)
        return JSONResponse(status_code=HttpStatus.OK, content={'theme': theme})
    


    def update_widget_style(self, widget_style: str):
        widget_style: str = self.service.update_widget_style(widget_style)
        return JSONResponse(status_code=HttpStatus.OK, content={'widgetStyle': widget_style})
    


    def update_folder_icon_color(self, folder_icon_color: str):
        folder_icon_color: str = self.service.update_folder_icon_color(folder_icon_color)
        return JSONResponse(status_code=HttpStatus.OK, content={'folderIconColor': folder_icon_color})
    


    def update_sidebar_state(self, state: str):
        sidebar_state: str = self.service.update_sidebar_state(state)
        return JSONResponse(status_code=HttpStatus.OK, content={'sidebarState': sidebar_state})
    


    def update_sidebar_subsection_state(self, sidebar_subsection: str):
        sidebar_subsection_state: str = self.service.update_collapse_sidebar_subsection(sidebar_subsection)
        return JSONResponse(status_code=HttpStatus.OK, content={'sidebarSubsectionState': sidebar_subsection_state})
    
    