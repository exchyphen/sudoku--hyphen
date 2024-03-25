import { useEffect, useState } from "react";
import "./App.css";
import SudokuLibrary from "./SudokuLibrary.js";

import Box from "./components/box";

function App() {
  const [focus, setFocus] = useState(undefined);

  const MAX_ROW = 9;
  const MAX_COL = 9;

  // board data

  const data__board = Array.from(Array(MAX_ROW), () => Array(MAX_COL));
  // initialize data board
  for (let row = 0; row < MAX_ROW; row++) {
    for (let col = 0; col < MAX_COL; col++) {
      data__board[row][col] = {
        row: row,
        col: col,
        box: SudokuLibrary.findBox(row, col),
        value: 0,
        corner: [],
        center: [],
        given: false,
      };
    }
  }

  // handlers

  // helper function: create the board from cell components
  const createBoard = () => {
    const boxArr = Array(9);
    for (let i = 0; i < boxArr.length; i++) {
      boxArr[i] = [];
    }

    for (let row = 0; row < MAX_ROW; row++) {
      for (let col = 0; col < MAX_COL; col++) {
        boxArr[data__board[row][col].box].push(data__board[row][col]);
      }
    }

    return boxArr.map((data, index) => {
      return <Box key={`box${index}`} data={data}></Box>;
    });
  };

  useEffect(() => {
    // test js
    console.log(data__board);
  }, []);

  return (
    <>
      <header>
        <hgroup>
          <h1>Sudoku-</h1>
          <p>A sudoku tool.</p>
        </hgroup>
      </header>
      <main className="main">
        <p>this is the board</p>

        <article className="board">{createBoard()}</article>
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
