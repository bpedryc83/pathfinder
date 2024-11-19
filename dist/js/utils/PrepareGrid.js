import { findPossibleWays, findShortestWay } from './FindingWays.js';
import { clearCellsStyles } from './OperationsOnCells.js';
import { classNames, attributeNames, textData, gridParams } from '../settings.js';

export function prepareGridDivs(thisGrid) {
  const modeTitleSpan = document.createElement('span');
  modeTitleSpan.classList.add('title-above-grid');
  modeTitleSpan.innerHTML = textData.titleMode1;
  thisGrid.dom.aboveGrid.append(modeTitleSpan);

  const gridSettings = JSON.parse(sessionStorage.getItem('settingsGridData'));
  const numberOfColumns = Number(gridSettings.width);
  const numberOfRows = Number(gridSettings.height);
  //const creatingMode = gridSettings.creatingMode;
  
  for (let y = gridParams.firstRow ; y <= numberOfRows ; y++) {
    const div = document.createElement('div');
    div.classList.add(classNames.gridRow);
    
    for(let x = gridParams.firstColumn ; x <= numberOfColumns ; x++) {
      const yDiv = document.createElement('div');
      div.append(yDiv);
      yDiv.classList.add(classNames.gridColumn);
      yDiv.setAttribute(attributeNames.cellCoordinate, x+'-'+y);
    }
    thisGrid.dom.grid.append(div);
  }

  const dynamicContentContainer = document.querySelector('.dynamic-content');
  const contentHeight = dynamicContentContainer.offsetHeight;
  let offsetY = contentHeight <= 520 ? '-50%' : `-260px`;

  dynamicContentContainer.style.transform = `translate(-50%, ${offsetY})`;

  thisGrid.dom.spanModeID.innerHTML = textData.buttonMode1;

  thisGrid.dom.modeButton.addEventListener('click', function(event){
    event.preventDefault();
    if (thisGrid.finderMode === 1) {
      if (thisGrid.markedCells.length > 1) {
        thisGrid.finderMode = 2;
        modeTitleSpan.innerHTML = textData.titleMode2;
        thisGrid.dom.spanModeID.innerHTML = textData.buttonMode2;

        for (let cell of thisGrid.possibleToMarkCells){
          const cellDom = document.querySelector('[' + attributeNames.cellCoordinate + '="' + cell + '"]');
          cellDom.classList.remove(classNames.possibleMove); 
        }
      }
      else {
        thisGrid.alertTwoCells();
      }
    }
    else if (thisGrid.finderMode === 2) {
      if (thisGrid.startCell != 0 && thisGrid.finishCell != 0){
        thisGrid.finderMode = 3;
        modeTitleSpan.innerHTML = textData.titleMode3;
        thisGrid.dom.spanModeID.innerHTML = textData.buttonMode3;

        const possibleWays = findPossibleWays(thisGrid.startCell, thisGrid.markedCells);
        const shortestWay = findShortestWay(possibleWays, thisGrid.finishCell, thisGrid);

        thisGrid.showSummary();

        console.log('possible ways: ', possibleWays);
        console.log('shortest way: ', shortestWay);
      }
      else {
        thisGrid.alertMarkStartFinish();
      }
    }
    else {
      thisGrid.finderMode = 1;
      modeTitleSpan.innerHTML = textData.titleMode1;
      thisGrid.dom.spanModeID.innerHTML = textData.buttonMode1;

      thisGrid.markedCells.length = 0;
      thisGrid.possibleToMarkCells.length = 0;

      thisGrid.startCell = 0;
      thisGrid.finishCell = 0;
      
      thisGrid.possibleRoutesSummary = 0;
      thisGrid.fullRouteSummary = 0;
      thisGrid.longestRouteSummary = 0;
      thisGrid.shortestRouteSummary = 0;

      thisGrid.correctWays.length = 1;
      thisGrid.correctWays[0].length = 0;

      clearCellsStyles();

      thisGrid.renderPossibleMove();
    }
  });

  thisGrid.pathFinder();
}