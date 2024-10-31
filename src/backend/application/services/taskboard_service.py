from sqlalchemy.orm import Session
from src.backend.data.managers.taskboard_manager import TaskboardManager
from src.backend.data.models import Taskboard, Task, Milestone
from src.backend.presentation.request_bodies.taskboard_requests import *
from src.backend.data.exceptions.exceptions import *


class TaskboardService:
    def __init__(self, manager: TaskboardManager) -> None:
        self.manager = manager


    def add_taskboard(self, name: str, description: str, db: Session) -> Taskboard:
        taskboard = Taskboard(
            name = name, 
            description = description
            )
        return self.manager.add_taskboard(taskboard, db)
    

    def get_taskboards(self, db: Session) -> list[Taskboard]:
        return self.manager.get_taskboards(db)
    

    def get_taskboard_by_id(self, id: str, db: Session) -> Taskboard:
        return self.manager.get_taskboard_by_id(id, db)
        

    def update_taskboard(self, id: int, name: str, description: str, db: Session) -> None:
        self.manager.update_taskboard(id, name, description, db)


    def delete_taskboard(self, id: int, db: Session) -> Taskboard:
        return self.manager.delete_taskboard(id, db)
    

    def add_task(
            self, 
            parent_id: int,
            name: str, 
            description: str, 
            due_date: str,
            tag: str,
            db: Session) -> ( Task | NotFoundException ):
        
        task = Task(
            name = name, 
            description = description,
            due_date = due_date,
            taskboard_id = parent_id,
            tag = tag
            )
        return self.manager.add_task(parent_id, task, db)
    

    def get_tasks(self, parent_id: int, db: Session) -> ( list[Task] | NotFoundException ):
        return self.manager.get_tasks(parent_id, db)
    

    def get_task_by_id(self, id: str, db: Session) -> ( Task | NotFoundException ):
        return self.manager.get_task_by_id(id, db)
        

    def update_task(
            self, 
            id: int, 
            name: str, 
            description: str,
            due_date: str,
            section: str, 
            tag: str,
            db: Session) -> ( Task | NotFoundException ):
        return self.manager.update_task(id, name, description, section, due_date, tag, db)


    def delete_task(self, id: int, db: Session) -> ( Task | NotFoundException ):
        return self.manager.delete_task(id, db)
    


    def add_milestone(
            self, 
            parent_id: int,
            name: str, 
            description: str, 
            due_date: str,
            db: Session) -> ( Milestone | NotFoundException ):
        
        milestone = Milestone(
            name = name, 
            description = description,
            due_date = due_date,
            taskboard_id = parent_id,
            )
        return self.manager.add_milestone(parent_id, milestone, db)
    

    def get_milestones(self, parent_id: int, db: Session) -> ( list[Milestone] | NotFoundException ):
        return self.manager.get_milestones(parent_id, db)
    

    def get_milestone_by_id(self, id: str, db: Session) -> ( Milestone | NotFoundException ):
        return self.manager.get_milestone_by_id(id, db)
        

    def update_milestone(
            self, 
            id: int, 
            name: str, 
            description: str,
            due_date: str,
            db: Session) -> ( Milestone | NotFoundException ):
        return self.manager.update_milestone(id, name, description, due_date, db)


    def delete_milestone(self, id: int, db: Session) -> ( Milestone | NotFoundException ):
        return self.manager.delete_milestone(id, db)