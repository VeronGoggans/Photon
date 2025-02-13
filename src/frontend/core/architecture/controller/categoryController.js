import { HttpModel } from "../model/httpModel.js";
import { CREATE_CATEGORY_EVENT, FETCH_CATEGORIES_EVENT } from "../../components/eventBus.js";
import { RequestBodyFactory } from "../../patterns/factories/requestBodiesFactory.js";
import { CategoryView } from "../view/categoryView.js";



export class CategoryController {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.BASE_ENDPOINT = '/categories';
        this.view = new CategoryView(this, eventBus);

        // Events this controller will listen for
        this.eventBus.registerEvents({
            [FETCH_CATEGORIES_EVENT]: async () => await this.getCategories(),
            [CREATE_CATEGORY_EVENT]: async (newCategoryData) => await this.addCategory(newCategoryData)
        })
    }



    async addCategory(newCategoryData) {
        const { name, color } = newCategoryData;
        const { route, body } = RequestBodyFactory.getPostCategoryBody(name, color)

        const response = await HttpModel.post(route, body);
        const category = await response.content.category;
        
        this.view.renderOne(category);
    }



    async getCategories(categoryId = null) {
        let route = this.BASE_ENDPOINT;
        if (categoryId !== null) route = `${this.BASE_ENDPOINT}/${categoryId}`;

        const response = await HttpModel.get(route);
        return response.content.categories;
    }



    async updateCategory(updatedCategoryData) {
        const { name, color } = updatedCategoryData;
        const { route, body } = RequestBodyFactory.getPutCategoryBody(name, color);

        const response = await HttpModel.put(route, body);
        const category = response.content.category;

    }



    async deleteCategory(categoryId) {
        const response = await HttpModel.delete(`${this.BASE_ENDPOINT}/${categoryId}`);
        const category = response.content.category;
    }
}