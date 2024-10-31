class Milestone extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.milestone = JSON.parse(this.getAttribute('milestone'));
        this.id = this.milestone.id;

        this.render();
        this.addEventListeners();
    }


    disconnectedCallback() {
        this.removeEventListeners();
    }


    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'milestone') {
            this.milestone = JSON.parse(newValue);
            this.render();
            this.addEventListeners()            
        }
    }
    

    render() {
        this.innerHTML = `
            <div class="timeline-item">
            <div class="timeline-icon">
                <span class="date">January 1, 2023</span>
            </div>
            <div class="timeline-content">
                <h2>${this.milestone.name}</h2>
                <p class="deadline"><i class="bi bi-calendar-check"></i>Deadline in <span class="big-text">1w</span> / <span class="big-text">3d</span></p>
                <p class="task-count"><i class="bi bi-list-task"></i><span class="big-text">${this.milestone.taskCount}</span></p>
                <div class="progress">
                    <div class="progress__done">
                        <span>Done: 5</span>
                    </div>
                    
                    <div class="progress__doing">
                        <span>Doing: 10</span>
                    </div>
                    <div class="progress__todo">
                        <span>To do: 10</span>
                    </div>
                </div>
                <p class="description">${this.milestone.description}</p>
                <div class="milestone-options">
                    <i id="edit-btn" class="bi bi-pen"></i>
                    <i id="delete-btn" class="bi bi-trash3"></i>
                </div>
            </div>
            </div>
        `;
    }

    addEventListeners() {
        this.querySelector('#edit-btn').addEventListener('click', this.handleEditClick.bind(this));
        this.querySelector('#delete-btn').addEventListener('click', this.handleDeleteClick.bind(this));
    }


    removeEventListeners() {
        this.querySelector('#edit-btn').removeEventListener('click', this.handleEditClick.bind(this));
        this.querySelector('#delete-btn').removeEventListener('click', this.handleDeleteClick.bind(this));
    }

    handleDeleteClick() {
        this.dispatchEvent(new CustomEvent('DeleteMilestone', { detail: { milestone: this.milestone }, bubbles: true }));
    }

    handleEditClick() {
        this.dispatchEvent(new CustomEvent('UpdateMilestone', { detail: { milestone: this.milestone }, bubbles: true }));
    }
}

customElements.define('milestone-card', Milestone);