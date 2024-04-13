// internal variables
const MAX_ROW = 9;
const MAX_COL = 9;

// internal functions
const createSeeMap = () => {
  return new Map([
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 0],
    [5, 0],
    [6, 0],
    [7, 0],
    [8, 0],
    [9, 0],
  ]);
};

// copy 2d arr: shallow -> reference to the same objects
const copyArr = (arr) => {
  const newArr = Array.from(Array(arr.length), () => Array.from(arr[0].length));

  for (let row = 0; row < arr.length; row++) {
    for (let col = 0; col < arr[0].length; col++) {
      newArr[row][col] = arr[row][col];
    }
  }

  return newArr;
};

// convert 2d coord to a 1d index
const convert2dTo1d = (row, col) => {
  return row * MAX_COL + col;
};

// convert 1d coord to 2d index
const convert1dTo2d = (index) => {
  return [Math.trunc(index / MAX_COL), index % MAX_COL];
};

// create 2d array of ararys for corner and center
const createBlankBoardArr = () => {
  const arr = Array.from(Array(MAX_ROW), () => Array(MAX_COL));

  for (let row = 0; row < MAX_ROW; row++) {
    for (let col = 0; col < MAX_COL; col++) {
      arr[row][col] = {
        row: row,
        col: col,
        value: 0,
        corner: [],
        center: [],
        seeRow: createSeeMap(),
        seeCol: createSeeMap(),
        seeBox: createSeeMap(),
        given: false,
      };
    }
  }

  return arr;
};

// help format numbers
const numberFormatter = (num) => {
  return num.toLocaleString("en-US", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });
};

export {
  copyArr,
  convert1dTo2d,
  convert2dTo1d,
  createBlankBoardArr,
  numberFormatter,
};
