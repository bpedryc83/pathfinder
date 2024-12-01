import { coordinatesStrToInt } from './Parsing.js';
import { checkFourCellsAround } from './OperationsOnCells.js';
import { findPossibleWays } from './FindingWays.js';
import { attributeNames, classNames, select } from '../settings.js';

export function pathFinder(thisGrid) {
  

  if (thisGrid.creatingGridMode === 'optionRandom'){
    thisGrid.generateRandomRoutes();
  }

  thisGrid.dom.grid.addEventListener('click', function(event){
    event.preventDefault();
    const clickedCell = event.target.getAttribute(attributeNames.cellCoordinate);

    let clickedCellDom;
    let cellPossibleToMark;

    if (clickedCell === null) {
      cellPossibleToMark = false;
    }
    else {
      const clickedCellInteger = coordinatesStrToInt(clickedCell);

      const clickedCellRow = clickedCellInteger.returnX;
      const clickedCellColumn = clickedCellInteger.returnY;
      
      clickedCellDom = document.querySelector('[' + attributeNames.cellCoordinate + '="' + clickedCell + '"]');
      
      // MODE 1
      
      if (thisGrid.finderMode === 1){


        for (let cell of thisGrid.markedCells) {

          // check if unmark of clicked cell is possible

          if (clickedCell === cell) {
            cellPossibleToMark = false;
            const markedNeighbours = checkFourCellsAround(clickedCell, thisGrid.markedCells);
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

              const waysFromFirstNeighbour = findPossibleWays(markedNeighbours[0], copyMarkedCells);
              let foundNeighboursAmount = 0;

              for (let markedNeighbour of markedNeighbours){
                for (let array of waysFromFirstNeighbour){
                  if (array.includes(markedNeighbour)){
                    foundNeighboursAmount++;
                    break;
                  }
                }
              }
              if (foundNeighboursAmount === amountMarkedNeighbours){
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

            const markedCellInt = coordinatesStrToInt(markedCell);
            const markedCellRow = markedCellInt.returnX;
            const markedCellColumn = markedCellInt.returnY;

            if (((markedCellRow === clickedCellRow - 1) && (markedCellColumn === clickedCellColumn)) ||
            ((markedCellRow === clickedCellRow + 1) && (markedCellColumn === clickedCellColumn)) ||
            ((markedCellColumn === clickedCellColumn - 1) && (markedCellRow === clickedCellRow)) ||
            ((markedCellColumn === clickedCellColumn + 1) && (markedCellRow === clickedCellRow))) {
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
      
      else if (thisGrid.finderMode === 2){

        if (thisGrid.startCell === 0 && clickedCellDom.classList.contains(classNames.markedCell)){
          thisGrid.startCell = clickedCell;
          clickedCellDom.classList.replace(classNames.markedCell, classNames.startCell);

        }
        else if (thisGrid.startCell != 0 && thisGrid.startCell != clickedCell && thisGrid.finishCell === 0 && clickedCellDom.classList.contains(classNames.markedCell)){
          thisGrid.finishCell = clickedCell;
          clickedCellDom.classList.replace(classNames.markedCell, classNames.finishCell);          
        }
        else if (thisGrid.startCell != 0 &&
          thisGrid.finishCell != 0 &&
          thisGrid.startCell != clickedCell &&
          thisGrid.finishCell != clickedCell &&
          clickedCellDom.classList.contains(classNames.markedCell)){
          const startCellDom = document.querySelector(select.containerOf.startCell);
          startCellDom.classList.replace(classNames.startCell, classNames.markedCell);

          thisGrid.startCell = clickedCell;

          const finishCellDom = document.querySelector(select.containerOf.finishCell);
          finishCellDom.classList.replace(classNames.finishCell, classNames.markedCell);
          thisGrid.finishCell = 0;
          clickedCellDom.classList.replace(classNames.markedCell, classNames.startCell);
        }
      }
    }
  });
}