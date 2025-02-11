from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

import os
import shutil




class Database:    
    DATABASE_PATH = f'{os.getcwd()}/storage/database.db'
    DOWNLOADS_FOLDER_PATH = os.path.join(os.path.expanduser("~"), "Downloads")

    SQLALCHEMY_DATABASE_URL = "sqlite:///./storage/database.db"
    engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)



    @staticmethod
    def get_db():
        """Provide a transactional scope around a series of operations."""
        db = Database.SessionLocal()
        try:
            yield db  
        except Exception as e:
            db.rollback()  
            raise
        finally:
            db.close()  

    

    @staticmethod
    def make_backup() -> None:
        """Makes a backup of the database."""
       
        # Create the destination of the database backup 
        backup_file_destination = os.path.join(Database.DOWNLOADS_FOLDER_PATH, 'photon_database_backup.db')

        # Copy the database.db file 
        shutil.copy2(Database.DATABASE_PATH, backup_file_destination)

    

    @staticmethod
    def insert_photon_database() -> bool:
        ...

    