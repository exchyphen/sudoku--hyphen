import { useEffect, useState } from "react";
import "./App.css";

import { sudoku__findBox, sudoku__checkSolved } from "./utils/sudokuSolver.js";
import {
  copyArr,
  convert1dTo2d,
  convert2dTo1d,
  createBlankBoardArr,
  numberFormatter,
} from "./utils/generalFunctions.js";
import { checkFocusCells, addToFocus } from "./utils/focus.js";

import Cell from "./components/cell.jsx";

function App() {
  const MAX_ROW = 9;
  const MAX_COL = 9;

  // states
  const [focus, setFocus] = useState(new Set());
  const [lastFocus, setLastFocus] = useState([-1, -1]);
  const [valueArr, setValueArr] = useState(
    Array.from(Array(MAX_ROW), () => Array(MAX_COL).fill(0))
  );
  const [cornerArr, setCornerArr] = useState(createBlankBoardArr());
  const [centerArr, setCenterArr] = useState(createBlankBoardArr());
  const [givenArr, setGivenArr] = useState(
    Array.from(Array(MAX_ROW), () => Array(MAX_COL).fill(false))
  );
  const [inputGiven, setInputGiven] = useState(false);
  // 0 = pen, 1 = corner marking
  const [mode, setMode] = useState(0);
  const [solved, setSolved] = useState(false);
  const [modKey, setModKey] = useState("none");
  const [baseTime, setBaseTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(Date.now());
  const [difficulty, setDifficulty] = useState("none");

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
      // remove number from value, corner, center
      if (e.keyCode === 8 || e.keyCode === 46) {
        let newArr;
        if (e.shiftKey) {
          newArr = copyArr(cornerArr);
        } else if (e.ctrlKey) {
          newArr = copyArr(centerArr);
        } else {
          newArr = copyArr(valueArr);
        }

        let newGivenArr = copyArr(givenArr);

        for (const index of focus) {
          const [row, col] = convert1dTo2d(index);

          // delete
          if (e.shiftKey || e.ctrlKey) {
            newArr[row][col].pop();
          } else if (mode === 0) {
            if (inputGiven || !givenArr[row][col]) {
              newArr[row][col] = 0;
            }
          } else {
            newArr[row][col].pop();
          }

          if (inputGiven) {
            newGivenArr[row][col] = false;
          }
        }

        // set the changes all at once
        if (e.shiftKey) {
          setCornerArr(newArr);
        } else if (e.ctrlKey) {
          setCenterArr(newArr);
        } else {
          setValueArr(newArr);
        }

        setGivenArr(newGivenArr);
      }

      // valid 1 - 9
      if (49 <= e.keyCode && e.keyCode <= 57) {
        const num = e.keyCode - 49 + 1;

        // create new arr
        let newArr;
        if (e.shiftKey) {
          newArr = copyArr(cornerArr);
        } else if (e.ctrlKey) {
          newArr = copyArr(centerArr);
        } else {
          newArr = copyArr(valueArr);
        }
        let newGivenArr = copyArr(givenArr);

        // check if all focus already has that number
        let deleteOnly = false;
        if (
          checkFocusCells(
            num,
            e.shiftKey,
            e.ctrlKey,
            focus,
            cornerArr,
            centerArr,
            valueArr
          )
        ) {
          // remove number from cells
          deleteOnly = true;
        }

        // if some cells do not have this number
        for (const index of focus) {
          const [row, col] = convert1dTo2d(index);

          if (e.shiftKey || e.ctrlKey) {
            // includes? remove the number
            if (newArr[row][col].includes(num)) {
              if (deleteOnly) {
                newArr[row][col] = newArr[row][col].filter(
                  (arrNum) => arrNum !== num
                );
              }
            }
            // does not include -> add the number
            else {
              newArr[row][col].push(num);
              newArr[row][col].sort((a, b) => a - b);
            }
          } else if (mode === 0) {
            if (inputGiven || !givenArr[row][col]) {
              newArr[row][col] = num;
            }

            if (inputGiven) {
              newGivenArr[row][col] = true;
            }
          } else {
            // includes? remove the number
            if (newArr[row][col].includes(num)) {
              if (deleteOnly) {
                newArr[row][col] = newArr[row][col].filter(
                  (arrNum) => arrNum !== num
                );
              }
            }
            // does not include -> add the number
            else {
              newArr[row][col].push(num);
              newArr[row][col].sort((a, b) => a - b);
            }
          }
        }

        // set the changes all at once
        if (e.shiftKey) {
          setCornerArr(newArr);
        } else if (e.ctrlKey) {
          setCenterArr(newArr);
        } else {
          setValueArr(newArr);
        }
        setGivenArr(newGivenArr);
      }
    }
  };

  // handler: when clear button is pressed
  const handleClear = (clearGiven) => {
    setFocus(new Set());
    setCornerArr(createBlankBoardArr());
    setCenterArr(createBlankBoardArr());
    setMode(0);
    setSolved(false);

    // give choice of clearing current puzzle givens or not
    if (clearGiven) {
      setValueArr(Array.from(Array(MAX_ROW), () => Array(MAX_COL).fill(0)));
      setGivenArr(Array.from(Array(MAX_ROW), () => Array(MAX_COL).fill(false)));
    } else {
      const newArr = copyArr(valueArr);

      for (let row = 0; row < MAX_ROW; row++) {
        for (let col = 0; col < MAX_COL; col++) {
          if (!givenArr[row][col]) {
            newArr[row][col] = 0;
          }
        }
      }

      setValueArr(newArr);
    }

    setBaseTime(Date.now());
  };

  // handler that will call addToFocus and add the focus state to it. then set the state based on the output
  const handleFocus = (row, col, mod) => {
    const newFocuses = addToFocus(row, col, mod, focus);

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
            row={row}
            col={col}
            value={valueArr[row][col]}
            corner={cornerArr[row][col]}
            center={centerArr[row][col]}
            given={givenArr[row][col]}
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
        const board = data.newboard.grids[0].value;

        setValueArr(copyArr(board));
        setGivenArr(copyArr(board));

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
            onClick={() => setSolved(sudoku__checkSolved(valueArr))}
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
