import { AnimationHandler } from "../handlers/animation/animationHandler.js";
import { BaseView } from "./baseView.js";
import { taskBoardSections } from "../constants/constants.js";
import { incrementString, decrementString } from "../util/ui.js";


export class TaskView extends BaseView {
    constructor(controller, applicationController) {
        super(controller);
        this.controller = controller;
        this.taskboardId = null;
        this.applicationController = applicationController;
        this.#initElements();
        this.#eventListeners();
        AnimationHandler.fadeInFromBottom(this.viewElement);
    }

    renderTaskboard(taskboard) {
        // Setting the name and description for the taskboard
        this.name.textContent = taskboard.name;
        if (taskboard.description !== '') {
            this.description.textContent = taskboard.description;
        }
        this.taskboardId = taskboard.id;
    }


    renderAll(tasks) {        
        const todoTasks = document.createDocumentFragment();
        const progressTasks = document.createDocumentFragment();
        const doneTasks = document.createDocumentFragment();
        
        for (let i = 0; i < tasks.length; i++) {
            const task = this.#task(tasks[i]);        

            if (tasks[i].section === 'To do') {
                todoTasks.appendChild(task)
                this.todoCount.textContent = todoTasks.childNodes.length;
            }
            if (tasks[i].section === 'In progress') {
                progressTasks.appendChild(task)
                this.inprogressCount.textContent = progressTasks.childNodes.length;
            } 
            if (tasks[i].section === 'Done') {
                doneTasks.appendChild(task)
                this.doneCount.textContent = doneTasks.childNodes.length;
            } 
            AnimationHandler.fadeInFromSide(task);
        }
        this.toDoSection.append(todoTasks);
        this.inProgressSection.append(progressTasks);
        this.doneSection.append(doneTasks);
    }


    renderOne(task) {
        const taskCard = this.#task(task);
        AnimationHandler.fadeInFromSide(taskCard);
        this.toDoSection.appendChild(taskCard)
    }


    renderDelete(taskId) {
        const tasks = this.board.querySelectorAll('task-card');
        
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].id == taskId) {
                AnimationHandler.fadeOutCard(tasks[i])
            }
        }
    }


    renderUpdate(task) {
        const tasks = this.board.querySelectorAll('task-card'); 

        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].id == task.id) {       
                tasks[i].setAttribute('task', JSON.stringify(task));
            }
        }
    }


    /**
     * This method will retrieve the right board section to append 
     * the dropped task to
     * @param {Node} target 
     * @returns 
     */
    #getBoardSection(target) {
        const nodeName = target.nodeName;        
        // If the task dropped on another task. 
        // return the parent node of that task, which is the board itself.
        if (target.classList.contains("task")) {
            return target.parentElement
        }
        else if (nodeName === 'P' || nodeName === 'H3') {
            const task = target.parentElement;
            return task.parentElement
        }
        else if (nodeName === 'I') {
            const P = target.parentElement;
            const task = P.parentElement;
            return task.parentElement;
        }
        return target
    }


    
    updateTaskCounter(tasksSection, operation) {
        const tasksCount = tasksSection.parentElement.querySelector('.board-section-name .task-count');
        
        if (operation === 'add') {
            tasksCount.textContent = incrementString(tasksCount.textContent);
        }
        else if (operation === 'subtract') {
            tasksCount.textContent = decrementString(tasksCount.textContent);
        }
    }


    #task(task) {
        const taskCard = document.createElement('task-card');
        taskCard.setAttribute('task', JSON.stringify(task));
        return taskCard
    }

    #eventListeners() {
        this.addTaskButton.addEventListener('click', () => {this.dialog.renderTaskModal(this.controller, this.taskbaordId)});
        this.addMilestoneButton.addEventListener('click', () => {this.dialog.renderMilestoneModal(this.controller, this.taskboardId)});
        this.viewElement.addEventListener('PreviousViewButtonClick', () => {this.controller.loadPreviousView()});
        this.board.addEventListener('TaskCardClick', (event) => {
            const { task } = event.detail;
            this.dialog.renderTaskModal(this.controller, this.taskboardId, task);
        })

        for (let i = 0; i < this.boardSections.length; i++) {
            this.boardSections[i].addEventListener('dragover', () => {
                this.boardSections[i].style.borderColor = '#5c7fdd';
            });

            this.boardSections[i].addEventListener('dragleave', () => {
                this.boardSections[i].style.borderColor = 'transparent';
            });

            this.boardSections[i].addEventListener('drop', (event) => {
                console.log('Something dropped');
                
                event.preventDefault();
                this.boardSections[i].style.borderColor = 'transparent';
                const { draggedTask, itemType } = JSON.parse(event.dataTransfer.getData('text/plain'));
                
                console.log(draggedTask);
                
                if (itemType === 'task') {
                    const boardSection = this.#getBoardSection(event.target);
                    const taskCard = document.getElementById(draggedTask.id);
                    boardSection.appendChild(taskCard);

                    // Update the task and send it to the controller
                    const section = this.boardSections[i].parentElement.className;
                    draggedTask.section = taskBoardSections[section];
                    this.controller.update(task);
                }
            });
        }
    }


    #initElements() {
        this.viewElement = document.querySelector('.task-board-view');
        this.toDoSection = document.querySelector('.todo .tasks');
        this.inProgressSection = document.querySelector('.inprogress .tasks');
        this.doneSection= document.querySelector('.done .tasks');
        this.todoCount = document.querySelector('.todo .board-section-name span')
        this.inprogressCount = document.querySelector('.inprogress .board-section-name span')
        this.doneCount = document.querySelector('.done .board-section-name span')
        this.addTaskButton = document.querySelector('.add-task-btn');
        this.addMilestoneButton = document.querySelector('.add-milestone-btn');
        this.board = document.querySelector('.board');
        this.description = document.querySelector('.description-block-content');
        this.name = document.querySelector('h1');
        
        this.boardSections = [this.toDoSection, this.inProgressSection, this.doneSection]
    }
}