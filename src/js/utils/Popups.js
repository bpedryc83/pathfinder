import { classNames, select } from '../settings.js';


export function alertTwoCells(thisGrid){
  thisGrid.dom.containerWithOpacity.classList.replace(classNames.layerOpacityNo, classNames.layerOpacityYes);
  thisGrid.dom.popUpTwoCells.classList.replace(classNames.popUpNotVisible, classNames.popUpVisible);
  
  thisGrid.dom.closePopUpTwoCells.addEventListener('click',function(event){
    event.preventDefault();

    thisGrid.dom.containerWithOpacity.classList.replace(classNames.layerOpacityYes, classNames.layerOpacityNo);
    thisGrid.dom.popUpTwoCells.classList.replace(classNames.popUpVisible, classNames.popUpNotVisible);  
  });
}


export function alertMarkStartFinish(thisGrid){
  thisGrid.dom.containerWithOpacity.classList.replace(classNames.layerOpacityNo, classNames.layerOpacityYes);
  thisGrid.dom.popUpMarkStartFinish.classList.replace(classNames.popUpNotVisible, classNames.popUpVisible);
  
  thisGrid.dom.closePopUpMarkStartFinish.addEventListener('click',function(event){
    event.preventDefault();

    thisGrid.dom.containerWithOpacity.classList.replace(classNames.layerOpacityYes, classNames.layerOpacityNo);
    thisGrid.dom.popUpMarkStartFinish.classList.replace(classNames.popUpVisible, classNames.popUpNotVisible);  
  });
}


export function showSummary(thisGrid){
  const possibleRoutesSummaryDOM = document.querySelector(select.id.possibleRoutesSummary); 
  const fullRouteSummaryDOM = document.querySelector(select.id.fullRouteSummary);
  const longestRouteSummaryDOM = document.querySelector(select.id.longestRouteSummary);
  const shortestRouteSummaryDOM = document.querySelector(select.id.shortestRouteSummary);

  possibleRoutesSummaryDOM.innerHTML = thisGrid.possibleRoutesSummary;
  fullRouteSummaryDOM.innerHTML = thisGrid.fullRouteSummary;
  longestRouteSummaryDOM.innerHTML = thisGrid.longestRouteSummary;
  shortestRouteSummaryDOM.innerHTML = thisGrid.shortestRouteSummary;

  thisGrid.dom.containerWithOpacity.classList.replace(classNames.layerOpacityNo, classNames.layerOpacityYes);
  thisGrid.dom.popUpSummary.classList.replace(classNames.popUpNotVisible, classNames.popUpVisible);
  
  thisGrid.dom.closePopUpSummary.addEventListener('click',function(event){
    event.preventDefault();

    thisGrid.dom.containerWithOpacity.classList.replace(classNames.layerOpacityYes, classNames.layerOpacityNo);
    thisGrid.dom.popUpSummary.classList.replace(classNames.popUpVisible, classNames.popUpNotVisible);  
  });
}