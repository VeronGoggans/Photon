from sqlalchemy.orm import Session
from src.backend.data.models import Category
from src.backend.data.helpers import find_category
from src.backend.data.exceptions.exceptions import NotFoundException


class CategoryManager:

    def add(self, category: Category, db: Session) -> Category:
        db.add(category)
        db.commit()
        db.refresh(category)
        return category
    


    def get(self, db: Session) -> (list[Category] | NotFoundException):
        return db.query(Category).all()
    


    def get_by_id(self, category_id: int, db: Session) -> (Category | NotFoundException):
        return find_category(category_id, db) 
    


    def update(self, category_id: int, category_name: str, category_color: str, db: Session) -> (Category | NotFoundException):
        category = find_category(category_id, db)
        category.name = category_name
        category.color = category_color

        db.commit()
        db.refresh(category)
        return category
    


    def delete(self, category_id: int, db: Session) -> (Category | NotFoundException):
        category = find_category(category_id, db)
        db.delete(category)
        db.commit()
        return category
    