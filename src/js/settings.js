export const select = {
  containerOf: {
    finderSettings: '.finder-settings',
    finderApp: '.finder-app',
    createGridButton: '.create-grid-button',
    gridArea: '.grid-area',
    aboveGridArea: '.above-grid-area',
    belowGridArea: '.below-grid-area',
    modeButton: '.mode-button',
    startCell: '.start-cell',
    finishCell: '.finish-cell',
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
    popUpSummary: '#pop-up-summary',
    closePopUpSummary: '#close-pop-up-summary',
    popUpTwoCells: '#pop-up-two-cells',
    closePopUpTwoCells: '#close-pop-up-two-cells',
    popUpMarkStartFinish: '#pop-up-mark-start-finish',
    closePopUpMarkStartFinish: '#close-pop-up-mark-start-finish',
  }
};

export const classNames = {
  gridRow: 'grid-row',
  gridColumn: 'grid-column',
  markedCell: 'marked-cell',
  startCell: 'start-cell',
  finishCell: 'finish-cell',
  shortestWay: 'shortest-way',
  possibleMove: 'possible-move',
  layerOpacityNo: 'container-opacity-no',
  layerOpacityYes: 'container-opacity-yes',
  popUpVisible: 'pop-up-visible',
  popUpNotVisible: 'pop-up-not-visible',
  pages: {
    active: 'active',
  },
  links: {
    active: 'currentPageLink',
  }
};

export const attributeNames = {
  cellCoordinate: 'cell-coordinate',
  modeNumber: 'modeNumber',
};

export const gridParams = {
  defaultNoOfRows: 10,
  defaultNoOfColumns: 10,
  firstRow: 1,
  firstColumn: 1,
};

export const textData = {
  titleMode1: 'DRAW ROUTES',
  titleMode2: 'MARK START AND FINISH',
  titleMode3: 'THE BEST ROUTE IS...',
  buttonMode1: 'FINISH DRAWING',
  buttonMode2: 'SEARCH PATH',
  buttonMode3: 'START AGAIN',
};