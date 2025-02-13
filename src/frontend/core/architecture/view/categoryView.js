import { AnimationHandler } from "../../handlers/animationHandler.js";
import { UIWebComponentFactory } from "../../patterns/factories/webComponentFactory.js";
import { UIWebComponentNames } from "../../constants/constants.js";


export class CategoryView {
    constructor(controller, eventBus) {
        this.controller = controller;
        this.eventBus = eventBus;

        this.#defineElements();
        this.#defineEvents();
    }

    
    renderAll(categories) {
        UIWebComponentFactory.
        createUIWebComponentCollection(categories, UIWebComponentNames.CATEGORY, this.categoriesCollection)
    }


    renderOne(category) {
        const categoryCard = UIWebComponentFactory.createUIWebComponent(category, UIWebComponentNames.CATEGORY);
        this.categoriesCollection.appendChild(categoryCard);
        AnimationHandler.fadeInFromBottom(categoryCard);   
    }


    renderUpdate(category) {
        const categories = this.categoriesCollection.children;

        for (const categoryCard of categories) {
            if (categoryCard.id === String(category.id)) {                
                categoryCard.setAttribute(UIWebComponentNames.CATEGORY, JSON.stringify(category));
            }
        }
    }


    renderDelete(category) {
        const categories = this.categoriesCollection.children;

        for (const categoryCard of categories) {
            if (categoryCard.id === String(category.id)) {
                AnimationHandler.fadeOutCard(categoryCard);
            }
        }
    }


    #defineElements() {
        this.categoriesCollection = document.querySelector('.categories'); 
        
    }

    
    #defineEvents() {

    }
}