export const select = {
  containerOf: {
    gridArea: '.grid-area',
    aboveGridArea: '.above-grid-area',
    belowGridArea: '.below-grid-area',
    searchPathButton: '.button',
    endCell: '.last-cell',
    pages: '#pages',
  },
  nav: {
    links: '.menu a',
  },
  id: {
    possibleRoutesSummary: '#possible-routes',
    fullRouteSummary: '#full-route',
    longestRouteSummary: '#longest-route',
    shortestRouteSummary: '#shortest-route',
    containerWithOpacity: '#container-with-opacity',
    popUp: '#pop-up',
    closePopUp: '#close-pop-up',
  }
};

export const classNames = {
  gridRow: 'grid-row',
  gridColumn: 'grid-column',
  markedCell: 'marked-cell',
  startCell: 'first-cell',
  endCell: 'last-cell',
  shortestWay: 'shortest-way',
  possibleMove: 'possible-move',
  layerOpacityNo: 'container-opacity-no',
  layerOpacityYes: 'container-opacity-yes',
  popUpVisible: 'pop-up-visible',
  popUpNotVisible: 'pop-up-not-visible',
  pages: {
    active: 'active',
  }
};

export const attributeNames = {
  cellCoordinate: 'cell-coordinate',
  modeNumber: 'modeNumber',
};

export const gridParams = {
  firstRow: 1,
  lastRow: 10,
  firstColumn: 1,
  lastColumn: 10,
};

export const textData = {
  buttonMode1: 'FINISH DRAWING',
  buttonMode2: 'COMPUTE',
  buttonMode3: 'START AGAIN',
  titleMode1: 'DRAW ROUTES',
  titleMode2: 'PICK START AND FINISH',
  titleMode3: 'THE BEST ROUTE IS...',
};