const sudoku__findBox = (row, col) => {
  return Math.trunc(row / 3) * 3 + Math.trunc(col / 3);
};

const sudoku__checkSolved = (board) => {
  const N = 9;

  // data sets
  const rowSet = Array(N);
  const colSet = Array(N);
  const boxSet = Array(N);

  // initialization
  for (let i = 0; i < N; i++) {
    rowSet[i] = new Set();
    colSet[i] = new Set();
    boxSet[i] = new Set();
  }

  for (let row = 0; row < N; row++) {
    for (let col = 0; col < N; col++) {
      if (board[row][col].value === 0) {
        return false;
      }

      const num = board[row][col].value;

      // row
      if (rowSet[row].has(num)) {
        return false;
      }
      rowSet[row].add(num);

      // col
      if (colSet[col].has(num)) {
        return false;
      }
      colSet[col].add(num);

      // box
      const boxIndex = sudoku__findBox(row, col);
      if (boxSet[boxIndex].has(num)) {
        return false;
      }
      boxSet[boxIndex].add(num);
    }
  }

  return true;
};

export { sudoku__findBox, sudoku__checkSolved };
