import { Template } from "../components/template.js"; 
import { AnimationHandler } from "../handlers/animation/animationHandler.js";
import { TemplateObjectArray } from "../util/array.js";
import { decrementString } from "../util/ui.js";


export class TemplateView {
    constructor(controller, applicationController, dialog, notificationHandler) {
        this.controller = controller;
        this.applicationController = applicationController;
        this.notificationHandler = notificationHandler;
        this.dialog = dialog;
        this.templateObjects = new TemplateObjectArray();
        this.#initializeDomElements();
        this.#attachEventListeners();
    }


    renderAll(recent, other, totalUses, mostUsed) {
        this.templateObjects.clear()
        this.#renderTemplateStats(recent, other, totalUses, mostUsed);
        if (recent.length > 0) {
            const recentContentFragment = document.createDocumentFragment();
            const otherContentFragment = document.createDocumentFragment();

            for(let i = 0; i < recent.length; i++) {
                const templateCard = this.#template(recent[i]);
                recentContentFragment.appendChild(templateCard);
                AnimationHandler.fadeInFromBottom(templateCard);
            }

            for(let i = 0; i < other.length; i++) {
                const templateCard = this.#template(other[i]);
                otherContentFragment.appendChild(templateCard);
                AnimationHandler.fadeInFromBottom(templateCard);
            }
            this._recentTemplates.appendChild(recentContentFragment);
            this._otherTemplates.appendChild(otherContentFragment);
        } else {
            this.notificationHandler.push('empty')
        }
    }

    
    renderDelete(template, closeDialog = true) {
        const templates = this._recentTemplates.children;

        for (let i = 0; i < templates.length; i++) {
            if (templates[i].id === template.id) {
                AnimationHandler.fadeOutCard(templates[i], this._recentTemplates);
                this.templateObjects.remove(template);
                this._templateCountSpan.textContent = decrementString(
                    this._templateCountSpan.textContent
                ); 
            }
        }
        if (closeDialog) this.dialog.hide();
    }

    /**
     * This method renders a confirmation container 
     * telling the user if they want to delete the note.
     * 
     * @param {String} id 
     * @param {String} name
     */
    renderDeleteContainer(id, name) {
        this.dialog.renderDeleteModal(id, name, this)
    }

    handleTemplateCardClick(templateId) {
        const template = this.templateObjects.get(templateId);
        this.applicationController.initView('editor', 
            {
                editorObjectType: 'template', 
                editorObject: template,
                newEditorObject: false, 
                previousView: 'templates', 
            }
        );
    }

    getTemplateObject(templateId) {
        return this.templateObjects.get(templateId);
    }

    async handleDeleteButtonClick(id) {
        await this.controller.deleteTemplate(id);
    }

    #renderTemplateStats(recent, other, totalUses, mostUsed) {
        this._templateCountSpan.textContent = 
        recent.length + other.length

        this._templateUsesCountSpan.textContent = totalUses;
        this._mostUsedTemplateSpan.textContent = mostUsed;
    }

    #template(template) {
        this.templateObjects.add(template);
        return new Template(template, this)
    }

    #initializeDomElements() {
        this._addTemplateButton = document.querySelector('.add-template-btn');
        this._recentTemplates = document.querySelector('.recent-templates');
        this._otherTemplates = document.querySelector('.other-templates');
        this._templateCountSpan = document.querySelector('.template-count');
        this._templateUsesCountSpan = document.querySelector('.total-uses-count');
        this._mostUsedTemplateSpan = document.querySelector('.most-used-template');
    }

    #attachEventListeners() {
        this._addTemplateButton.addEventListener('click', () => {
            this.applicationController.initView('editor', {
                editorObjectType: 'template', 
                editorObject: null,
                newEditorObject: true, 
                previousView: 'templates', 
            })
        });
    }
}