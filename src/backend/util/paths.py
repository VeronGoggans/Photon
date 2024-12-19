from os import getcwd

CWD = getcwd()
SETTINGS_PATH = f'{CWD}/storage/settings.json'

import sqlite3

def create_database():
    # Connect to SQLite database (or create it if it doesn't exist)
    connection = sqlite3.connect("database.db")
    cursor = connection.cursor()

    # Drop tables if they exist
    cursor.execute("DROP TABLE IF EXISTS sticky_notes;")
    cursor.execute("DROP TABLE IF EXISTS sticky_columns;")
    cursor.execute("DROP TABLE IF EXISTS sticky_column_boards;")
    cursor.execute("DROP TABLE IF EXISTS sticky_boards;")

    # Create sticky_boards table
    cursor.execute("""
    CREATE TABLE standard_sticky_boards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        description,
        creation TEXT NOT NULL,
        type TEXT DEFAULT 'board'
    );
    """)

    # Create sticky_column_boards table
    cursor.execute("""
    CREATE TABLE column_sticky_boards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        description,
        creation TEXT NOT NULL,
        type TEXT DEFAULT 'column'
    );
    """)

    # Create sticky_columns table
    cursor.execute("""
    CREATE TABLE sticky_board_columns (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        defualt_sticky_color TEXT NOT NULL DEFAULT 'rgb(180, 214, 255)',
        sticky_board_id INTEGER,
        FOREIGN KEY (sticky_board_id) REFERENCES column_sticky_boards (id) ON DELETE CASCADE
    );
    """)

    # Create sticky_notes table
    cursor.execute("""
    CREATE TABLE sticky_notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT,
        color TEXT NOT NULL DEFAULT 'rgb(180, 214, 255)',
        sticky_board_id INTEGER,
        column_id INTEGER,
        FOREIGN KEY (sticky_board_id) REFERENCES standard_sticky_boards (id) ON DELETE CASCADE,
        FOREIGN KEY (column_id) REFERENCES sticky_board_columns (id) ON DELETE CASCADE
    );
    """)

    # Commit changes and close the connection
    connection.commit()
    connection.close()

if __name__ == "__main__":
    create_database()
