import {select, classNames} from './settings.js';
import Grid from './components/Grid.js';

export const app = {
  
  initPages: function(){
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    const allNavLinks = (select.nav.links);
    thisApp.navLinks = document.querySelectorAll(allNavLinks);
    
    const idFromHash = window.location.hash.replace('#/', '');
    let pageMatchingHash = thisApp.pages[0].id;

    for (let page of thisApp.pages){
      if (page.id == idFromHash){
        pageMatchingHash = page.id;
        break;
      }
    }
    thisApp.activatePage(pageMatchingHash);

    for (let link of thisApp.navLinks){
      link.addEventListener('click', function(event){
        const clickedElement = this;
        event.preventDefault();

        const id = clickedElement.getAttribute('href').replace('#', '');
        thisApp.activatePage(id);

        window.location.hash = '#/' + id;
      });
    }
  },

  activatePage: function(pageId){
    const thisApp = this;

    for (let page of thisApp.pages){
      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }
  },
  
  initGrid: function(){
    //const thisApp = this;

    new Grid();
  },
  init: function(){
    const thisApp = this;

    thisApp.initPages();
    thisApp.initGrid();
  },
};

app.init();