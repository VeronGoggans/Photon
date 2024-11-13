class ListItemCard1 extends HTMLElement {
    static get observedAttributes() {
        return ['list-item', 'list-item-type']; 
    }

    constructor() {
        super();
    }

    
    connectedCallback() {
        // Parse the stickyWall JSON attribute
        this.listItem = JSON.parse(this.getAttribute('list-item'));
        this.listItemType = this.getAttribute('list-item-type');
        this.id = this.listItem.id;
        
        this.render();
        this.addEventListeners();
    }


    disconnectedCallback() {
        this.removeEventListeners();
    }


    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'list-item') {
            this.listItem = JSON.parse(newValue);
            this.render();
            this.addEventListeners()            
        } 
        else if (name === 'list-item-type') {
            this.listItemType = newValue;
        }
    }
    

    render() {
        this.innerHTML = `
            <span class="list-1-item-name">${this.listItem.name}</span>
            <div class="list-item-card-1-buttons-container">
                <button class="edit-button"><i class="bi bi-pen-fill"></i></button>
                <button class="delete-button"><i class="bi bi-trash3-fill"></i></button>
            </div>
        `;
    }


    addEventListeners() {
        this.querySelector('.list-1-item-name').addEventListener('click', this.handleCardClick.bind(this));
        this.querySelector('.delete-button').addEventListener('click', this.handleDeleteClick.bind(this));
        this.querySelector('.edit-button').addEventListener('click', this.handleEditClick.bind(this));
    }


    removeEventListeners() {
        this.querySelector('.list-1-item-name').removeEventListener('click', this.handleCardClick.bind(this));
        this.querySelector('.delete-button').removeEventListener('click', this.handleDeleteClick.bind(this));
        this.querySelector('.edit-button').removeEventListener('click', this.handleEditClick.bind(this));
    }


    handleCardClick() {
        this.dispatchEvent(new CustomEvent('ListItemCardClick', { detail: { listItem: this.listItem, listItemType: this.listItemType }, bubbles: true }));
    }


    handleDeleteClick() {
        this.dispatchEvent(new CustomEvent('DeleteListItem', { detail: { listItem: this.listItem, listItemType: this.listItemType }, bubbles: true }));
    }


    handleEditClick() {
        this.dispatchEvent(new CustomEvent('UpdateListItem', { detail: { listItem: this.listItem, listItemType: this.listItemType }, bubbles: true }));
    }
}


class Checklist extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.contentEditable = false
        this.render();
        this.addEventListeners();
    }

    init() {
        this.innerHTML = `
            <input class="checklist-name-input" type="text" placeholder="Checklist name">
            <span class="completion-percentage">0% Done</span>
            <div class="progress">
                <div class="progress__fill"></div>
            </div>
            <div class="tasks-section">
                <div class="tasks-count">
                    <i class="bi bi-check-circle-fill"></i>
                    <span class="tasks-counter">0 Tasks</span>
                </div>
                <div class="tasks">
                    <div class="add-task-btn">
                        <i class="bi bi-plus-lg"></i>
                        <input class="new-task-input" type="text" placeholder="Write down a task">
                    </div>
                </div>
            </div>
        `
    }



    render() {
        this.checkListNameInput = this.querySelector('.checklist-name-input');
        this.newTaskInput = this.querySelector('.new-task-input');
        this.tasksContainer = this.querySelector('.tasks');
        this.taskCounter = this.querySelector('.tasks-counter');
        this.tasks = this.querySelectorAll('.task');
        this.progress = this.querySelector('.progress__fill');
        this.progressText = this.querySelector('.completion-percentage');
        this.updateTaskCounter();
        this.updateProgressBar();
        if (this.tasks.length > 0) {
            this.tasks.forEach(taskDiv => {
                this.listenForChecksAndUnchecks(taskDiv);
                this.checkCompletedTasksOnLoad(taskDiv);
            })
        }
    }


    addEventListeners() {
        this.checkListNameInput.addEventListener('input', () => {
            this.checkListNameInput.setAttribute('value', this.checkListNameInput.value);
        })
        this.newTaskInput.addEventListener('keydown', (event) => {this.addTask(event)});
    }


    listenForChecksAndUnchecks(taskDiv) {
        const checkbox = taskDiv.querySelector('input');
        // Listen for changes to the checkbox
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                // Add the completed-task class when checked
                taskDiv.classList.add('completed-task');
            } else {
                // Remove the completed-task class when unchecked
                taskDiv.classList.remove('completed-task');
            }
            this.updateProgressBar();
        });
    }


    checkCompletedTasksOnLoad(taskDiv) {
        if (taskDiv.classList.contains('completed-task')) {
            taskDiv.querySelector('input').checked = true;
        }
    }


    addTask(event) {
        if (event.key === 'Enter') {
            const taskPrompt = this.newTaskInput.value;
            const newTask = document.createElement('div')
            newTask.classList.add('task');
            newTask.innerHTML = `
                <input type="checkbox">
                <input type="text" value="${taskPrompt}">
            `
            this.listenForChecksAndUnchecks(newTask);
            this.tasksContainer.insertBefore(newTask, this.tasksContainer.lastElementChild);
            this.newTaskInput.value = '';
            this.updateTaskCounter();
            this.updateProgressBar();
        } 
    }


    updateProgressBar() {
        const completedTasks = this.querySelectorAll('.completed-task').length  ;
        const allTasks = this.querySelectorAll('.task').length;        
        if (allTasks > 0) {            
            const percentage = Math.round(completedTasks / allTasks * 100);        
            this.progress.style.width = `${percentage}%`;
            this.progressText.textContent = `${percentage}% Done`;
        }
    }


    updateTaskCounter() {
        const tasks = this.querySelectorAll('.task');
        this.taskCounter.textContent = `${tasks.length} Tasks`
    }
}

// Register the custom element
customElements.define('list-item-card-1', ListItemCard1);
customElements.define('check-list', Checklist);
