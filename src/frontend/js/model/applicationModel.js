/**
 * This class is used to store the previous view.
 * So that when a user clicks on a back button,
 * they get taken to the view they were in previously.
 */
export class ApplicationModel {
    constructor() {
        this.previousView = [];
    }

    setPreviousView(viewId) {
        this.previousView.push(viewId);
    }

    getPreviousView() {
        return this.previousView.pop();
    }
}