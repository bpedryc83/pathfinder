import { checkFourCellsAround, findNextCellsToCheck } from './OperationsOnCells.js';
import { attributeNames, classNames } from '../settings.js';

export function findPossibleWays(startCell, arrayMarkedCells){

  const possibleWays = [[]];
  possibleWays[0].push(startCell);

  let currentWayNumber = 0;
  let cellsSetToCheck = checkFourCellsAround(startCell, arrayMarkedCells);

  while (currentWayNumber < possibleWays.length){
    let nextCellsSetToCheck = [];
    let currentWay = possibleWays[currentWayNumber];
    
    const copyOfCurrentWay = [...currentWay];
    let cellExistsInCurrentWay;
    let cellAddedThisLoop = false;

    for (let cellFromSet of cellsSetToCheck){
      cellExistsInCurrentWay = false;

      for (let cellFromCurrentWay of possibleWays[currentWayNumber]){
        if (cellFromSet === cellFromCurrentWay){
          cellExistsInCurrentWay = true;
          break;
        }
      }
      
      if (cellExistsInCurrentWay === false){
        if (cellAddedThisLoop === false){                
          nextCellsSetToCheck = findNextCellsToCheck(cellFromSet, currentWay[currentWay.length - 1], arrayMarkedCells);
          currentWay.push(cellFromSet);
          cellAddedThisLoop = true;
        }
        else {
          possibleWays.push([...copyOfCurrentWay]);
          possibleWays[possibleWays.length-1].push(cellFromSet);
        }
      }
    }
    if (nextCellsSetToCheck.length === 0){
      if (currentWayNumber === possibleWays.length - 1){
        break;
      }
      else {
        currentWayNumber++;
        currentWay = possibleWays[currentWayNumber];
        nextCellsSetToCheck = findNextCellsToCheck(currentWay[currentWay.length - 1], currentWay[currentWay.length - 2], arrayMarkedCells);
      }
    }
    cellsSetToCheck = nextCellsSetToCheck;
  }

  return possibleWays;
}



export function findShortestWay(ways, end, thisGrid){

  const connectingWays = [];
  let shortestWay = [];
  let longestWay = [];

  for (let way of ways){
    for (let cellInWay of way){
      if (cellInWay === end){
        const startEndWay = [...way];

        const lengthForSplice = startEndWay.length - startEndWay.indexOf(cellInWay) - 1;
        startEndWay.splice(startEndWay.indexOf(cellInWay) + 1, lengthForSplice);
        
        let pushPossible = true;
        let startEndWayJoin = startEndWay.join();

        for (let connectingWay of connectingWays){
          if (startEndWayJoin === connectingWay.join()){
            pushPossible = false;
          }
        }
        if (pushPossible){
          connectingWays.push(startEndWay);
        }
      }
    }
  }

  for (let connectingWay of connectingWays){
    if (shortestWay.length === 0 || (shortestWay.length > 0 && connectingWay.length < shortestWay.length)){
      shortestWay = connectingWay;
    }
    if (longestWay.length === 0 || (longestWay.length > 0 && connectingWay.length > longestWay.length)){
      longestWay = connectingWay;
    }
    thisGrid.fullRouteSummary += connectingWay.length;
  }

  for (let cell of shortestWay){
    const cellDom = document.querySelector('[' + attributeNames.cellCoordinate + '="' + cell + '"]');
    cellDom.classList.add(classNames.shortestWay);
  }

  thisGrid.possibleRoutesSummary = connectingWays.length;
  thisGrid.longestRouteSummary = longestWay.length;
  thisGrid.shortestRouteSummary = shortestWay.length;

  return shortestWay;
}