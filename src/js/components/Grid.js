import {classNames, select, attributeNames, gridParams, textData} from '../settings.js';

class Grid {
  constructor(){
    const thisGrid = this;
    thisGrid.finderMode = 1; //1 - click cell to define it as marked ; 2 - indicate start/end cell; 3 - find the shortest way  
    thisGrid.firstCell = 0;
    thisGrid.lastCell = 0;

    thisGrid.markedCells = [];
    thisGrid.getElements();
    thisGrid.prepareGridDivs();
  }

  getElements() {
    const thisGrid = this;

    thisGrid.dom = {};
    thisGrid.dom.grid = document.querySelector(select.containerOf.gridArea);
    thisGrid.dom.searchPathButton = document.querySelector(select.containerOf.searchPathButton);
    thisGrid.dom.spanModeID = document.getElementById(attributeNames.modeNumber);
  }

  prepareGridDivs() {
    const thisGrid = this;

    for (let x = gridParams.firstRow ; x <= gridParams.lastRow ; x++) {
      const div = document.createElement('div');
      div.classList.add(classNames.gridRow);
      
      for(let y = gridParams.firstColumn ; y <= gridParams.lastColumn ; y++) {
        const yDiv = document.createElement('div');
        div.append(yDiv);
        yDiv.classList.add(classNames.gridColumn);
        yDiv.setAttribute(attributeNames.cellCoordinate, x+'-'+y);
      }
      thisGrid.dom.grid.append(div);
    }

    //button Start New Search
    thisGrid.dom.spanModeID.innerHTML = textData.modeNumber1;

    thisGrid.dom.searchPathButton.addEventListener('click', function(event){
      event.preventDefault();
      if (thisGrid.finderMode === 1 && thisGrid.markedCells.length > 3) {
        thisGrid.finderMode = 2;
        thisGrid.dom.spanModeID.innerHTML = textData.modeNumber2;
      }
      else if (thisGrid.finderMode === 2) {
        thisGrid.finderMode = 3;
        thisGrid.dom.spanModeID.innerHTML = textData.modeNumber3;

      }
      else {
        thisGrid.finderMode = 1;
        thisGrid.dom.spanModeID.innerHTML = textData.modeNumber1;
      }
    });

    thisGrid.pathFinder();
  }

  pathFinder() {
    const thisGrid = this;
    
    thisGrid.dom.grid.addEventListener('click', function(event){
      event.preventDefault();
      const clickedCell = event.target.getAttribute(attributeNames.cellCoordinate);

      let clickedCellDom;
      let cellIsAllowed;

      console.log(thisGrid.markedCells.length);

      if (clickedCell == null) {
        cellIsAllowed = false;
        console.log('null');
      }
      else {
        const rowOfClickedCell = parseInt(clickedCell.charAt(0));
        const columnOfClickedCell = parseInt(clickedCell.charAt(2));
        
        clickedCellDom = document.querySelector('[' + attributeNames.cellCoordinate + '="' + clickedCell + '"]');

        if (thisGrid.finderMode === 1){
          for (let cell of thisGrid.markedCells) {
            if (clickedCell === cell) {
              //const rowOfCell = parseInt(cell.charAt(0));
              //const columnOfCell = parseInt(cell.charAt(2));
              const indexOfCell = thisGrid.markedCells.indexOf(cell);
              let amountMarkedNextCells = 0;
              cellIsAllowed = false;

              if (thisGrid.markedCells.length > 1) {
                for (let markedCell of thisGrid.markedCells){
                  const rowOfMarkedCell = parseInt(markedCell.charAt(0));
                  const columnOfMarkedCell = parseInt(markedCell.charAt(2));
                  console.log('rOC, rOMC:', rowOfClickedCell, rowOfMarkedCell, columnOfClickedCell, columnOfMarkedCell);
                  if ((rowOfClickedCell == rowOfMarkedCell - 1) && (columnOfClickedCell == columnOfMarkedCell)) {
                    amountMarkedNextCells++;
                  }
                  if ((rowOfClickedCell == rowOfMarkedCell + 1) && (columnOfClickedCell == columnOfMarkedCell)) {
                    amountMarkedNextCells++;
                  }
                  if ((columnOfClickedCell == columnOfMarkedCell - 1) && (rowOfClickedCell == rowOfMarkedCell)) {
                    amountMarkedNextCells++;
                  }
                  if ((columnOfClickedCell == columnOfMarkedCell + 1) && (rowOfClickedCell == rowOfMarkedCell)) {
                    amountMarkedNextCells++;
                  }
                }
              }
              console.log('amount: ', amountMarkedNextCells);
              if (amountMarkedNextCells === 1 || thisGrid.markedCells.length === 1 ) {
                thisGrid.markedCells.splice(indexOfCell, 1);
                clickedCellDom.classList.remove(classNames.markedCell);
                break;
              }
            }
          }
          if (cellIsAllowed !== false){
            for (let cell of thisGrid.markedCells) {

              const rowOfCell = parseInt(cell.charAt(0));
              const columnOfCell = parseInt(cell.charAt(2));

              if (((rowOfCell == rowOfClickedCell - 1) && (columnOfCell == columnOfClickedCell)) ||
              ((rowOfCell == rowOfClickedCell + 1) && (columnOfCell == columnOfClickedCell)) ||
              ((columnOfCell == columnOfClickedCell - 1) && (rowOfCell == rowOfClickedCell)) ||
              ((columnOfCell == columnOfClickedCell + 1) && (rowOfCell == rowOfClickedCell))) {
                cellIsAllowed = true;
              }
            }
          }
          if (cellIsAllowed === true || thisGrid.markedCells.length === 0) {
            thisGrid.markedCells.push(clickedCell);
            clickedCellDom.classList.add(classNames.markedCell);
          }
          console.log('Array markedCells: ', thisGrid.markedCells);
        }
        else if (thisGrid.finderMode == 2){
          if (thisGrid.firstCell == 0){
            thisGrid.firstCell = clickedCell;
            clickedCellDom.classList.replace(classNames.markedCell, classNames.firstCell);
          }
          else if (thisGrid.firstCell != 0 && thisGrid.startCell != clickedCell){
            thisGrid.lastCell = clickedCell;
            clickedCellDom.classList.replace(classNames.markedCell, classNames.lastCell);
          }
        }
        /*else if (thisGrid.finderMode == 3){

        }*/
      }
    });
  }
}

export default Grid;