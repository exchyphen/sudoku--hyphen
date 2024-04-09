const MAX_ROW = 9;
const MAX_COL = 9;

// deep copy 2d arr
const copyArr = (arr) => {
  const newArr = Array.from(Array(arr.length), () => Array.from(arr[0].length));

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[0].length; j++) {
      newArr[i][j] = arr[i][j];
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
      arr[row][col] = [];
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
