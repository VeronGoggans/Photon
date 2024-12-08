import { HttpModel } from "../model/httpModel.js";
import { TemplateView } from "../view/templateView.js";
import { pushNotification, renderEmptyFolderNotification } from "../handlers/notificationHandler.js";


export class TemplateController {
    constructor(applicationController) {
        this.applicationController = applicationController;
        this.model = new HttpModel();
    }


    async init() {
        this.view = new TemplateView(this, this.applicationController)
        await this.get()
    }


    async add(name, content, notify) {
        await this.model.add('/template', {'name': name,'content': content})
        if (notify) {
            pushNotification('saved')
        }
    }


    async get() {
        const { recent, other, totalUses, mostUsed } = await this.model.get('/templates');
        this.view.renderAll(recent, other, totalUses, mostUsed);   
    }


    async getById(templateId, updateUseCount) {
        const { template } = await this.model.get(`/templateById/${templateId}/${updateUseCount}`);        
        return template
    }


    async getTemplateNames() {
        const { templates } = await this.model.get('/templateNames');
        return templates
    }


    async update(template, notify) {
        await this.model.update('/template', {'id': template.id,'name': template.name, 'content': template.content})

        if (notify) {
            pushNotification('updated');
        }
    }


    async delete(templateId, notify) {
        const { template } = await this.model.delete(`/template/${templateId}`)
        this.view.renderDelete(template);

        if (notify) {
            pushNotification('deleted', template.name)
        }
    }
}