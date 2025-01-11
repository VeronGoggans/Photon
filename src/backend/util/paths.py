
# import sqlite3

# # Connect to your SQLite database file
# # Replace 'your_database.db' with the path to your SQLite database
# conn = sqlite3.connect('database.db')
# cursor = conn.cursor()

# try:
#     # Add a new column 'pinned' to the 'folders' table with default FALSE (0)
#     cursor.execute("""
#         ALTER TABLE folders
#         ADD COLUMN pinned BOOLEAN DEFAULT FALSE;
#     """)
#     print("Column 'pinned' added successfully with default FALSE.")

# except sqlite3.OperationalError as e:
#     print(f"An error occurred: {e}")

# # Commit the changes and close the connection
# conn.commit()
# conn.close()
