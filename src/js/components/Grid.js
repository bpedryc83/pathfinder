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

    for (let y = gridParams.firstRow ; y <= gridParams.lastRow ; y++) {
      const div = document.createElement('div');
      div.classList.add(classNames.gridRow);
      
      for(let x = gridParams.firstColumn ; x <= gridParams.lastColumn ; x++) {
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

      thisGrid.checkFourCellsAround(clickedCell);

      if (clickedCell == null) {
        cellIsAllowed = false;
        console.log('null');
      }
      else {
        const clickedCellToInt = thisGrid.coordinatesStrToInt(clickedCell);

        const rowOfClickedCell = clickedCellToInt.returnX;
        const columnOfClickedCell = clickedCellToInt.returnY;
        
        clickedCellDom = document.querySelector('[' + attributeNames.cellCoordinate + '="' + clickedCell + '"]');

        if (thisGrid.finderMode === 1){
          for (let cell of thisGrid.markedCells) {
            if (clickedCell === cell) {

              const indexOfCell = thisGrid.markedCells.indexOf(cell);
              let amountMarkedNextCells = 0;
              cellIsAllowed = false;

              if (thisGrid.markedCells.length > 1) {
                for (let markedCell of thisGrid.markedCells){

                  const markedCellToInt = thisGrid.coordinatesStrToInt(markedCell);
                  const rowOfMarkedCell = markedCellToInt.returnX;
                  const columnOfMarkedCell = markedCellToInt.returnY;
                  
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

              const cellToInt = thisGrid.coordinatesStrToInt(cell);
              const rowOfCell = cellToInt.returnX;
              const columnOfCell = cellToInt.returnY;

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
        else if (thisGrid.finderMode == 3){
          const possibleWays = [[]];
          possibleWays[0].push(thisGrid.firstCell);

          let currentWayNumber = 0;

          let cellsAround = thisGrid.checkFourCellsAround(thisGrid.firstCell);

          while (currentWayNumber < possibleWays.length){
            let notVerifiedCells = [];
            let currentWay = possibleWays[currentWayNumber];
            const copyOfCurrentWay = [...currentWay];
            let loopNumber = 0;

            for (let cellAround of cellsAround){
              loopNumber++;

              if (loopNumber == 1){
                notVerifiedCells = thisGrid.findWay(cellAround, currentWay[currentWay.length - 1]);
                currentWay.push(cellAround);
              }
              else {
                possibleWays.push(copyOfCurrentWay);
                possibleWays[possibleWays.length-1].push(cellAround);
              }              
            }
            if (notVerifiedCells.length == 0){
              if (currentWayNumber == possibleWays.length - 1){

                break;
              }
              else {
                currentWayNumber++;
                currentWay = possibleWays[currentWayNumber];
                notVerifiedCells = thisGrid.findWay(currentWay[currentWay.length - 1], currentWay[currentWay.length - 2]);
              }
            }
            cellsAround = notVerifiedCells;
          }
          console.log('Possible Ways: ', possibleWays);
        }
      }
    });
  }

  findWay(cell, previousCell){
    const thisGrid = this;
    
    console.log('cell, previousCell: ', cell, previousCell);

    const checkedCells = thisGrid.checkFourCellsAround(cell);
    for (let checkedCell of checkedCells){
      if (checkedCell == previousCell){
        const alreadyWritedCell = checkedCells.indexOf(checkedCell);
        checkedCells.splice(alreadyWritedCell, 1);
      }
    }
    return checkedCells;
  }

  checkFourCellsAround(centralCell){
    const thisGrid = this;

    const coordCentralCell = thisGrid.coordinatesStrToInt(centralCell);
    const centralCellX = coordCentralCell.returnX;
    const centralCellY = coordCentralCell.returnY;
    const markedCellsAround = [];

    let topCellCoord = String(centralCellX) + '-' + String(centralCellY - 1);
    let rightCellCoord = String(centralCellX + 1) + '-' + String(centralCellY);
    let bottomCellCoord = String(centralCellX) + '-' + String(centralCellY + 1);
    let leftCellCoord = String(centralCellX - 1) + '-' + String(centralCellY);

    for (let markedCell of thisGrid.markedCells){
      if (topCellCoord === markedCell){
        markedCellsAround.push(topCellCoord);
      }
      else if (rightCellCoord === markedCell){
        markedCellsAround.push(rightCellCoord);
      }
      else if (bottomCellCoord === markedCell){
        markedCellsAround.push(bottomCellCoord);
      }
      else if (leftCellCoord === markedCell){
        markedCellsAround.push(leftCellCoord);
      }
    }

    return markedCellsAround;
  }

  coordinatesStrToInt(coordinates){
    
    let coordinateX = '';
    let coordinateY = '';
    let afterSeparator = false;

    for (let i = 0 ; i < coordinates.length ; i++){
      if (afterSeparator === false){
        if (coordinates.charAt(i) == '-'){
          afterSeparator = true;
        }
        else {
          coordinateX += coordinates.charAt(i);
        }
      }
      else {
        coordinateY += coordinates.charAt(i);
      }
    }

    return {returnX: parseInt(coordinateX), returnY: parseInt(coordinateY)};
  }
}

export default Grid;