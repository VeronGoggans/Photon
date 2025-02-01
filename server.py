from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from src.backend.presentation.routers.note_router import NoteRouter
from src.backend.presentation.routers.folder_router import FolderRouter
from src.backend.presentation.routers.category_router import CategoryRouter
from src.backend.presentation.routers.sticky_note_router import StickyNoteRouter
from src.backend.presentation.routers.setting_router import SettingRouter


app = FastAPI()
note_router = NoteRouter()
folder_router = FolderRouter()
category_router = CategoryRouter()
sticky_note_router = StickyNoteRouter()
theme_router = SettingRouter()

app.include_router(folder_router.route)
app.include_router(category_router.route)
app.include_router(note_router.route)
app.include_router(sticky_note_router.route)
app.include_router(theme_router.route)

# Setting up a FRONT-END page for the API
app.mount("/", StaticFiles(directory=".", html=True), name="static")