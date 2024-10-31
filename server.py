from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from src.backend.presentation.routers.note_router import NoteRouter
from src.backend.presentation.routers.template_router import TemplateRouter
from src.backend.presentation.routers.flashcard_router import FlashcardDeckRouter
from src.backend.presentation.routers.folder_router import FolderRouter
from src.backend.presentation.routers.sticky_note_router import StickyNoteRouter
from src.backend.presentation.routers.taskboard_router import TaskboardRouter
from src.backend.presentation.routers.setting_router import SettingRouter
from src.backend.presentation.routers.notebook_router import NotebookRouter


app = FastAPI()
note_router = NoteRouter()
template_router = TemplateRouter()
flashcard_deck_router = FlashcardDeckRouter()
folder_router = FolderRouter()
sticky_note_router = StickyNoteRouter()
taskboard_router = TaskboardRouter()
theme_router = SettingRouter()
notebook_router = NotebookRouter()

app.include_router(folder_router.route)
app.include_router(note_router.route)
app.include_router(template_router.route)
app.include_router(flashcard_deck_router.route)
app.include_router(sticky_note_router.route)
app.include_router(taskboard_router.route)
app.include_router(theme_router.route)
app.include_router(notebook_router.route)

# Setting up a FRONT-END page for the API
app.mount("/", StaticFiles(directory=".", html=True), name="static")