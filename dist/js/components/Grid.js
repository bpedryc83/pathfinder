import { prepareGridDivs } from '../utils/PrepareGrid.js';
import { pathFinder } from '../utils/PathFinder.js';
import { renderPossibleMove } from '../utils/OperationsOnCells.js';
import { alertTwoCells, alertMarkStartFinish, showSummary } from '../utils/Popups.js';
import { select, attributeNames } from '../settings.js';

class Grid {
  constructor(){
    const thisGrid = this;
    thisGrid.finderMode = 1; //Modes: 1 - click cell to define it as marked/unmarked ; 2 - indicate start/finish cell; 3 - display the shortest way  
    thisGrid.startCell = 0;
    thisGrid.finishCell = 0;
    
    thisGrid.possibleRoutesSummary = 0;
    thisGrid.fullRouteSummary = 0;
    thisGrid.longestRouteSummary = 0;
    thisGrid.shortestRouteSummary = 0;

    thisGrid.markedCells = [];
    thisGrid.possibleToMarkCells = [];
    thisGrid.correctWays = [[]];
    thisGrid.getElements();
    thisGrid.prepareGridDivs();
  }

  getElements() {
    const thisGrid = this;

    thisGrid.dom = {};
    thisGrid.dom.grid = document.querySelector(select.containerOf.gridArea);
    
    thisGrid.dom.containerWithOpacity = document.querySelector(select.id.containerWithOpacity);
    thisGrid.dom.popUpSummary = document.querySelector(select.id.popUpSummary);
    thisGrid.dom.closePopUpSummary = document.querySelector(select.id.closePopUpSummary);
    thisGrid.dom.popUpTwoCells = document.querySelector(select.id.popUpTwoCells);
    thisGrid.dom.closePopUpTwoCells = document.querySelector(select.id.closePopUpTwoCells);
    thisGrid.dom.popUpMarkStartFinish = document.querySelector(select.id.popUpMarkStartFinish);
    thisGrid.dom.closePopUpMarkStartFinish = document.querySelector(select.id.closePopUpMarkStartFinish);

    thisGrid.dom.aboveGrid = document.querySelector(select.containerOf.aboveGridArea);
    thisGrid.dom.belowGrid = document.querySelector(select.containerOf.belowGridArea);
    thisGrid.dom.searchPathButton = document.querySelector(select.containerOf.searchPathButton);
    thisGrid.dom.spanModeID = document.getElementById(attributeNames.modeNumber);
  }

  prepareGridDivs() {
    prepareGridDivs(this);
  }

  pathFinder() {
    pathFinder(this);
  }
  
  renderPossibleMove() {
    renderPossibleMove(this);
  }

  // functions defined in Popups.js

  alertTwoCells() {
    alertTwoCells(this);
  }

  alertMarkStartFinish() {
    alertMarkStartFinish(this);
  }

  showSummary() {
    showSummary(this);
  }
}

export default Grid;