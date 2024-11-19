import {select, classNames, gridParams} from './settings.js';
import Grid from './components/Grid.js';

export const app = {
  
  initPages: function(){
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    const selectedNavLinks = (select.nav.links);
    thisApp.navLinks = document.querySelectorAll(selectedNavLinks);
    
    const divIdFromAddress = window.location.hash.replace('#/', '');
    let pageMatchingId = thisApp.pages[0].id;

    for (let page of thisApp.pages){
      if (page.id === divIdFromAddress){
        pageMatchingId = page.id;
        break;
      }
    }
    thisApp.activatePage(pageMatchingId);

    for (let link of thisApp.navLinks){
      link.addEventListener('click', function(event){
        const clickedElement = this;
        event.preventDefault();

        const pageId = clickedElement.getAttribute('href').replace('#', '');
        thisApp.activatePage(pageId);

        window.location.hash = '#/' + pageId;
      });
    }
  },

  activatePage: function(pageId){
    const thisApp = this;

    for (let link of thisApp.navLinks) {
      const linkPath = link.getAttribute('href').slice(1);
      link.classList.toggle(classNames.links.active, linkPath === pageId);
    }

    for (let page of thisApp.pages){
      page.classList.toggle(classNames.pages.active, page.id === pageId);
    }
  },

  saveGridSettingsInStorage: function() {
    const thisApp = this;

    thisApp.creatingGridOptions = document.querySelectorAll('input[name="creating-grid-option"]');
    thisApp.checkedCreatingGridOption;

    for (let option of thisApp.creatingGridOptions) {
      if (option.checked)
        thisApp.checkedCreatingGridOption = option.value;
    }

    sessionStorage.setItem('settingsGridData', JSON.stringify({
      width: document.getElementById('grid-width').value,
      height: document.getElementById('grid-height').value,
      creatingMode: thisApp.checkedCreatingGridOption 
    }));
  },

  initFinder: function(){
    const thisApp = this;
    thisApp.settingsContainer = document.querySelector(select.containerOf.finderSettings);
    thisApp.creatingButtonContainer = document.querySelector(select.containerOf.createGridButton);
    thisApp.modeButtonContainer = document.querySelector(select.containerOf.modeButton);
    thisApp.container = document.getElementById('finder');

    document.addEventListener('DOMContentLoaded', () => {
      const gridWidthInput = document.getElementById('grid-width');
      const gridHeightInput = document.getElementById('grid-height');

      gridWidthInput.value = gridParams.defaultNoOfColumns;
      gridHeightInput.value = gridParams.defaultNoOfRows;
    
      const validationMinMax = (input) => {
        const min = parseInt(input.min, 10);
        const max = parseInt(input.max, 10);
        let value = parseInt(input.value, 10);
    
        if (isNaN(value) || value < min) {
          input.value = min;
        } 
        else if (value > max) {
          input.value = max;
        }
      };
    
      gridWidthInput.addEventListener('input', () => validationMinMax(gridWidthInput));
      gridHeightInput.addEventListener('input', () => validationMinMax(gridHeightInput));
    });
    
    thisApp.creatingButtonContainer.addEventListener('click', function(event){
      event.preventDefault();
      thisApp.saveGridSettingsInStorage();
      thisApp.settingsContainer.classList.add('hidden');
      thisApp.modeButtonContainer.classList.remove('hidden');
      new Grid();
    });
  },

  init: function(){
    const thisApp = this;

    thisApp.initPages();
    thisApp.initFinder();
  },
};

app.init();