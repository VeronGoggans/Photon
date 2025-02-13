import { Stack } from "../../datastuctures/stack.js";
import { Dialog } from "../../util/dialog.js";
import { EventBus, FETCH_SETTINGS_EVENT, GET_CURRENT_VIEW_EVENT, GET_PREVIOUS_VIEW_EVENT, INIT_VIEW_EVENT, SET_CURRENT_VIEW_EVENT } from "../../components/eventBus.js";
import { ViewRouteIDs } from "../../constants/constants.js";
import { Router } from "../router.js";



export class ApplicationController {
    constructor() {
        this.eventBus = new EventBus();
        this.viewStack = new Stack();
        this.router = new Router(this.eventBus);
        this.dialog = new Dialog(this.eventBus);

        this.eventBus.asyncEmit(FETCH_SETTINGS_EVENT);
        this.eventBus.registerEvents({
            [GET_PREVIOUS_VIEW_EVENT]: () => this.viewStack.pop(),
            [GET_CURRENT_VIEW_EVENT]: () => this.viewStack.view(),
            [SET_CURRENT_VIEW_EVENT]: (viewId) => this.viewStack.push(viewId),
            [INIT_VIEW_EVENT]: async (viewParameters) => await this.router.routeTo(viewParameters)
        })
    }

    async start() {
        await this.router.routeTo({ viewId: ViewRouteIDs.HOME_VIEW_ID });
    }
}

