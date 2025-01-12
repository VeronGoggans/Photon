import { HttpModel } from "../model/httpModel.js";
import { StickyWallHomeView } from "../view/stickyWallHomeView.js"; 


export class StickyWallHomeController {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.model = new HttpModel();
    }



    async init() {
        this.view = new StickyWallHomeView(this, this.eventBus);
        await this.getStickyBoards();
    }



    async addStickyBoard(postStickyBoardRequest) {
        const route = `/stickyBoards`
        const response = await this.model.add(route, postStickyBoardRequest);

        this.view.renderOne(response.content.stickyBoard);
    }



    async getStickyBoards() {
        const route = `/stickyBoards`;
        const response = await this.model.get(route);

        this.view.renderAll(response.content.stickyBoards);
    }



    async getStickyBoardById(stickyBoardId) {
        const route = `/stickyBoards/${stickyBoardId}`;
        const response = await this.model.get(route);

        return response.content.stickyBoard;
    }



    /**
     * This method makes a call to the python backend to delete the specified sticky board 
     * 
     * This method needs the board type to prevent any ID conflict between the two board types
     * 
     * @param { Number } stickyBoardId    - The ID of the deleted sticky board
     * @param { String } stickyBoardType  - The type of the deleted sticky board
     */
    async deleteStickyBoard(stickyBoardId, stickyBoardType) {
        const route = `/stickyBoards/${stickyBoardId}/${stickyBoardType}`;
        await this.model.delete(route);

        this.view.renderDelete(stickyBoardId);
    }
}