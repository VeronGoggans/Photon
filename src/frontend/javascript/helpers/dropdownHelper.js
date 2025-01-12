export class DropdownHelper {
    constructor(dropdowns, dropdownOptions, viewElement, excludedContainers) {
        this.dropdowns = dropdowns;
        this.dropdownOptions = dropdownOptions;        
        this.viewElement = viewElement;
        this.excludedContainers = excludedContainers;
        this.#eventListeners();
    }


    closeDropdowns(target) {
      this.dropdownOptions.forEach((dropdown) => {
          if (dropdown !== target) {
              dropdown.style.visibility = 'hidden';
              dropdown.style.opacity = '0';
          }
        }
      )
    }


    updateRecentlyViewedNoteTimes(target) {
        // update all view times inside the recently-viewed-notes-dropdown         
        if (target.id === 'recently-viewed-notes-dropdown') {
            const components = document.querySelectorAll('recently-viewed-note-card');
          
            Array.from(components).forEach(component => {
                component.render();
            });
        }      
    }


    toggleDropdown(dropdownOptions) {      
      this.closeDropdowns(dropdownOptions);
      this.updateRecentlyViewedNoteTimes(dropdownOptions);
      dropdownOptions.style.visibility = dropdownOptions.style.visibility === 'visible' ? 'hidden' : 'visible';
      dropdownOptions.style.opacity = dropdownOptions.style.opacity === '1' ? '0' : '1';
    }


    #eventListeners() {
      for (let i = 0; i < this.dropdowns.length; i++) {
        this.dropdowns[i].addEventListener('click', () => {
            this.toggleDropdown(this.dropdownOptions[i])
        });
      }

      this.viewElement.addEventListener('click', (event) => {
        // Check if the click was on a dropdown.
        if (this.excludedContainers.some(selector => event.target.closest(selector))) {
          return;
        } 
        this.closeDropdowns();
      });
    }
}