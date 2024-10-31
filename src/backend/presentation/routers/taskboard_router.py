from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.backend.data.database import Database
from src.backend.application.services.taskboard_service import TaskboardService
from src.backend.data.managers.taskboard_manager import TaskboardManager
from src.backend.presentation.request_bodies.taskboard_requests import PostTaskboardRequest, PutTaskboardRequest, PostTaskRequest, PutTaskRequest
from src.backend.presentation.http_status import HttpStatus
from src.backend.data.exceptions.exception_handler import handle_exceptions



class TaskboardRouter:
    def __init__(self):
        self.route = APIRouter()
        self.service = TaskboardService(TaskboardManager())

        self.route.add_api_route('/taskboard', self.add_taskboard, methods=['POST'])
        self.route.add_api_route('/taskboards', self.get_taskboards, methods=['GET'])
        self.route.add_api_route('/taskboard/{id}', self.get_taskboard_by_id, methods=['GET'])
        self.route.add_api_route('/taskboard', self.update_taskboard, methods=['PUT'])
        self.route.add_api_route('/taskboard/{id}', self.delete_taskboard, methods=['DELETE'])

        self.route.add_api_route('/task', self.add_task, methods=['POST'])
        self.route.add_api_route('/tasks/{taskboard_id}', self.get_tasks, methods=['GET'])
        self.route.add_api_route('/task/{id}', self.get_task_by_id, methods=['GET'])
        self.route.add_api_route('/task', self.update_task, methods=['PUT'])
        self.route.add_api_route('/task/{id}', self.delete_task, methods=['DELETE'])

        self.route.add_api_route('/milestone', self.add_task, methods=['POST'])
        self.route.add_api_route('/milestones/{taskboard_id}', self.get_tasks, methods=['GET'])
        self.route.add_api_route('/milestone/{id}', self.get_task_by_id, methods=['GET'])
        self.route.add_api_route('/milestone', self.update_task, methods=['PUT'])
        self.route.add_api_route('/milestone/{id}', self.delete_task, methods=['DELETE'])
        

    @handle_exceptions
    def add_taskboard(self, request: PostTaskboardRequest, db: Session = Depends(Database.get_db)):
        return {'status': HttpStatus.OK, 'taskboard': self.service.add_taskboard(request.name, request.description, db)}
       

    @handle_exceptions
    def get_taskboards(self, db: Session = Depends(Database.get_db)):
        return {'status': HttpStatus.OK, 'taskboards': self.service.get_taskboards(db)}
       

    @handle_exceptions
    def get_taskboard_by_id(self, id: int, db: Session = Depends(Database.get_db)):
        return {'status': HttpStatus.OK, 'taskboard': self.service.get_taskboard_by_id(id, db)}


    @handle_exceptions
    def update_taskboard(self, request: PutTaskboardRequest, db: Session = Depends(Database.get_db)):
        self.service.update_taskboard(request.id, request.name, request.description, db)
        return {'status': HttpStatus.OK}
    

    @handle_exceptions
    def delete_taskboard(self, id: int, db: Session = Depends(Database.get_db)):
        return {'status': HttpStatus.OK, 'taskboard': self.service.delete_taskboard(id, db)}
    
    
    @handle_exceptions
    def add_task(self, request: PostTaskRequest, db: Session = Depends(Database.get_db)):
        return {
            'status': HttpStatus.OK, 
            'task': self.service.add_task(
                request.parent_id,
                request.name, 
                request.description, 
                request.due_date,
                request.tag,
                db)}
       

    @handle_exceptions
    def get_tasks(self, taskboard_id: int, db: Session = Depends(Database.get_db)):
        return {'status': HttpStatus.OK, 'tasks': self.service.get_tasks(taskboard_id, db)}
       

    @handle_exceptions
    def get_task_by_id(self, id: int, db: Session = Depends(Database.get_db)):
        return {'status': HttpStatus.OK, 'task': self.service.get_task_by_id(id, db)}


    @handle_exceptions
    def update_task(self, request: PutTaskRequest, db: Session = Depends(Database.get_db)):
        return {
            'status': HttpStatus.OK, 
            'task': self.service.update_task(
            request.id, 
            request.name, 
            request.description,
            request.due_date,
            request.section,
            request.tag,
            db)}
    

    @handle_exceptions
    def delete_task(self, id: int, db: Session = Depends(Database.get_db)):
        return {'status': HttpStatus.OK, 'task': self.service.delete_task(id, db)}
    


    @handle_exceptions
    def add_milestone(self, request: PostTaskRequest, db: Session = Depends(Database.get_db)):
        return {
            'status': HttpStatus.OK, 
            'task': self.service.add_milestone(
                request.parent_id,
                request.name, 
                request.description, 
                request.due_date,
                request.tag,
                db)}
       

    @handle_exceptions
    def get_milestones(self, taskboard_id: int, db: Session = Depends(Database.get_db)):
        return {'status': HttpStatus.OK, 'tasks': self.service.get_milestones(taskboard_id, db)}
       

    @handle_exceptions
    def get_milestone_by_id(self, id: int, db: Session = Depends(Database.get_db)):
        return {'status': HttpStatus.OK, 'task': self.service.get_milestone_by_id(id, db)}


    @handle_exceptions
    def update_milestone(self, request: PutTaskRequest, db: Session = Depends(Database.get_db)):
        return {
            'status': HttpStatus.OK, 
            'task': self.service.update_milestone(
            request.id, 
            request.name, 
            request.description,
            request.due_date,
            request.section,
            request.tag,
            db)}
    

    @handle_exceptions
    def delete_milestone(self, id: int, db: Session = Depends(Database.get_db)):
        return {'status': HttpStatus.OK, 'task': self.service.delete_milestone(id, db)}