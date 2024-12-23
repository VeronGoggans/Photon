from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.backend.data.database import Database
from src.backend.application.services.template_service import TemplateService
from src.backend.data.managers.template_manager import TemplateManager
from src.backend.presentation.http_status import HttpStatus
from src.backend.presentation.request_bodies.template_requests import *
from src.backend.data.exceptions.exception_handler import handle_exceptions
from src.backend.presentation.response import JSONResponse



class TemplateRouter:
    def __init__(self):
        self.route = APIRouter()
        self.manager = TemplateManager()
        self.service = TemplateService(self.manager)


        self.route.add_api_route('/templates',                               self.get_templates, methods=['GET'])
        self.route.add_api_route('/templates/{template_id}',                 self.get_template_by_id, methods=['GET'])
        self.route.add_api_route('/templates',                               self.add_template, methods=['POST'])
        self.route.add_api_route('/templates/{template_id}',                 self.update_template, methods=['PUT'])
        self.route.add_api_route('/templates/{template_id}',                 self.delete_template, methods=['DELETE'])



    @handle_exceptions
    def add_template(self, request: PostTemplateRequest, db: Session = Depends(Database.get_db)):
        template = self.service.add_template(request, db)
        return JSONResponse(status_code=HttpStatus.OK, content={'template': template})



    @handle_exceptions
    def get_templates(self, db: Session = Depends(Database.get_db)):
        templates = self.manager.get(db)
        return JSONResponse(status_code=HttpStatus.OK, content={'templates': templates})



    @handle_exceptions
    def get_template_by_id(self, template_id: int, update_use_count: bool, db: Session = Depends(Database.get_db)):
        template = self.manager.get_by_id(template_id, update_use_count, db)        
        return JSONResponse(status_code=HttpStatus.OK, content={'template': template})



    @handle_exceptions
    def update_template(self, template_id: int, request: PutTemplateRequest, db: Session = Depends(Database.get_db)):
        template = self.manager.update(template_id, request.name, request.content, db)
        return JSONResponse(status_code=HttpStatus.OK, content={'template': template})



    @handle_exceptions
    def delete_template(self, template_id: int, db: Session = Depends(Database.get_db)):
        template = self.manager.delete(template_id, db)
        return JSONResponse(status_code=HttpStatus.OK, content={'template': template})