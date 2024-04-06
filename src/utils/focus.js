import { convert1dTo2d, convert2dTo1d } from "./generalFunctions";

const checkFocusCells = (
  num,
  shiftKey,
  ctrlKey,
  focus,
  cornerArr,
  centerArr,
  valueArr
) => {
  for (const index of focus) {
    const [row, col] = convert1dTo2d(index);
    if (shiftKey) {
      if (!cornerArr[row][col].includes(num)) {
        return false;
      }
    } else if (ctrlKey) {
      if (!centerArr[row][col].includes(num)) {
        return false;
      }
    } else {
      if (valueArr[row][col] !== num) {
        return false;
      }
    }
  }

  return true;
};

// helper function: add to focus
const addToFocus = (row, col, mod, focus) => {
  let newFocus;

  if (row < 0 || col < 0) {
    return addToFocus(0, 0, false, focus);
  } else if (mod) {
    newFocus = new Set(focus);
    newFocus.add(convert2dTo1d(row, col));
  } else {
    newFocus = new Set();
    newFocus.add(convert2dTo1d(row, col));
  }

  return {
    newFocus: newFocus,
    lastFocus: [row, col],
  };
};

export { checkFocusCells, addToFocus };
