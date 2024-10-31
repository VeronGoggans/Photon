from sqlalchemy.orm import Session
from src.backend.data.models import Taskboard, Task, Milestone
from src.backend.presentation.request_bodies.taskboard_requests import *
from src.backend.data.exceptions.exceptions import NotFoundException
from src.backend.data.helpers import find_taskboard
from src.backend.data.helpers import find_task, find_milestone


class TaskboardManager:    

    def add_taskboard(self, taskboard: Taskboard, db: Session) -> Taskboard:
        db.add(taskboard)
        db.commit()
        db.refresh(taskboard)
        return taskboard


    def get_taskboards(self, db: Session) -> list[Taskboard]:
        return db.query(Taskboard).all()
    

    def get_taskboard_by_id(self, id: int, db: Session) -> ( Taskboard | NotFoundException ):
        return find_taskboard(id, db)


    def update_taskboard(self, id: int, name: str, description: str, db: Session) -> ( None | NotFoundException ):
        taskboard = find_taskboard(id, db)
        taskboard.name = name
        taskboard.description = description

        db.commit()
        db.refresh(taskboard)
    

    def delete_taskboard(self, id: int, db: Session) -> ( Taskboard | NotFoundException ):
        taskboard = find_taskboard(id, db)
        db.delete(taskboard)
        db.commit()
        return taskboard
    

    def add_task(self, parent_id: int, task: Task, db: Session) -> Task:
        find_taskboard(parent_id, db)
        db.add(task)
        db.commit()
        db.refresh(task)
        return task


    def get_tasks(self, parent_id: int, db: Session) -> list[Task]:
        return db.query(Task).filter(Task.taskboard_id == parent_id).all()
    

    def get_task_by_id(self, id: int, db: Session) -> ( Task | NotFoundException ):
        return find_task(id, db)


    def update_task(self, id: int, name: str, description: str, section: str, due_date: str, tag: str, db: Session) -> ( Task | NotFoundException ):
        task = find_task(id, db)
        task.name = name
        task.description = description
        task.section = section
        task.due_date = due_date
        task.tag = tag

        db.commit()
        db.refresh(task)
        return task
    

    def delete_task(self, id: int, db: Session) -> ( Task | NotFoundException ):
        task = find_task(id, db)
        db.delete(task)
        db.commit()
        return task
    


    def add_milstone(self, parent_id: int, milestone: Milestone, db: Session) -> Milestone:
        find_taskboard(parent_id, db)
        db.add(milestone)
        db.commit()
        db.refresh(milestone)
        return milestone


    def get_milstones(self, parent_id: int, db: Session) -> list[Milestone]:
        return db.query(Milestone).filter(Milestone.taskboard_id == parent_id).all()
    

    def get_milstone_by_id(self, id: int, db: Session) -> ( Milestone | NotFoundException ):
        return find_milestone(id, db)


    def update_milstone(self, id: int, name: str, description: str, section: str, due_date: str, db: Session) -> ( Milestone | NotFoundException ):
        milestone = find_milestone(id, db)
        milestone.name = name
        milestone.description = description
        milestone.section = section
        milestone.due_date = due_date

        db.commit()
        db.refresh(milestone)
        return milestone
    

    def delete_milstone(self, id: int, db: Session) -> ( Milestone | NotFoundException ):
        milestone = find_milestone(id, db)
        db.delete(milestone)
        db.commit()
        return milestone