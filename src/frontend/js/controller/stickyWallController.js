import { HttpModel } from "../model/httpModel.js";
import { StandardStickyBoardView, ColumnStickyBoardView } from "../view/stickyNoteView.js";




export class StickWallController {
    constructor(applicationController) {
        this.applicationController = applicationController;         // The main controller
        this.model = new HttpModel();                               // The HttpModel is a dependency to make HTTP calls to the python backend
    }


    /**
     * This is the initializer for the standard sticky board view
     *
     * @param stickyBoard
     */
    async initStandardStickyBoard(stickyBoard) {
        const boardType = 'standard';
        this.view = new StandardStickyBoardView(this, stickyBoard, boardType);
        await this.get(stickyBoard.id)
    }


    /**
     * This is the initializer for the column sticky board view
     *
     * @param stickyBoard
     */
    async initColumnStickyBoard(stickyBoard) {
        const boardType = 'column';
        this.view = new ColumnStickyBoardView(this, stickyBoard, boardType);
        await this.get(stickyBoard.id)
    }



    async add(sticky) {
        const { Object } = await this.model.add('/stickyNote', sticky);
        this.view.renderOne(Object);
    }


    /**
     * This method will retrieve all the stickies that belong to the provided sticky board ID
     *
     * @param stickyBoardId  - The sticky board ID of which to retrieve the sticky notes from
     * @param boardType      - The board type of which to retrieve the sticky notes from
     */
    async get(stickyBoardId, boardType) {
        const { Objects } = await this.model.get(`/stickyNotes/${stickyBoardId}/${boardType}`);
        this.view.renderAll(Objects);
    }




    async update(sticky) {
        const { Object }  = await this.model.update('/stickyNote', sticky);
        this.view.renderUpdate(Object);
    }


    /**
     * This method will delete a specified sticky note
     *
     * @param stickyNoteId  - The ID of the sticky note
     */
    async delete(stickyNoteId) {
        await this.model.delete(`/stickyNote/${stickyNoteId}`);
        this.view.renderDelete(stickyNoteId);
    }



    loadPreviousView() {        
        const previousView = this.applicationController.getPreviousView();        
        this.applicationController.initView(previousView);
    }
}