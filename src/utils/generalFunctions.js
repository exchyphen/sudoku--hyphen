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

export { copyArr, convert1dTo2d, convert2dTo1d };
