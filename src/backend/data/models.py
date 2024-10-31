from sqlalchemy import Column, String, Integer, Boolean, ForeignKey, JSON, DateTime
from sqlalchemy.orm import relationship, backref
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

# Folders table (top-level folders)
class Folder(Base):
    __tablename__ = 'folders'
    
    id = Column(Integer, primary_key=True, autoincrement=True) 
    name = Column(String, nullable=False)
    color = Column(String, nullable=True, default='rgb(255, 255, 255)')
    last_visit = Column(String, nullable=False, default=datetime.now())
    
    # Self-referential foreign key
    parent_id = Column(Integer, ForeignKey('folders.id', ondelete='CASCADE'), nullable=True)

    # One-to-many relationships
    subfolders = relationship("Folder", backref=backref("parent_folder", remote_side=[id]), cascade="all, delete-orphan")
    notes = relationship("Note", backref="folder", cascade="all, delete-orphan")




# Notes table (can belong to either a folder or a subfolder)
class Note(Base):
    __tablename__ = 'notes'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    content = Column(String, nullable=True)
    bookmark = Column(Boolean, default=False)
    last_edit = Column(String, nullable=False, default=datetime.now())
    creation = Column(String, nullable=False, default=datetime.now())
    
    # Foreign keys for folder or subfolder
    folder_id = Column(Integer, ForeignKey('folders.id', ondelete='CASCADE'), nullable=True)



class StickyWall(Base):
    __tablename__ = 'sticky_walls'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=True)
    description = Column(String, nullable=True, default='No description')

    stickies = relationship("StickyNote", backref="sticky_walls", cascade="all, delete-orphan")



class StickyNote(Base):
    __tablename__ = 'sticky_notes'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=True)
    content = Column(String, nullable=True)

    sticky_wall_id = Column(Integer, ForeignKey('sticky_walls.id', ondelete='CASCADE'), nullable=True)



class Template(Base):
    __tablename__ = 'templates'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=True)
    content = Column(String, nullable=True)
    last_edit = Column(String, nullable=False, default=datetime.now())
    creation = Column(String, nullable=False, default=datetime.now())
    uses = Column(Integer, default=0)







class FlashcardSet(Base):
    __tablename__ = 'flashcard_sets'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=True)
    last_study = Column(String, nullable=False, default='Not studied yet.')

    flashcards = relationship("Flashcard", backref="parent_flashcard_set", cascade="all, delete-orphan")




class Flashcard(Base):
    __tablename__ = 'flashcards'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    term = Column(String, nullable=True)
    description = Column(String, nullable=True)
    rating = Column(String, nullable=False, default='idle')

    # Foreign keys for folder or subfolder
    flascard_set_id = Column(Integer, ForeignKey('flashcard_sets.id', ondelete='CASCADE'), nullable=True)




class NoteBook(Base):
    __tablename__ = 'notebooks'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=True)
    description = Column(String, nullable=True)

    items = relationship("NotebookItem", backref="notebooks", cascade="all, delete-orphan")




class NotebookItem(Base):
    __tablename__ = 'notebook_item'

    id = Column(Integer, primary_key=True, autoincrement=True)
    linked_entity_id = Column(Integer, nullable=False)
    linked_entity_type = Column(String, nullable=False)
    linked_entity_name = Column(String, nullable=False)

    notebook_id = Column(Integer, ForeignKey('notebooks.id', ondelete='CASCADE'), nullable=True)




class Taskboard(Base):
    __tablename__ = 'taskboards'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=True)
    description = Column(String, nullable=True)
    board_sections = Column(JSON, default=['To do', 'In progress', 'Done'])

    tasks = relationship("Task", backref="parent_taskboard", cascade="all, delete-orphan")
    milestones = relationship("Milestone", backref="parent_taskboard", cascade="all, delete-orphan")




class Task(Base):
    __tablename__ = 'tasks'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=True)
    description = Column(String, nullable=True)
    due_date = Column(String, nullable=True)
    section = Column(String, nullable=False, default='To do')
    tag = Column(String, nullable=False, default='Task')

    # Foreign keys for folder or subfolder
    taskboard_id = Column(Integer, ForeignKey('taskboards.id', ondelete='CASCADE'), nullable=True)
    milestones_id = Column(Integer, ForeignKey('milestones.id', ondelete='CASCADE'), nullable=True)




class Milestone(Base):
    __tablename__ = 'milestones'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=True)
    description = Column(String, nullable=True)
    due_date = Column(String, nullable=True)
    tasks = relationship("Task", backref="milestone", passive_deletes=True)
    taskboard_id = Column(Integer, ForeignKey('taskboards.id', ondelete='CASCADE'), nullable=True)
