//import {select} from './settings.js';
import Grid from './components/Grid.js';

export const app = {
  /*initPages: function(){
    const thisApp = this;
  },*/

  /*activatePage: function(pageId){
  
  },*/
  initGrid: function(){
    //const thisApp = this;

    new Grid();
  },
  init: function(){
    const thisApp = this;

    //thisApp.initPages();
    thisApp.initGrid();
  },
};

app.init();