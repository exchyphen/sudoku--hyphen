import { useEffect, useState } from "react";
import "./App.css";

import Cell from "./components/cell";

function App() {
  const MAX_ROW = 9;
  const MAX_COL = 9;

  // board data
  const data__board = Array.from(Array(MAX_ROW), () => Array(MAX_COL));

  // helper function: create the board from cell components
  const createBoard = () => {
    const arr = [];

    for (let i = 0; i < MAX_ROW * MAX_COL; i++) {
      arr.push(<Cell key={`cell${i}`}></Cell>);
    }

    return arr;
  };

  useEffect(() => {
    // initialize data board
    for (let row = 0; row < MAX_ROW; row++) {
      for (let col = 0; col < MAX_COL; col++) {
        data__board[row][col] = {
          value: undefined,
          corner: [],
          center: [],
          given: false,
        };
      }
    }
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
