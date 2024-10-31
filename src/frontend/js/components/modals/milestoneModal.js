import { CNode } from "../../util/CNode.js";
import { DropdownHelper } from "../../helpers/dropdownHelper.js";
import { dialogEvent } from "../../util/dialog.js";


export class MilestoneModal {
    constructor(controller, taskboardId, milestone = null) {
        this.controller = controller;
        this.milestone = milestone;
        this.taskboardId = taskboardId;
        this.dialog = document.querySelector('.dialog');

        this.action = 'add';
        this.HOST = CNode.create('div', {'class': 'milestone-modal'});
        this.HOST.innerHTML = `
            <input class="milestone-name-input" type="text" placeholder="Milestone name" spellcheck="false">
            <div>
                <p><i class="bi bi-clock"></i> Due date</p>
                <input type="date">
            </div>
            <div>
                <p><i class="bi bi-chat-left-text"></i> Description</p>
                <textarea placeholder="Type something here..." spellcheck="false"></textarea>
            </div>
            <button>Add</button>
        `;

        if (milestone !== null) {
            this.#setMilestone();
        }

        this.#eventListeners();
        return this.HOST
    }


    #setMilestone() {

    }

    #eventListeners() {

    }


}