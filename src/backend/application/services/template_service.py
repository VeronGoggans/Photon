from sqlalchemy.orm import Session
from src.backend.data.managers.template_manager import TemplateManager
from src.backend.data.models import Template
from src.backend.presentation.request_bodies.template_requests import *
from src.backend.data.exceptions.exceptions import *



class TemplateService:
    def __init__(self, template_manager: TemplateManager):
        self.manager = template_manager


    
    def add_template(self, request: PostTemplateRequest, db: Session) -> Template:
        template = Template(
            name = request.name, 
            content = request.content
            )
        return self.manager.add(template, db)

        
        