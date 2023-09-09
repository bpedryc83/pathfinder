import {select, classNames} from './settings.js';
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

  initGrid: function(){
    new Grid();
  },
  init: function(){
    const thisApp = this;

    thisApp.initPages();
    thisApp.initGrid();
  },
};

app.init();