from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.backend.data.database import Database
from src.backend.data.managers.category_manager import CategoryManager
from src.backend.presentation.request_bodies.folder_requests import PostCategoryRequest, PutCategoryRequest
from src.backend.data.models import Category
from src.backend.presentation.http_status import HttpStatus
from src.backend.data.exceptions.exception_handler import handle_exceptions
from src.backend.presentation.response import JSONResponse



class CategoryRouter:
    def __init__(self):
        self.route = APIRouter()
        self.manager = CategoryManager()

        self.route.add_api_route('/categories', self.add_category, methods=['POST'])
        self.route.add_api_route('/categories', self.get_categories, methods=['GET'])
        self.route.add_api_route('/categories/{category_id}', self.get_category_by_id, methods=['GET'])
        self.route.add_api_route('/categories/{category_id}', self.update_category, methods=['PUT'])
        self.route.add_api_route('/categories/{category_id}', self.delete_category, methods=['DELETE'])



    @handle_exceptions
    def add_category(self, request: PostCategoryRequest, db: Session = Depends(Database.get_db)):
        new_category = Category(name=request.name, color=request.color)

        category = self.manager.add_category(new_category, db)
        return JSONResponse(status_code=HttpStatus.CREATED, content={'category': category})
        


    @handle_exceptions
    def get_categories(self, db: Session = Depends(Database.get_db)):
        categories = self.manager.get(db)
        return JSONResponse(status_code=HttpStatus.OK, content={'categories': categories})



    @handle_exceptions
    def get_category_by_id(self, category_id: int, db: Session = Depends(Database.get_db)):
        category = self.manager.get_by_id(category_id, db)
        return JSONResponse(status_code=HttpStatus.OK, content={'category': category})



    @handle_exceptions
    def update_category(self, category_id: int, request: PutCategoryRequest, db: Session = Depends(Database.get_db)):
        category = self.manager.update(category_id, request.name, request.color, db)
        return JSONResponse(status_code=HttpStatus.OK, content={'category': category})
    


    @handle_exceptions
    def delete_category(self, category_id: int, db: Session = Depends(Database.get_db)):
        category = self.manager.delete(category_id, db)
        return JSONResponse(status_code=HttpStatus.OK, content={'category': category})