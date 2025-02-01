import {HttpModel} from "../model/httpModel.js";
import { FETCH_CATEGORIES_EVENT } from "../components/eventBus.js";



export class CategoryController {
    constructor(eventBus) {
        this.eventBus = eventBus;
        this.model = new HttpModel();
        this.BASE_ENDPOINT = '/categories';

        // Events this controller will listen for
        this.eventBus.registerEvents({
            [FETCH_CATEGORIES_EVENT]: async () => await this.getCategories()
        })
    }


    async addCategory(newCategoryData) {
        const { name, color } = newCategoryData;

        const postCategoryRequest =  {
            'color': color,
            'name': name
        }

        const response = await this.model.add(this.BASE_ENDPOINT, postCategoryRequest);
        return await response.content.category;
    }



    async getCategories(categoryId = null) {
        let route = '/categories';

        if (categoryId !== null) {
            route = `/categories/${categoryId}`;
        }
        const response = await this.model.get(route);
        return response.content.categories;
    }



    async updateCategory(updatedCategoryData) {
        const { name, color } = updatedCategoryData;
        const putCategoryRequest = {
            'color': color,
            'name': name
        }

        const response = await this.model.update(this.BASE_ENDPOINT, putCategoryRequest);
        const category = response.content.category;

    }


    async deleteCategory(categoryId) {
        const response = await this.model.delete(`${this.BASE_ENDPOINT}/${categoryId}`);
        const category = response.content.category;


    }






}