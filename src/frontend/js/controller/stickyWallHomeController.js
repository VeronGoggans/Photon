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


    /**
     * This method makes a call to the python backend to delete the specified sticky board 
     * 
     * This method needs the board type to prevent any ID conflict between the two board types
     * 
     * @param { Number } stickyBoardId    - The ID of the deleted sticky board
     * @param { String } stickyBoardType  - The type of the deleted sticky board
     */
    async delete(stickyBoardId, stickyBoardType) {
        await this.model.delete(`/stickyBoard/${stickyBoardId}/${stickyBoardType}`);
        this.view.renderDelete(stickyBoardId, stickyBoardType);
    }
}