export const select = {
  containerOf: {
    gridArea: '.grid-area',
    aboveGridArea: '.above-grid-area',
    belowGridArea: '.below-grid-area',
    searchPathButton: '.button',
    pages: '#pages',
  },
  nav: {
    links: '.menu a',
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