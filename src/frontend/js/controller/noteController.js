import { HttpModel } from "../model/httpModel.js";
import { NoteView } from "../view/noteView.js";
import { Searchbar } from "../view/searchbar.js";
import { viewToLoad } from "../helpers/random.js";
import { pushNotification } from "../handlers/notificationHandler.js"

export class NoteController {
    constructor(applicationController) {
        this.applicationController = applicationController;
        this.model = new HttpModel();
    }

    
    async init(folderId = 1) {
        this.searchbar = new Searchbar(this);
        this.view = new NoteView(this, this.applicationController);

        await this.#initSearchbar();
        await this.get(folderId);
    }


    async add(folderId, name, content, notify) {
        const { note } = await this.model.add('/note', {'folder_id': folderId,'name': name,'content': content});
        if (notify) {
            pushNotification('saved');
        }
        return note
    }


    async get(folderId) {
        const { notes } = await this.model.get(`/notes/${folderId}`);
        this.view.renderAll(notes);
    }


    async getById(noteId) {
        return await this.model.get(`/noteById/${noteId}`);
    }

    
    async getSearchItems() {
        const { notes } = await this.model.get('/noteSearchItems');
        return notes
    }


    async update(note) {
        await this.model.update('/note', {'note_id': note.id,'name': note.name,'content': note.content,'bookmark': note.bookmark});
        pushNotification('updated');
    }
    

    async patchBookmark(noteId, newBookmarkValue) {
        await this.model.patch(`/note/${noteId}/bookmark`, { 'bookmark': newBookmarkValue })
    }

    async patchLastViewTime(noteId) {   
        await this.model.patch(`/viewedNoteTime/${noteId}`);
    }


    async move(folderId, droppedNoteId) {
        const { note } = await this.model.update('/moveNote', {'folder_id': folderId, 'note_id': droppedNoteId});
        this.view.renderDelete(note, false);
    }


    async delete(noteId, notify) {
        const { note } = await this.model.delete(`/note/${noteId}`);
        this.searchbar.deleteSearchItem(noteId);
        this.view.renderDelete(note);
        
        if (notify) {
            pushNotification('deleted', note.name)
        }
    }


    async handleSearch(searchItemId, searchType) {
        const viewId = viewToLoad(searchType)
        if (viewId === 'editor') {
            const { note, location } = await this.getById(searchItemId)
            this.applicationController.initView(viewId, {
                editorObjectType: 'note', 
                editorObject: note,
                newEditorObject: false, 
                previousView: 'notes', 
                editorObjectLocation: location
            })
        }
        if (viewId === 'notes') {
            const { folder, location } = await this.applicationController.getFolderById(searchItemId);
            this.applicationController.initView(viewId, {
                folder: folder,
                location: location
            });
        }
    }

    async #initSearchbar() {
        const [noteSearchItems, folderSearchItems] = await Promise.all([
            this.getSearchItems(),
            this.applicationController.getFolderSearchItems()
        ]);
        this.searchbar.fillSearchbar('note', noteSearchItems);
        this.searchbar.fillSearchbar('folder', folderSearchItems);
    }
}