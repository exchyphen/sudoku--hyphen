import { useEffect, useState } from "react";
import "./App.css";
import SudokuChecker from "./SudokuChecker.js";

import Cell from "./components/cell";

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
    const arr = [];

    for (let row = 0; row < MAX_ROW; row++) {
      for (let col = 0; col < MAX_COL; col++) {
        arr.push(
          <Cell key={`cell-${row}-${col}`} data={data__board[row][col]}></Cell>
        );
      }
    }

    return arr;
  };

  useEffect(() => {
    // test js
    SudokuChecker.test();
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
