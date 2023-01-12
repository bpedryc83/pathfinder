import {classNames, select, attributeNames, gridParams, textData} from '../settings.js';

class Grid {
  constructor(){
    const thisGrid = this;
    thisGrid.finderMode = 1; //Modes: 1 - click cell to define it as marked/unmarked ; 2 - indicate start/finish cell; 3 - find the shortest way  
    thisGrid.startCell = 0;
    thisGrid.finishCell = 0;

    thisGrid.markedCells = [];
    thisGrid.correctWays = [[]];
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
      let cellPossibleToMark;

      thisGrid.checkFourCellsAround(clickedCell);

      if (clickedCell == null) {
        cellPossibleToMark = false;
        console.log('null');
      }
      else {
        const clickedCellInteger = thisGrid.coordinatesStrToInt(clickedCell);

        const clickedCellRow = clickedCellInteger.returnX;
        const clickedCellColumn = clickedCellInteger.returnY;
        
        clickedCellDom = document.querySelector('[' + attributeNames.cellCoordinate + '="' + clickedCell + '"]');

        if (thisGrid.finderMode === 1){
          for (let cell of thisGrid.markedCells) {

            // check if unmark of clicked cell is possible

            if (clickedCell === cell) {

              const indexOfCell = thisGrid.markedCells.indexOf(cell);
              let amountMarkedNeighbours = 0;
              cellPossibleToMark = false;

              if (thisGrid.markedCells.length > 1) {
                for (let markedCell of thisGrid.markedCells){

                  const markedCellInteger = thisGrid.coordinatesStrToInt(markedCell);
                  const rowOfMarkedCell = markedCellInteger.returnX;
                  const columnOfMarkedCell = markedCellInteger.returnY;
                  
                  if ((clickedCellRow == rowOfMarkedCell - 1) && (clickedCellColumn == columnOfMarkedCell)) {
                    amountMarkedNeighbours++;
                  }
                  if ((clickedCellRow == rowOfMarkedCell + 1) && (clickedCellColumn == columnOfMarkedCell)) {
                    amountMarkedNeighbours++;
                  }
                  if ((clickedCellColumn == columnOfMarkedCell - 1) && (clickedCellRow == rowOfMarkedCell)) {
                    amountMarkedNeighbours++;
                  }
                  if ((clickedCellColumn == columnOfMarkedCell + 1) && (clickedCellRow == rowOfMarkedCell)) {
                    amountMarkedNeighbours++;
                  }
                }
              }
              //console.log('amount: ', amountMarkedNeighbours);
              if (amountMarkedNeighbours === 1 || thisGrid.markedCells.length === 1 ) {
                thisGrid.markedCells.splice(indexOfCell, 1);
                clickedCellDom.classList.remove(classNames.markedCell);
                break;
              }
            }
          }

          // check if clicked cell is a direct neighbour of the marked cell

          if (cellPossibleToMark !== false){
            for (let markedCell of thisGrid.markedCells) {

              const markedCellInt = thisGrid.coordinatesStrToInt(markedCell);
              const markedCellRow = markedCellInt.returnX;
              const markedCellColumn = markedCellInt.returnY;

              if (((markedCellRow == clickedCellRow - 1) && (markedCellColumn == clickedCellColumn)) ||
              ((markedCellRow == clickedCellRow + 1) && (markedCellColumn == clickedCellColumn)) ||
              ((markedCellColumn == clickedCellColumn - 1) && (markedCellRow == clickedCellRow)) ||
              ((markedCellColumn == clickedCellColumn + 1) && (markedCellRow == clickedCellRow))) {
                cellPossibleToMark = true;
              }
            }
          }
          if (cellPossibleToMark === true || thisGrid.markedCells.length === 0) {
            thisGrid.markedCells.push(clickedCell);
            clickedCellDom.classList.add(classNames.markedCell);
          }
          console.log('Array markedCells: ', thisGrid.markedCells);
        }
        else if (thisGrid.finderMode == 2){
          if (thisGrid.startCell == 0){
            thisGrid.startCell = clickedCell;
            clickedCellDom.classList.replace(classNames.markedCell, classNames.startCell);
          }
          else if (thisGrid.startCell != 0 && thisGrid.startCell != clickedCell){
            thisGrid.finishCell = clickedCell;
            clickedCellDom.classList.replace(classNames.markedCell, classNames.finishCell);
          }
        }
        else if (thisGrid.finderMode == 3){
          const possibleWays = [[]];
          possibleWays[0].push(thisGrid.startCell);

          let currentWayNumber = 0;
          let cellsSetToCheck = thisGrid.checkFourCellsAround(thisGrid.startCell);

          while (currentWayNumber < possibleWays.length){
            let nextCellsSetToCheck = [];
            let currentWay = possibleWays[currentWayNumber];
            
            const copyOfCurrentWay = [...currentWay];
            let cellExistsInCurrentWay;
            let cellAddedThisLoop = false;

            for (let cellFromSet of cellsSetToCheck){
              cellExistsInCurrentWay = false;

              for (let cellFromCurrentWay of possibleWays[currentWayNumber]){
                if (cellFromSet == cellFromCurrentWay){
                  cellExistsInCurrentWay = true;
                  break;
                }
              }
              
              if (cellExistsInCurrentWay === false){
                if (cellAddedThisLoop === false){                
                  nextCellsSetToCheck = thisGrid.findNextCellsToCheck(cellFromSet, currentWay[currentWay.length - 1]);
                  currentWay.push(cellFromSet);
                  cellAddedThisLoop = true;
                }
                else {
                  possibleWays.push([...copyOfCurrentWay]);
                  possibleWays[possibleWays.length-1].push(cellFromSet);
                }
              }
            }
            if (nextCellsSetToCheck.length == 0){
              if (currentWayNumber == possibleWays.length - 1){
                break;
              }
              else {
                currentWayNumber++;
                currentWay = possibleWays[currentWayNumber];
                nextCellsSetToCheck = thisGrid.findNextCellsToCheck(currentWay[currentWay.length - 1], currentWay[currentWay.length - 2]);
              }
            }
            cellsSetToCheck = nextCellsSetToCheck;
          }
          console.log('Possible Ways: ', possibleWays);
        }
      }
    });
  }

  findNextCellsToCheck(presentCell, previousCell){
    const thisGrid = this;
    
    const newCellsSet = thisGrid.checkFourCellsAround(presentCell);
    for (let possibleCell of newCellsSet){
      if (possibleCell == previousCell){
        const alreadyRecordedCell = newCellsSet.indexOf(possibleCell);
        newCellsSet.splice(alreadyRecordedCell, 1);
      }
    }
    return newCellsSet;
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
    let checkSeparator = false;

    for (let i = 0 ; i < coordinates.length ; i++){
      if (checkSeparator === false){
        if (coordinates.charAt(i) == '-'){
          checkSeparator = true;
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