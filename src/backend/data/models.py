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
    pinned = Column(Boolean, nullable=False, default=False)
    
    # Self-referential foreign key
    parent_id = Column(Integer, ForeignKey('folders.id', ondelete='CASCADE'), nullable=True)

    # One-to-many relationships
    subfolders = relationship("Folder", backref=backref("parent_folder", remote_side=[id]), cascade="all, delete-orphan")
    notes = relationship("Note", backref="folder", cascade="all, delete-orphan")




class Category(Base):
    __tablename__ = 'categories'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=True)
    color = Column(String, nullable=False, default='rgb(255, 255, 255)')

    notes = relationship(
        "Note",
        backref="category",            # Allows access to the category from the Note model
        cascade="save-update, merge",  # Avoids deleting Notes when a Category is deleted
        passive_deletes=True           # Ensures the database handles deletions gracefully 
        )



# Notes table (can belong to either a folder or a subfolder)
class Note(Base):
    __tablename__ = 'notes'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    content = Column(String, nullable=True)
    bookmark = Column(Boolean, default=False)
    is_template = Column(Boolean, default=False)
    last_edit = Column(String, nullable=False, default=datetime.now())
    last_visit = Column(String, nullable=False, default=datetime.now())
    creation = Column(String, nullable=False)
    
    # Foreign keys for folders and categories
    folder_id = Column(Integer, 
                       ForeignKey(
                           'folders.id', 
                            ondelete='CASCADE'),  # used to delete all the notes that are referencing the same folder when it's deleted
                            nullable=True         # Allows the category_id to be NULL
                        )
        
    category_id = Column(Integer, 
                        ForeignKey(
                            'categories.id', 
                            ondelete='SET NULL'), # Set to NULL if the Category is deleted 
                            nullable=True         # Allows the category_id to be NULL
                        )




class StandardStickyBoard(Base):
    __tablename__ = 'standard_sticky_boards'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=True)
    description = Column(String, nullable=True)
    creation = Column(String, nullable=False)
    type = Column(String, nullable=False, default='board')

    stickies = relationship("StickyNote", backref="standard_sticky_boards", cascade="all, delete-orphan")




class ColumnStickyBoard(Base):
    __tablename__ = 'column_sticky_boards'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=True)
    description = Column(String, nullable=True)
    creation = Column(String, nullable=False)
    type = Column(String, nullable=False, default='column')

    columns = relationship("StickyBoardColumn", backref="column_sticky_boards", cascade="all, delete-orphan")




class StickyBoardColumn(Base):
    __tablename__ = 'sticky_board_columns'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=True)
    defualt_sticky_color = Column(String, nullable=False, default='rgb(180, 214, 255)')

    sticky_board_id = Column(Integer, ForeignKey('column_sticky_boards.id', ondelete='CASCADE'), nullable=True)
    stickies = relationship("StickyNote", backref="sticky_board_columns", cascade="all, delete-orphan")




class StickyNote(Base):
    __tablename__ = 'sticky_notes'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    content = Column(String, nullable=True)
    color = Column(String, nullable=False, default='rgb(180, 214, 255)')

    sticky_board_id = Column(Integer, ForeignKey('standard_sticky_boards.id', ondelete='CASCADE'), nullable=True)
    column_id = Column(Integer, ForeignKey('sticky_board_columns.id', ondelete='CASCADE'), nullable=True)









# class Tag(Base):
#     __tablename__ = 'tags'

#     id = Column(Integer, primary_key=True, autoincrement=True)
#     name = Column(String, nullable=True)
#     color = Column(String, nullable=False, default='rgb(255, 255, 255)')

#     notes = relationship(
#         "Note",
#         backref="tag",                 # Allows access to the tag from the Note model
#         cascade="save-update, merge",  # Avoids deleting Notes when a Tag is deleted
#         passive_deletes=True           # Ensures the database handles deletions gracefully 
#         )