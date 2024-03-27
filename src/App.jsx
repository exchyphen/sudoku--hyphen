import { useEffect, useState } from "react";
import "./App.css";
import SudokuLibrary from "./SudokuLibrary.js";

import Cell from "./components/cell.jsx";

function App() {
  const MAX_ROW = 9;
  const MAX_COL = 9;

  // states
  const [focus, setFocus] = useState([-1, -1]);
  const [valueArr, setValueArr] = useState(
    Array.from(Array(MAX_ROW), () => Array(MAX_COL).fill(0))
  );
  const [givenArr, setGivenArr] = useState(
    Array.from(Array(MAX_ROW), () => Array(MAX_COL).fill(false))
  );
  const [inputGiven, setInputGiven] = useState(false);
  // 0 = pen, 1 = corner marking
  const [mode, setMode] = useState(0);

  // board data
  const data__board = Array.from(Array(MAX_ROW), () => Array(MAX_COL));
  // initialize data board
  for (let row = 0; row < MAX_ROW; row++) {
    for (let col = 0; col < MAX_COL; col++) {
      data__board[row][col] = {
        row: row,
        col: col,
        box: SudokuLibrary.findBox(row, col),
      };
    }
  }

  // helpful functions

  // input: 2d array, output: deep copy of 2d array
  const copyArr = (arr) => {
    const newArr = Array.from(Array(arr.length), () =>
      Array.from(arr[0].length)
    );

    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr[0].length; j++) {
        newArr[i][j] = arr[i][j];
      }
    }

    return newArr;
  };

  // handlers
  const handleCellClick = (row, col) => {
    console.log("handling cell click", row, col);

    setFocus([row, col]);
  };

  const handleKeyDown = (e) => {
    console.log("key pressed", e.keyCode);
    const [row, col] = focus;

    // arrow keys or wasd
    // left or a
    if (e.keyCode === 37 || e.keyCode === 65) {
      setFocus([row, Math.max(0, col - 1)]);
      return;
    }
    // right or d
    if (e.keyCode === 39 || e.keyCode === 68) {
      setFocus([row, Math.min(col + 1, MAX_COL - 1)]);
      return;
    }
    // up or w
    if (e.keyCode === 38 || e.keyCode === 87) {
      setFocus([Math.max(0, row - 1), col]);
      return;
    }
    // down or s
    if (e.keyCode === 40 || e.keyCode === 83) {
      setFocus([Math.min(row + 1, MAX_ROW - 1), col]);
      return;
    }

    // if focus exists, overwrite the focus cell
    if (row >= 0 && col >= 0) {
      // if we are trying to overwrite a given number and we are not setting given: dont let it
      if (givenArr[row][col] && !inputGiven) {
        console.log("cannot overwrite given number");
        return;
      }

      console.log("writing to", row, col);

      console.log("value", e.keyCode - 49 + 1);

      // write to value array
      const newArr = copyArr(valueArr);

      // valid 1 - 9
      if (49 <= e.keyCode && e.keyCode <= 57) {
        newArr[row][col] = e.keyCode - 49 + 1;

        // inputting given numbers wehn setting given
        if (inputGiven) {
          const newGivenArr = copyArr(givenArr);
          newGivenArr[row][col] = true;
          setGivenArr(newGivenArr);
        }
      }
      // backspace or delete
      else if (e.keyCode === 8 || e.keyCode === 46) {
        newArr[row][col] = 0;

        // deleting given numbers when setting given
        if (inputGiven) {
          const newGivenArr = copyArr(givenArr);
          newGivenArr[row][col] = false;
          setGivenArr(newGivenArr);
        }
      }

      setValueArr(newArr);
    }
  };

  // helper function: create the board from cell components
  const createBoard = () => {
    const boxArr = Array(9);
    for (let i = 0; i < boxArr.length; i++) {
      boxArr[i] = [];
    }

    for (let row = 0; row < MAX_ROW; row++) {
      for (let col = 0; col < MAX_COL; col++) {
        const data = data__board[row][col];
        boxArr[data.box].push(
          <Cell
            key={`cell_R${data.row}_C${data.col}`}
            data={data}
            value={valueArr[data.row][data.col]}
            corner={[]}
            center={[]}
            given={givenArr[data.row][data.col]}
            onCellClick={handleCellClick}
            focus={focus[0] === data.row && focus[1] === data.col}
          ></Cell>
        );
      }
    }

    return boxArr.map((boxData, index) => {
      return (
        <section key={`box${index}`} className="box">
          {boxData}
        </section>
      );
    });
  };

  useEffect(() => {
    // fetch data
  }, []);

  return (
    <>
      <header>
        <hgroup>
          <h1>Sudoku-</h1>
          <p>A sudoku tool.</p>
        </hgroup>
      </header>
      <main className="main prevent-select">
        <article className="board" tabIndex="0" onKeyDown={handleKeyDown}>
          {createBoard()}
        </article>
        <article className="controls">
          <h1>Controls</h1>
          <button className="button" onClick={() => setInputGiven(!inputGiven)}>
            {inputGiven ? "Stop Setting Given" : "Set Given"}
          </button>{" "}
          <button className="button" onClick={() => setMode((mode + 1) % 2)}>
            {mode === 0 ? "Pen" : "Pencil"}
          </button>
        </article>
      </main>
      <footer>
        <hgroup>
          <h2>
            Created by{" "}
            <a
              href="https://github.com/exchyphen/sudoku--hyphen"
              target="_blank"
            >
              exc
            </a>
          </h2>
          <p>amateur sudoku player</p>
        </hgroup>
      </footer>
    </>
  );
}

export default App;
