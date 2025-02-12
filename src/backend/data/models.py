from sqlalchemy import Column, String, Integer, Boolean, ForeignKey, create_engine
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


# # Connect to the SQLite database
# DATABASE_URL = "sqlite:///./storage/database.db"  # Change this if using a different database
# engine = create_engine(DATABASE_URL, echo=True)

# # Create the table
# def create_tables():
#     Base.metadata.create_all(engine)
#     print("Tables created successfully!")


# create_tables()