import { useEffect, useState } from "react";
import "./App.css";

import { sudoku__findBox, sudoku__checkSolved } from "./utils/sudokuSolver.js";
import {
  convert1dTo2d,
  convert2dTo1d,
  createBlankBoardArr,
  numberFormatter,
} from "./utils/generalFunctions.js";
import { focus__checkCells, focus__add } from "./utils/focus.js";

import Cell from "./components/cell.jsx";

function App() {
  const MAX_ROW = 9;
  const MAX_COL = 9;

  // states
  const [focus, setFocus] = useState(new Set());
  const [lastFocus, setLastFocus] = useState([-1, -1]);

  const [board, setBoard] = useState(createBlankBoardArr());
  const [inputGiven, setInputGiven] = useState(false);
  // 0 = pen, 1 = corner marking
  const [mode, setMode] = useState(0);
  const [solved, setSolved] = useState(false);
  const [modKey, setModKey] = useState("none");
  const [baseTime, setBaseTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(Date.now());
  const [difficulty, setDifficulty] = useState("none");

  // create iterable box arrays
  const createBoxArr = () => {
    const arr = Array(9);

    for (let i = 0; i < arr.length; i++) {
      arr[i] = [];
    }

    for (let row = 0; row < MAX_ROW; row++) {
      for (let col = 0; col < MAX_COL; col++) {
        arr[sudoku__findBox(row, col)].push([row, col]);
      }
    }
    return arr;
  };
  const boxArr = createBoxArr();

  // handlers
  // handleCellClick: when cell is clicked, highlight the cell as focus cell
  const handleCellClick = (row, col) => {
    // convert to 1d
    const index = convert2dTo1d(row, col);
    let newFocus;

    // if we click on the same cell -> remove focus
    if (focus.has(index)) {
      newFocus = new Set(focus);
      newFocus.delete(index);
    } else if (modKey !== "none") {
      newFocus = new Set(focus);
      newFocus.add(index);
    } else {
      newFocus = new Set();
      newFocus.add(index);
    }

    setFocus(newFocus);
    setLastFocus([row, col]);
  };

  // handleKeyDown: when key is pressed, handle the action to current set of focus
  const handleKeyDown = (e) => {
    e.preventDefault();

    // mod keys
    if (e.shiftKey && modKey !== "shift") {
      setModKey("shift");
    }

    if (e.ctrlKey && modKey !== "ctrl") {
      setModKey("ctrl");
    }

    if (!e.shiftKey && !e.ctrlKey && modKey !== "none") {
      setModKey("none");
    }

    // space bar: change modes
    if (e.keyCode === 32) {
      setMode(nextMode());
    }

    const [row, col] = lastFocus;

    // arrow keys or wasd
    // left or a
    if (e.keyCode === 37 || e.keyCode === 65) {
      handleFocus(row, Math.max(0, col - 1), e.shiftKey || e.ctrlKey);
      return;
    }
    // right or d
    if (e.keyCode === 39 || e.keyCode === 68) {
      handleFocus(row, Math.min(col + 1, MAX_COL - 1), e.shiftKey || e.ctrlKey);
      return;
    }
    // up or w
    if (e.keyCode === 38 || e.keyCode === 87) {
      handleFocus(Math.max(0, row - 1), col, e.shiftKey || e.ctrlKey);
      return;
    }
    // down or s
    if (e.keyCode === 40 || e.keyCode === 83) {
      handleFocus(Math.min(row + 1, MAX_ROW - 1), col, e.shiftKey || e.ctrlKey);
      return;
    }

    // if there is at least one focus
    if (focus.size > 0) {
      // backspace or delete
      if (e.keyCode === 8 || e.keyCode === 46) {
        // new board array
        const newBoard = structuredClone(board);
        for (const index of focus) {
          const [row, col] = convert1dTo2d(index);

          // corner marking
          if (e.shiftKey || mode === 1) {
            newBoard[row][col].corner.pop();
          }
          // center marking
          else if (e.ctrlKey || mode === 2) {
            newBoard[row][col].center.pop();
          }
          // pen marking
          else {
            // if we cannot modify givens and the focus is a given cell -> do nothing
            if (!inputGiven && newBoard[row][col].given) {
              continue;
            }

            const num = board[row][col].value;

            // if we are modifying givens
            if (inputGiven) {
              newBoard[row][col].value = 0;
              newBoard[row][col].given = false;
            }
            // if we cannot modify givens and the focus is NOT a given cell
            else if (!newBoard[row][col].given) {
              newBoard[row][col].value = 0;
            }

            // remove from see's row, col, box
            // remove from all rows
            for (let r = 0; r < MAX_ROW; r++) {
              newBoard[r][col].seeRow.set(
                num,
                newBoard[r][col].seeRow.get(num) - 1
              );
            }
            // remove from all cols
            for (let c = 0; c < MAX_COL; c++) {
              newBoard[row][c].seeCol.set(
                num,
                newBoard[row][c].seeCol.get(num) - 1
              );
            }
            // remove from all boxes
            for (const [r, c] of boxArr[sudoku__findBox(row, col)]) {
              newBoard[r][c].seeBox.set(
                num,
                newBoard[r][c].seeBox.get(num) - 1
              );
            }
          }
        }
        setBoard(newBoard);
      }

      // valid 1 - 9
      if (49 <= e.keyCode && e.keyCode <= 57) {
        const num = e.keyCode - 49 + 1;

        const newBoard = structuredClone(board);

        // check if all focus already has that number
        let deleteOnly = false;
        if (focus__checkCells(num, e.shiftKey, e.ctrlKey, focus, newBoard)) {
          // remove number from cells
          deleteOnly = true;
        }

        // go through focus
        for (const index of focus) {
          const [row, col] = convert1dTo2d(index);

          // corner
          if (e.shiftKey || mode === 1) {
            // if the number exists already -> remove if all focus has this number (deleteOnly is true) or do nothing
            if (newBoard[row][col].corner.includes(num)) {
              if (deleteOnly) {
                newBoard[row][col].corner = newBoard[row][col].corner.filter(
                  (arrNum) => arrNum !== num
                );
              }
            }
            // number does not exists -> add
            else {
              newBoard[row][col].corner.push(num);
              newBoard[row][col].corner.sort((a, b) => a - b);
            }
          }
          // center
          else if (e.ctrlKey || mode === 2) {
            // if the number exists already -> remove if all focus has this number (deleteOnly is true) or do nothing
            if (newBoard[row][col].center.includes(num)) {
              if (deleteOnly) {
                newBoard[row][col].center = newBoard[row][col].center.filter(
                  (arrNum) => arrNum !== num
                );
              }
            }
            // number does not exists -> add
            else {
              newBoard[row][col].center.push(num);
              newBoard[row][col].center.sort((a, b) => a - b);
            }
          }
          // pen
          else {
            // if we cannot modify givens and the focus is a given cell -> do nothing
            if (!inputGiven && newBoard[row][col].given) {
              continue;
            }

            // if we are modifying givens
            if (inputGiven) {
              newBoard[row][col].value = num;
              newBoard[row][col].given = true;
            }
            // if we cannot modify givens and the focus is NOT a given cell
            else if (!newBoard[row][col].given) {
              newBoard[row][col].value = num;
            }

            // add to see's row, col, box and remove the previous number
            const prevNum = board[row][col].value;

            // add new number and remove old number to all rows
            for (let r = 0; r < MAX_ROW; r++) {
              // add
              newBoard[r][col].seeRow.set(
                num,
                1 + newBoard[r][col].seeRow.get(num)
              );

              // remove previous number
              if (prevNum !== 0) {
                newBoard[r][col].seeRow.set(
                  prevNum,
                  newBoard[r][col].seeRow.get(prevNum) - 1
                );
              }
            }
            // same change to all cols
            for (let c = 0; c < MAX_COL; c++) {
              // add
              newBoard[row][c].seeCol.set(
                num,
                1 + newBoard[row][c].seeCol.get(num)
              );

              // remove previous number
              if (prevNum !== 0) {
                newBoard[row][c].seeCol.set(
                  prevNum,
                  newBoard[row][c].seeCol.get(prevNum) - 1
                );
              }
            }
            // same change to all boxes
            for (const [r, c] of boxArr[sudoku__findBox(row, col)]) {
              // add
              newBoard[r][c].seeBox.set(
                num,
                1 + newBoard[r][c].seeBox.get(num)
              );

              // remove previous number
              if (prevNum !== 0) {
                newBoard[r][c].seeBox.set(
                  prevNum,
                  newBoard[r][c].seeBox.get(prevNum) - 1
                );
              }
            }
          }
        }

        setBoard(newBoard);
      }
    }
  };

  // handler: when clear button is pressed
  const handleClear = (clearGiven) => {
    setFocus(new Set());
    setMode(0);
    setSolved(false);

    const newBoard = createBlankBoardArr();

    // set givens again, remember to set see's
    if (!clearGiven) {
      for (let row = 0; row < MAX_ROW; row++) {
        for (let col = 0; col < MAX_COL; col++) {
          if (board[row][col].given) {
            newBoard[row][col].value = board[row][col].value;
            newBoard[row][col].given = board[row][col].given;

            // add to see's
            const num = board[row][col].value;
            // add new number and remove old number to all rows
            for (let r = 0; r < MAX_ROW; r++) {
              // add
              newBoard[r][col].seeRow.set(
                num,
                1 + newBoard[r][col].seeRow.get(num)
              );
            }
            // same change to all cols
            for (let c = 0; c < MAX_COL; c++) {
              // add
              newBoard[row][c].seeCol.set(
                num,
                1 + newBoard[row][c].seeCol.get(num)
              );
            }
            // same change to all boxes
            for (const [r, c] of boxArr[sudoku__findBox(row, col)]) {
              // add
              newBoard[r][c].seeBox.set(
                num,
                1 + newBoard[r][c].seeBox.get(num)
              );
            }
          }
        }
      }
    }

    setBoard(newBoard);

    setBaseTime(Date.now());
  };

  // handler that will call focus__add and add the focus state to it. then set the state based on the output
  const handleFocus = (row, col, mod) => {
    const newFocuses = focus__add(row, col, mod, focus);

    setFocus(newFocuses.newFocus);
    setLastFocus(newFocuses.lastFocus);
  };

  // helper function: create the board from cell components
  const createBoard = () => {
    const boxArr = Array(9);
    for (let i = 0; i < boxArr.length; i++) {
      boxArr[i] = [];
    }

    for (let row = 0; row < MAX_ROW; row++) {
      for (let col = 0; col < MAX_COL; col++) {
        const boxNum = sudoku__findBox(row, col);
        boxArr[boxNum].push(
          <Cell
            key={`cell_R${row}_C${col}`}
            cell={board[row][col]}
            onCellClick={handleCellClick}
            onCellDrag={handleFocus}
            focus={focus.has(convert2dTo1d(row, col))}
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

  // can be made pure functions and extract to another file: nextMode, modeLabel

  // helper function: calculate next mode
  const nextMode = () => {
    return (mode + 1) % 3; // mod total modes
  };

  // helper function: determine what to display as a button for mode
  const modeLabel = () => {
    // should include mode toggled by spacebar, or use of a modifier key (shift or ctrl)
    if (mode === 1 || modKey === "shift") {
      return "Corner";
    }

    if (mode === 2 || modKey === "ctrl") {
      return "Center";
    }

    if (mode === 0) {
      return "Pen";
    }
    return "Pen";
  };

  // helper function: set board from dosuku api
  const handleFetch = () => {
    handleClear(true);

    fetch(
      "https://sudoku-api.vercel.app/api/dosuku?query={newboard(limit:1){grids{value,difficulty}}}"
    )
      .then((response) => response.json())
      .then((data) => {
        const fetchedBoard = data.newboard.grids[0].value;

        // set value and given properties of board object
        const newBoard = createBlankBoardArr();
        for (let row = 0; row < MAX_ROW; row++) {
          for (let col = 0; col < MAX_COL; col++) {
            const num = fetchedBoard[row][col];

            newBoard[row][col].value = num;
            newBoard[row][col].given = num > 0;

            // add to row, col, box
            // add to all rows
            for (let r = 0; r < MAX_ROW; r++) {
              newBoard[r][col].seeRow.set(
                num,
                1 + newBoard[r][col].seeRow.get(num)
              );
            }
            // add to all cols
            for (let c = 0; c < MAX_COL; c++) {
              newBoard[row][c].seeCol.set(
                num,
                1 + newBoard[row][c].seeCol.get(num)
              );
            }
            // add to all boxes
            for (const [r, c] of boxArr[sudoku__findBox(row, col)]) {
              newBoard[r][c].seeBox.set(
                num,
                1 + newBoard[r][c].seeBox.get(num)
              );
            }
          }
        }

        setBoard(newBoard);

        setDifficulty(data.newboard.grids[0].difficulty);
      });
  };

  // initial load
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setElapsedTime(Date.now());
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  useEffect(() => {
    if (inputGiven === false) {
      setBaseTime(Date.now());
    }
  }, [inputGiven]);

  return (
    <>
      <header>
        <hgroup>
          <h1>Sudoku-</h1>
          <p>A sudoku tool.</p>
        </hgroup>
      </header>
      <main className="main">
        <article
          className="board prevent-select"
          tabIndex="0"
          onKeyDown={handleKeyDown}
          onKeyUp={() => setModKey("none")}
        >
          {createBoard()}
        </article>
        <article className="controls">
          <h1>Controls</h1>
          <section className="time">
            <div className="time__title">Time</div>
            <div>
              {numberFormatter(
                Math.trunc((elapsedTime - baseTime) / 1000 / 60)
              )}
              :
              {numberFormatter(
                Math.trunc((elapsedTime - baseTime) / 1000) % 60
              )}
            </div>
          </section>
          <button className="button" onClick={() => setInputGiven(!inputGiven)}>
            {inputGiven ? "Stop Setting Given" : "Set Given"}
          </button>
          <button className="button" onClick={() => setMode(nextMode())}>
            {modeLabel()}
          </button>
          <button
            className={
              "button" + (solved ? " button--solved" : " button--unsolved")
            }
            onClick={() => setSolved(sudoku__checkSolved(board))}
          >
            Check Solved
          </button>
          <button className="button" onClick={() => handleClear(true)}>
            Clear All
          </button>
          <button className="button" onClick={() => handleClear(false)}>
            Clear Non-Given
          </button>
          <h2>Get New Board</h2>
          <button className="button" onClick={() => handleFetch()}>
            Get New Board
          </button>
          <div>Current difficulty: {difficulty}</div>
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
