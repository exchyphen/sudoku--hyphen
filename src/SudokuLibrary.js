const SudokuChecker = {
  test: () => console.log("test complete"),

  findBox: (row, col) => {
    return Math.trunc(row / 3) * 3 + Math.trunc(col / 3);
  },
};

export default SudokuChecker;
