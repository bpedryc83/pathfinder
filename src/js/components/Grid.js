import {classNames, select, attributeNames, gridParams, textData} from '../settings.js';

class Grid {
  constructor(){
    const thisGrid = this;
    thisGrid.finderMode = 1; //Modes: 1 - click cell to define it as marked/unmarked ; 2 - indicate start/finish cell; 3 - display the shortest way  
    thisGrid.startCell = 0;
    thisGrid.endCell = 0;

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
    thisGrid.dom.aboveGrid = document.querySelector(select.containerOf.aboveGridArea);
    thisGrid.dom.belowGrid = document.querySelector(select.containerOf.belowGridArea);
    thisGrid.dom.searchPathButton = document.querySelector(select.containerOf.searchPathButton);
    thisGrid.dom.spanModeID = document.getElementById(attributeNames.modeNumber);
  }

  prepareGridDivs() {
    const thisGrid = this;

    thisGrid.dom.aboveGrid.innerHTML = textData.titleMode1;

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

    thisGrid.dom.spanModeID.innerHTML = textData.buttonMode1;

    thisGrid.dom.searchPathButton.addEventListener('click', function(event){
      event.preventDefault();
      if (thisGrid.finderMode === 1 && thisGrid.markedCells.length > 1) {
        thisGrid.finderMode = 2;
        thisGrid.dom.aboveGrid.innerHTML = textData.titleMode2;
        thisGrid.dom.spanModeID.innerHTML = textData.buttonMode2;

        for (let cell of thisGrid.possibleToMarkCells){
          const cellDom = document.querySelector('[' + attributeNames.cellCoordinate + '="' + cell + '"]');
          cellDom.classList.remove(classNames.possibleMove); 
        }
      }
      else if (thisGrid.finderMode === 2) {
        if (thisGrid.startCell != 0 && thisGrid.endCell != 0){
          thisGrid.finderMode = 3;
          thisGrid.dom.aboveGrid.innerHTML = textData.titleMode3;
          thisGrid.dom.spanModeID.innerHTML = textData.buttonMode3;

          const possibleWays = thisGrid.findPossibleWays(thisGrid.startCell, thisGrid.markedCells);
          const shortestWay = thisGrid.findShortestWay(possibleWays, thisGrid.endCell);

          console.log('possible ways: ', possibleWays);
          console.log('shortest way: ', shortestWay);
        }
        else {
          alert('Specify the route end cell');
        }
      }
      else {
        location.reload();

        /*thisGrid.finderMode = 1;
        thisGrid.dom.spanModeID.innerHTML = textData.modeNumber1;
        thisGrid.renderPossibleMove();*/
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

      if (clickedCell == null) {
        cellPossibleToMark = false;
        console.log('null');
      }
      else {
        const clickedCellInteger = thisGrid.coordinatesStrToInt(clickedCell);

        const clickedCellRow = clickedCellInteger.returnX;
        const clickedCellColumn = clickedCellInteger.returnY;
        
        clickedCellDom = document.querySelector('[' + attributeNames.cellCoordinate + '="' + clickedCell + '"]');

        
        // MODE 1
        
        if (thisGrid.finderMode === 1){


          for (let cell of thisGrid.markedCells) {

            // check if unmark of clicked cell is possible

            if (clickedCell === cell) {
              cellPossibleToMark = false;
              const markedNeighbours = thisGrid.checkFourCellsAround(clickedCell, thisGrid.markedCells);
              const amountMarkedNeighbours = markedNeighbours.length;
              const indexOfCell = thisGrid.markedCells.indexOf(cell);

              if (amountMarkedNeighbours === 1 || thisGrid.markedCells.length === 1 ) {
                thisGrid.markedCells.splice(indexOfCell, 1);
                clickedCellDom.classList.remove(classNames.markedCell);
                thisGrid.renderPossibleMove(); 
                break;
              }

              else if (amountMarkedNeighbours > 1){
                const copyMarkedCells = [...thisGrid.markedCells];
                const indexOfCellForCopy = copyMarkedCells.indexOf(cell);
                copyMarkedCells.splice(indexOfCellForCopy, 1);

                const waysFromFirstNeighbour = thisGrid.findPossibleWays(markedNeighbours[0], copyMarkedCells);
                let foundNeighboursAmount = 0;

                for (let markedNeighbour of markedNeighbours){
                  for (let array of waysFromFirstNeighbour){
                    if (array.includes(markedNeighbour)){
                      foundNeighboursAmount++;
                      break;
                    }
                  }
                }
                if (foundNeighboursAmount == amountMarkedNeighbours){
                  thisGrid.markedCells.splice(indexOfCell, 1);
                  clickedCellDom.classList.remove(classNames.markedCell);
                  thisGrid.renderPossibleMove();                  
                }
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
          if (cellPossibleToMark === true || (thisGrid.markedCells.length === 0 && cellPossibleToMark != false)) {
            thisGrid.markedCells.push(clickedCell);
            clickedCellDom.classList.add(classNames.markedCell);
            thisGrid.renderPossibleMove();
          }
          console.log('Array markedCells: ', thisGrid.markedCells);
        }
        
        // MODE 2
        
        else if (thisGrid.finderMode == 2){

          if (thisGrid.startCell == 0){
            thisGrid.startCell = clickedCell;
            clickedCellDom.classList.replace(classNames.markedCell, classNames.startCell);
          }
          else if (thisGrid.startCell != 0 && thisGrid.startCell != clickedCell){
            thisGrid.endCell = clickedCell;
            clickedCellDom.classList.replace(classNames.markedCell, classNames.endCell);
          }
        }
      }
    });
  }

  renderPossibleMove(){
    const thisGrid = this;

    for (let cell of thisGrid.possibleToMarkCells){
      const cellDom = document.querySelector('[' + attributeNames.cellCoordinate + '="' + cell + '"]');
      cellDom.classList.remove(classNames.possibleMove); 
    }

    for (let markedCell of thisGrid.markedCells){
      const cellCoordinates = thisGrid.coordinatesStrToInt(markedCell);
      const centralCellX = cellCoordinates.returnX;
      const centralCellY = cellCoordinates.returnY;

      const cellsAroundMarkedCell = [];
  
      if (centralCellY > gridParams.firstRow && centralCellY < gridParams.lastRow){
        cellsAroundMarkedCell.push(String(centralCellX) + '-' + String(centralCellY - 1));
        cellsAroundMarkedCell.push(String(centralCellX) + '-' + String(centralCellY + 1));
      }
      if (centralCellX > gridParams.firstColumn && centralCellX < gridParams.lastColumn){
        cellsAroundMarkedCell.push(String(centralCellX + 1) + '-' + String(centralCellY));
        cellsAroundMarkedCell.push(String(centralCellX - 1) + '-' + String(centralCellY));
      }
      for (let cellAround of cellsAroundMarkedCell){
        if (!thisGrid.markedCells.includes(cellAround)){
          const cellDom = document.querySelector('[' + attributeNames.cellCoordinate + '="' + cellAround + '"]');
          cellDom.classList.add(classNames.possibleMove);
          thisGrid.possibleToMarkCells.push(cellAround);
        }
      }
    }
  }

  findShortestWay(ways, end){

    const connectingWays = [[]];
    let shortestWay = [];

    for (let way of ways){
      for (let cellInWay of way){
        if (cellInWay == end){
          const shortWay = [...way];

          const lengthForSplice = shortWay.length - shortWay.indexOf(cellInWay) - 1;

          shortWay.splice(shortWay.indexOf(cellInWay) + 1, lengthForSplice);
          connectingWays.push(shortWay);
        }
      }
    }

    for (let connectingWay of connectingWays){
      if (shortestWay.length == 0 || (shortestWay.length > 0 && connectingWay.length < shortestWay.length)){
        shortestWay = connectingWay;
      }
    }

    for (let cell of shortestWay){
      const cellDom = document.querySelector('[' + attributeNames.cellCoordinate + '="' + cell + '"]');
      cellDom.classList.add(classNames.shortestWay);
    }

    return shortestWay;
  }

  findPossibleWays(startCell, arrayMarkedCells){
    const thisGrid = this;

    const possibleWays = [[]];
    possibleWays[0].push(startCell);

    let currentWayNumber = 0;
    let cellsSetToCheck = thisGrid.checkFourCellsAround(startCell, arrayMarkedCells);

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
            nextCellsSetToCheck = thisGrid.findNextCellsToCheck(cellFromSet, currentWay[currentWay.length - 1], arrayMarkedCells);
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
          nextCellsSetToCheck = thisGrid.findNextCellsToCheck(currentWay[currentWay.length - 1], currentWay[currentWay.length - 2], arrayMarkedCells);
        }
      }
      cellsSetToCheck = nextCellsSetToCheck;
    }
 
    return possibleWays;
  }

  findNextCellsToCheck(presentCell, previousCell, arrayMarkedCells){
    const thisGrid = this;
    
    const newCellsSet = thisGrid.checkFourCellsAround(presentCell, arrayMarkedCells);
    for (let possibleCell of newCellsSet){
      if (possibleCell == previousCell){
        const alreadyRecordedCell = newCellsSet.indexOf(possibleCell);
        newCellsSet.splice(alreadyRecordedCell, 1);
      }
    }
    return newCellsSet;
  }

  checkFourCellsAround(centralCell, arrayMarkedCells){
    const thisGrid = this;

    const coordCentralCell = thisGrid.coordinatesStrToInt(centralCell);
    const centralCellX = coordCentralCell.returnX;
    const centralCellY = coordCentralCell.returnY;
    const markedCellsAround = [];

    let topCellCoord = String(centralCellX) + '-' + String(centralCellY - 1);
    let rightCellCoord = String(centralCellX + 1) + '-' + String(centralCellY);
    let bottomCellCoord = String(centralCellX) + '-' + String(centralCellY + 1);
    let leftCellCoord = String(centralCellX - 1) + '-' + String(centralCellY);

    for (let markedCell of arrayMarkedCells){
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