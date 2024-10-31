from os import getcwd

CWD = getcwd()
SETTINGS_PATH = f'{CWD}/storage/json/settings.json'

# import sqlite3

# # Connect to the SQLite database (or create it if it doesn't exist)
# conn = sqlite3.connect('database.db')
# cursor = conn.cursor()

# alter_tasks_table_sqlite = """
# -- Step 1: Rename the existing tasks table
# ALTER TABLE tasks RENAME TO old_tasks;

# -- Step 2: Create the new tasks table with the additional milestone_id column
# CREATE TABLE tasks (
#     id INTEGER PRIMARY KEY AUTOINCREMENT,
#     name TEXT,
#     description TEXT,
#     due_date TEXT,
#     section TEXT DEFAULT 'To do',
#     tag TEXT DEFAULT 'Task',
#     taskboard_id INTEGER,
#     milestone_id INTEGER,
#     FOREIGN KEY (taskboard_id) REFERENCES taskboards(id) ON DELETE CASCADE,
#     FOREIGN KEY (milestone_id) REFERENCES milestones(id) ON DELETE CASCADE
# );

# -- Step 3: Copy data from old_tasks to the new tasks table
# INSERT INTO tasks (id, name, description, due_date, section, tag, taskboard_id)
# SELECT id, name, description, due_date, section, tag, taskboard_id
# FROM old_tasks;

# -- Step 4: Drop the old_tasks table
# DROP TABLE old_tasks;
# """
# cursor.executescript(alter_tasks_table_sqlite)

# # Commit changes and close the connection
# conn.commit()
# conn.close()
