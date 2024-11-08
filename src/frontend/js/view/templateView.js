import { AnimationHandler } from "../handlers/animationHandler.js";
import { decrementString } from "../util/ui.js";
import { BaseView } from "./baseView.js";
import { createCustomElement } from "../util/ui/components.js";


export class TemplateView extends BaseView {
    constructor(controller, applicationController) {
        super(controller);
        this.controller = controller;
        this.applicationController = applicationController;
        this.#initElements();
        this.#eventListeners();

        AnimationHandler.fadeInFromBottom(this._viewElement);
    }


    renderAll(recent, other, totalUses, mostUsed) {
        this.#renderTemplateStats(recent, other, totalUses, mostUsed);
        if (recent.length > 0) {
            const recentContentFragment = document.createDocumentFragment();
            const otherContentFragment = document.createDocumentFragment();

            for(let i = 0; i < recent.length; i++) {
                const templateCard = createCustomElement(recent[i], 'template-card');
                recentContentFragment.appendChild(templateCard);
                AnimationHandler.fadeInFromBottom(templateCard);
            }

            for(let i = 0; i < other.length; i++) {
                const templateCard = createCustomElement(other[i], 'template-card');
                otherContentFragment.appendChild(templateCard);
                AnimationHandler.fadeInFromBottom(templateCard);
            }
            this._recentTemplates.appendChild(recentContentFragment);
            this._otherTemplates.appendChild(otherContentFragment);
        } 
    }

    
    renderDelete(template) {
        const templates = this._recentTemplates.children;

        for (let i = 0; i < templates.length; i++) {
            if (templates[i].id == template.id) {
                AnimationHandler.fadeOutCard(templates[i]);
                this._templateCountSpan.textContent = decrementString(this._templateCountSpan.textContent); 
            }
        }
    }

    handleTemplateCardClick(event) {
        const { template } = event.detail;
        this.applicationController.initView('editor', 
            {
                editorObjectType: 'template', 
                editorObject: template,
                newEditorObject: false, 
                previousView: 'templates', 
                editorObjectLocation: null
            }
        );
    }

    #renderTemplateStats(recent, other, totalUses, mostUsed) {
        this._templateCountSpan.textContent = recent.length + other.length
        this._templateUsesCountSpan.textContent = totalUses;
        this._mostUsedTemplateSpan.textContent = mostUsed;
    }

    #initElements() {
        this._addTemplateButton = document.querySelector('.add-template-btn');
        this._recentTemplates = document.querySelector('.recent-templates');
        this._otherTemplates = document.querySelector('.other-templates');
        this._templateCountSpan = document.querySelector('.template-count');
        this._templateUsesCountSpan = document.querySelector('.total-uses-count');
        this._mostUsedTemplateSpan = document.querySelector('.most-used-template');
        this._viewElement = document.querySelector('.templates');
    }

    #eventListeners() {
        this._recentTemplates.addEventListener('DeleteTemplate', (event) => {
            const { template } = event.detail;
            this.dialog.renderDeleteModal(this.controller, template.id, template.name)
        })

        this._otherTemplates.addEventListener('DeleteTemplate', (event) => {
            const { template } = event.detail;
            this.dialog.renderDeleteModal(this.controller, template.id, template.name)
        })

        this._recentTemplates.addEventListener('DeleteTemplate', (event) => {this.handleTemplateCardClick(event)})
        this._otherTemplates.addEventListener('DeleteTemplate', (event) => {this.handleTemplateCardClick(event)})


        this._addTemplateButton.addEventListener('click', () => {
            this.applicationController.initView('editor', {
                editorObjectType: 'template', 
                editorObject: null,
                newEditorObject: true, 
                previousView: 'templates', 
                editorObjectLocation: null
            })
        });
    }
}