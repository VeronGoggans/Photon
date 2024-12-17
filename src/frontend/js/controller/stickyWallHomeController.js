import { HttpModel } from "../model/httpModel.js";
import { StickyWallHomeView } from "../view/stickyWallHomeView.js"; 


export class StickyWallHomeController {
    constructor(applicationController) {
        this.applicationController = applicationController;
        this.model = new HttpModel();
    }

    async init() {
        this.view = new StickyWallHomeView(this, this.applicationController);
        await this.get()
    }

    async add(stickyBoardData) {
        const { StickyBoard }  = await this.model.add('/stickyBoard', stickyBoardData);
        this.view.renderOne(StickyBoard);
    }

    async get() {
        const { StickyBoards } = await this.model.get(`/stickyBoards`);
        this.view.renderAll(StickyBoards);
    }

    async getById(stickyBoardId) {
        const { Object } = await this.model.get(`/stickyBoard/${stickyBoardId}`);
        return Object
    }

    async delete(stickyBoardId) {
        await this.model.delete(`/stickyBoard/${stickyBoardId}`);
        this.view.renderDelete(stickyBoardId);
    }
}