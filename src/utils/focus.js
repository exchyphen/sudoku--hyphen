import { convert1dTo2d, convert2dTo1d } from "./generalFunctions";

const focus__checkCells = (num, shiftKey, ctrlKey, focus, board) => {
  for (const index of focus) {
    const [row, col] = convert1dTo2d(index);
    if (shiftKey) {
      if (!board[row][col].corner.includes(num)) {
        return false;
      }
    } else if (ctrlKey) {
      if (!board[row][col].center.includes(num)) {
        return false;
      }
    } else {
      if (board[row][col].value !== num) {
        return false;
      }
    }
  }

  return true;
};

// helper function: add to focus
const focus__add = (row, col, mod, focus) => {
  let newFocus;

  if (row < 0 || col < 0) {
    return focus__add(0, 0, false, focus);
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

export { focus__checkCells, focus__add };
