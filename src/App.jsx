import { useEffect, useState } from "react";
import "./App.css";
import SudokuLibrary from "./SudokuLibrary.js";

import Cell from "./components/cell.jsx";

function App() {
  const MAX_ROW = 9;
  const MAX_COL = 9;

  const [focus, setFocus] = useState([-1, -1]);
  const [valueArr, setValueArr] = useState(
    Array.from(Array(MAX_ROW), () => Array(MAX_COL).fill(0))
  );

  // board data
  const data__board = Array.from(Array(MAX_ROW), () => Array(MAX_COL));
  // initialize data board
  for (let row = 0; row < MAX_ROW; row++) {
    for (let col = 0; col < MAX_COL; col++) {
      data__board[row][col] = {
        row: row,
        col: col,
        box: SudokuLibrary.findBox(row, col),
        given: false,
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
    if (e.keyCode < 49 || e.keyCode > 57) {
      return;
    }

    console.log("key", e.keyCode);

    // if no focus, do nothing
    if (focus[0] >= 0 && focus[1] >= 0) {
      console.log("writing to", focus[0], focus[1]);
      console.log("value", e.keyCode - 49 + 1);

      const newArr = copyArr(valueArr);

      newArr[focus[0]][focus[1]] = e.keyCode - 49 + 1;

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
