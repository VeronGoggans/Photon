import { AnimationHandler } from "../../handlers/animationHandler.js";



export class UIWebComponentFactory {


    static createUIWebComponent(componentData, componentName, attributeBased = true) {
        const uiWebComponent = document.createElement(componentName);
        
        if (attributeBased) {
            uiWebComponent.setAttribute(componentName, JSON.stringify(componentData));
            return uiWebComponent
        }

        uiWebComponent.setData(componentData);
        return uiWebComponent
    }



    static createUIWebComponentCollection(componentDataIterable, componentName, UIParent, attributeBased = true) {
        const contentFragment = document.createDocumentFragment();
        
        for (const componentData of componentDataIterable) {
            const uiWebcomponent = UIWebComponentFactory.createUIWebComponent(componentData, componentName, attributeBased);

            contentFragment.appendChild(uiWebcomponent);
            AnimationHandler.fadeInFromBottom(uiWebcomponent);
        }

        UIParent.appendChild(contentFragment);
    }
}
