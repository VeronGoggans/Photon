from sqlalchemy.orm import Session
from sqlalchemy import func
from src.backend.data.models import Template
from src.backend.presentation.request_bodies.template_requests import *
from src.backend.data.exceptions.exceptions import *
from datetime import datetime


class TemplateManager:



    def add(self, template: Template, db: Session) -> Template:
        db.add(template)
        db.commit()
        db.refresh(template)
        return template



    def get(self, db: Session) -> None:
        return db.query(Template).all()
        


    def get_by_id(self, template_id: int, update_use_count: bool, db: Session) -> (Template | NotFoundException):
        template = self.__find_template(template_id, db)
        if update_use_count:
            template.uses = template.uses + 1
            db.commit()
            db.refresh(template)
        return template
    


    def update(self, template_id: int, name: str, content: str, db: Session) -> (Template | NotFoundException):
        template = self.__find_template(template_id, db)
        template.name = name
        template.content = content
        template.last_edit = datetime.now()
        db.commit()
        db.refresh(template)
        return template



    def delete(self, template_id: int, db: Session) -> (Template | NotFoundException):
        template = self.__find_template(template_id, db)
        db.delete(template)
        db.commit()
        return template



    def __find_template(self, template_id: int, db: Session) -> ( Template | NotFoundException):
        template = db.query(Template).filter(Template.id == template_id).first()

        if template is None:
            raise NotFoundException(f'Template with id {template_id} not found.')
        return template

    
