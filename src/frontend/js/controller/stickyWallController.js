import { HttpModel } from "../model/httpModel.js";
import { StickyNoteView } from "../view/stickyNoteView.js";


export class StickWallController {
    constructor(applicationController) {
        this.applicationController = applicationController;
        this.model = new HttpModel();
    }

    async init(stickyWall) {
        this.view = new StickyNoteView(this, stickyWall);
        await this.get(stickyWall.id)
    }


    async add(sticky) {
        const { Object } = await this.model.add('/stickyNote', sticky);
        this.view.renderOne(Object);
    }


    async get(stickyWallId) {
        const { Objects } = await this.model.get(`/stickyNotes/${stickyWallId}`);
        this.view.renderAll(Objects);
    }


    async update(sticky) {
        const { Object }  = await this.model.update('/stickyNote', sticky);
        this.view.renderUpdate(Object);
    }


    async delete(stickyNoteId) {
        await this.model.delete(`/stickyNote/${stickyNoteId}`);
        this.view.renderDelete(stickyNoteId);
    }

    loadPreviousView() {        
        const previousView = this.applicationController.getPreviousView();        
        this.applicationController.initView(previousView);
    }
}