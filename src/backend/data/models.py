from sqlalchemy import Column, String, Integer, Boolean, ForeignKey
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
    last_visit = Column(String, nullable=False, default=datetime.now())
    creation = Column(String, nullable=False, default=datetime.now())
    
    # Foreign keys for folder or subfolder
    folder_id = Column(Integer, ForeignKey('folders.id', ondelete='CASCADE'), nullable=True)




class StickyBoard(Base):
    __tablename__ = 'sticky_boards'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=True)
    description = Column(String, nullable=True)
    creation = Column(String, nullable=False)
    type = Column(String, nullable=False, default='board')

    stickies = relationship("StickyNote", backref="sticky_boards", cascade="all, delete-orphan")




class StickyColumnBoard(Base):
    __tablename__ = 'sticky_column_boards'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=True)
    description = Column(String, nullable=True)
    creation = Column(String, nullable=False)
    type = Column(String, nullable=False, default='column')

    columns = relationship("StickyColumn", backref="sticky_column_boards", cascade="all, delete-orphan")




class StickyColumn(Base):
    __tablename__ = 'sticky_columns'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=True)
    defualt_sticky_color = Column(String, nullable=False, default='rgb(180, 214, 255)')

    sticky_board_id = Column(Integer, ForeignKey('sticky_column_boards.id', ondelete='CASCADE'), nullable=True)
    stickies = relationship("StickyNote", backref="sticky_columns", cascade="all, delete-orphan")




class StickyNote(Base):
    __tablename__ = 'sticky_notes'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    content = Column(String, nullable=True)
    color = Column(String, nullable=False, default='rgb(180, 214, 255)')

    sticky_board_id = Column(Integer, ForeignKey('sticky_boards.id', ondelete='CASCADE'), nullable=True)
    column_id = Column(Integer, ForeignKey('sticky_columns.id', ondelete='CASCADE'), nullable=True)


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
