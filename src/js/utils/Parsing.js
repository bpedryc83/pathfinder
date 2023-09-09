export function coordinatesStrToInt(coordinates){
    
  let coordinateX = '';
  let coordinateY = '';
  let checkSeparator = false;

  for (let i = 0 ; i < coordinates.length ; i++){
    if (checkSeparator === false){
      if (coordinates.charAt(i) === '-'){
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