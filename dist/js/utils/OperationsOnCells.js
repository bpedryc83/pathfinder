import { coordinatesStrToInt } from './Parsing.js';
import { gridParams, classNames, attributeNames } from '../settings.js';

export function checkFourCellsAround(centralCell, arrayMarkedCells){

  const coordCentralCell = coordinatesStrToInt(centralCell);
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


export function findNextCellsToCheck(presentCell, previousCell, arrayMarkedCells){
    
  const newCellsSet = checkFourCellsAround(presentCell, arrayMarkedCells);
  for (let possibleCell of newCellsSet){
    if (possibleCell === previousCell){
      const alreadyRecordedCell = newCellsSet.indexOf(possibleCell);
      newCellsSet.splice(alreadyRecordedCell, 1);
    }
  }
  return newCellsSet;
}


export function renderPossibleMove(thisGrid){
  for (let cell of thisGrid.possibleToMarkCells){
    const cellDom = document.querySelector('[' + attributeNames.cellCoordinate + '="' + cell + '"]');
    cellDom.classList.remove(classNames.possibleMove); 
  }

  for (let markedCell of thisGrid.markedCells){
    const cellCoordinates = coordinatesStrToInt(markedCell);
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


export function clearCellsStyles(){
  for (let y = gridParams.firstRow ; y <= gridParams.lastRow ; y++) {
    for(let x = gridParams.firstColumn ; x <= gridParams.lastColumn ; x++) {
      const cell = y + '-' + x;
      const cellDom = document.querySelector('[' + attributeNames.cellCoordinate + '="' + cell + '"]');
      cellDom.classList.remove(classNames.possibleMove, classNames.markedCell, classNames.startCell, classNames.finishCell, classNames.shortestWay); 
    }
  }
  return null;
}