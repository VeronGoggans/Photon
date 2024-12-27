import { HttpModel } from "../model/httpModel.js";
import { StandardStickyBoardView, ColumnStickyBoardView } from "../view/stickyNoteView.js";
import {GET_PREVIOUS_VIEW_EVENT, INIT_VIEW_EVENT} from "../components/eventBus.js";




export class StickWallController {
    constructor(eventBus) {
        this.eventBus = eventBus;         // The main controller
        this.model = new HttpModel();     // The HttpModel is a dependency to make HTTP calls to the python backend
    }


    /**
     * This is the initializer for the standard sticky board view
     *
     * @param stickyBoard
     */
    async initStandardStickyBoard(stickyBoard) {
        const boardType = 'standard';
        this.view = new StandardStickyBoardView(this, stickyBoard, boardType);
        // await this.get(stickyBoard.id)
    }


    /**
     * This is the initializer for the column sticky board view
     *
     * @param stickyBoard
     */
    async initColumnStickyBoard(stickyBoard) {
        const boardType = 'column';
        this.view = new ColumnStickyBoardView(this, stickyBoard, boardType);
        // await this.get(stickyBoard.id)
    }


    async save() {

    }



    async add(sticky) {
        const route = '/sticky-note'
        const response = await this.model.add(route, sticky);

        this.view.renderOne(response.content.stickyNote);
    }



    /**
     * This method will retrieve all the stickies that belong to the provided sticky board ID
     *
     * @param stickyBoardId  - The sticky board ID of which to retrieve the sticky notes from
     * @param boardType      - The board type of which to retrieve the sticky notes from
     */
    async get(stickyBoardId, boardType) {
        const route = `/stickyNotes/${stickyBoardId}/${boardType}`;
        const response = await this.model.get(route);

        this.view.renderAll(response.content.stickyNotes);
    }




    async update(sticky) {
        const route = '/stickyNote';
        const response = await this.model.update(route, sticky);

        this.view.renderUpdate(response.content.stickyNote);
    }




    async updateStickyBoardName(updatedStickyBoardData) {
        const { stickyBoardId, boardType, updatedName } = updatedStickyBoardData;
        const patchStickyBoardNameRequest = {
            "board_type": "standard",
            "name": "Test sticky board"
        }
        console.log(patchStickyBoardNameRequest)
        const route = `/stickyBoards/${stickyBoardId}/name`;
        await this.model.patch(route, patchStickyBoardNameRequest);
    }



    async updateStickyBoardDescription(updatedStickyBoardData) {
        const { stickyBoardId, boardType, updatedDescription } = updatedStickyBoardData;
        const patchStickyBoardDescriptionRequest = {
            'board_type': boardType,
            'description': updatedDescription
        }
        const route = `/stickyBoards/${stickyBoardId}/description`;
        await this.model.patch(route, patchStickyBoardDescriptionRequest);
    }


    /**
     *
     *
     * @param stickyNoteId
     * @param changedContent
     */
    async patchStickyNote(stickyNoteId, changedContent) {}


    /**
     * This method will delete a specified sticky note
     *
     * @param stickyNoteId  - The ID of the sticky note
     */
    async delete(stickyNoteId) {
        const route = `/stickyNotes/${stickyNoteId}`;
        await this.model.delete(route);

        this.view.renderDelete(stickyNoteId);
    }



    loadPreviousView() {        
        const previousViewId = this.eventBus.emit(GET_PREVIOUS_VIEW_EVENT);
        console.log(previousViewId)
        this.eventBus.emit(INIT_VIEW_EVENT, {viewId: previousViewId});
    }
}