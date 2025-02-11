
# import sqlite3

# # Connect to your SQLite database file
# # Replace 'your_database.db' with the path to your SQLite database
# conn = sqlite3.connect('database.db')
# cursor = conn.cursor()

# try:
#     # Add a new column 'pinned' to the 'folders' table with default FALSE (0)
#     cursor.execute("""
#         ALTER TABLE notes
#         ADD COLUMN is_template BOOLEAN DEFAULT FALSE;
#     """)
#     print("Column 'is_template' added successfully with default FALSE.")

# except sqlite3.OperationalError as e:
#     print(f"An error occurred: {e}")

# # Commit the changes and close the connection
# conn.commit()
# conn.close()



# Define source and destination paths

import os, shutil, json
from datetime import datetime, timedelta


def is_at_least_one_day_old(date_to_check):
    date_time_str = datetime.strptime(date_to_check,  "%Y-%m-%d %H:%M:%S.%f")

    # Get the current time
    now = datetime.now()
    # Calculate the threshold: 24 hours ago from now
    one_day_ago = now - timedelta(days=1)
    # Check if the given date is before this threshold
    return date_time_str < one_day_ago


DATABASE_BACKUP_FOLDER = f'{os.getcwd()}\storage\database_backups'
DATABASE = f'{os.getcwd()}/storage/test.txt'
DATABASE_BACKUP_DATA_FILE = f'{os.getcwd()}\storage\database.json'



# Step one: get the current backups
backup_data: object = None

with open(DATABASE_BACKUP_DATA_FILE, 'r') as file:  # Open the settings file in read mode.
    backup_data = json.load(file)



# Step two: check if a day has passed since the last backup
latest_backup: object = backup_data[-1]
backup_is_necessary: bool = is_at_least_one_day_old(latest_backup['date'])

if backup_is_necessary:

    backup_file = os.path.join(DATABASE_BACKUP_FOLDER, f'database_backup_.txt')

    # Ensure the backup folder exists
    os.makedirs(DATABASE_BACKUP_FOLDER, exist_ok=True)

    # Copy the database file
    backup_path: str = shutil.copy2(DATABASE, backup_file)

    print(f"Backup created at: {backup_path}")
    print(f'At: {datetime.now()}')

    new_backup_entry: object = {
        'date': str(datetime.now()),
        'path': backup_path
    }

    backup_data.append(new_backup_entry)


    with open(DATABASE_BACKUP_DATA_FILE, 'w') as file:    # Open the settings file in write mode.
        json.dump(backup_data, file, indent=4)

# step 1
# Get all the backups


# step 2
# Get all the backups


# step 3
# Get all the backups





