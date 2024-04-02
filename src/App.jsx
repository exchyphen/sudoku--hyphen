import { useEffect, useState } from "react";
import "./App.css";
import SudokuLibrary from "./SudokuLibrary.js";

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
    console.log("mod key", modKey);

    console.log("handling cell click", row, col);
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

  const handleKeyDown = (e) => {
    e.preventDefault();

    console.log("key press summary");
    console.log("key pressed", e.keyCode);
    console.log("shift", e.shiftKey);
    console.log("ctrl", e.ctrlKey);

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
      addToFocus(row, Math.max(0, col - 1), e.shiftKey || e.ctrlKey);
      return;
    }
    // right or d
    if (e.keyCode === 39 || e.keyCode === 68) {
      addToFocus(row, Math.min(col + 1, MAX_COL - 1), e.shiftKey || e.ctrlKey);
      return;
    }
    // up or w
    if (e.keyCode === 38 || e.keyCode === 87) {
      addToFocus(Math.max(0, row - 1), col, e.shiftKey || e.ctrlKey);
      return;
    }
    // down or s
    if (e.keyCode === 40 || e.keyCode === 83) {
      addToFocus(Math.min(row + 1, MAX_ROW - 1), col, e.shiftKey || e.ctrlKey);
      return;
    }

    // if there is at least one focus
    if (focus.size > 0) {
      console.log("entered writing to focus");

      // if already has -> remove from all

      // if not -> add to all, do not remove any existing

      // backspace or delete
      if (e.keyCode === 8 || e.keyCode === 46) {
        let newArr;
        if (e.shiftKey) {
          newArr = copyArr(cornerArr);
        } else if (e.ctrlKey) {
          newArr = copyArr(centerArr);
        } else {
          newArr = copyArr(valueArr);
        }

        for (const index of focus) {
          const [row, col] = convert1dTo2d(index);
          console.log("deleting", row, col);
          handleDelete(row, col, e.shiftKey, e.ctrlKey, newArr);
        }

        // set the changes all at once
        if (e.shiftKey) {
          setCornerArr(newArr);
        } else if (e.ctrlKey) {
          setCenterArr(newArr);
        } else {
          setValueArr(newArr);
        }
      }

      // handle given input
      if (inputGiven) {
        handleGivenInput(row, col, e.keyCode);
      }
      // valid 1 - 9
      else if (49 <= e.keyCode && e.keyCode <= 57) {
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

        // check if all focus already has that number
        let deleteOnly = false;
        if (checkFocusCells(num, e.shiftKey, e.ctrlKey)) {
          // remove number from cells
          deleteOnly = true;
        }
        // if some cells do not have this number
        for (const index of focus) {
          const [row, col] = convert1dTo2d(index);

          handleNumberInput(
            row,
            col,
            num,
            e.shiftKey,
            e.ctrlKey,
            newArr,
            deleteOnly
          );
        }

        // set the changes all at once
        if (e.shiftKey) {
          setCornerArr(newArr);
        } else if (e.ctrlKey) {
          setCenterArr(newArr);
        } else {
          setValueArr(newArr);
        }
      }
    }
  };

  // function: check if the current relavent values have the given number
  // if at any point a given cell does not have that number, return false
  const checkFocusCells = (num, shiftKey, ctrlKey) => {
    for (const index of focus) {
      const [row, col] = convert1dTo2d(index);
      if (shiftKey) {
        if (!cornerArr[row][col].includes(num)) {
          return false;
        }
      } else if (ctrlKey) {
        if (!centerArr[row][col].includes(num)) {
          return false;
        }
      } else {
        if (valueArr[row][col] !== num) {
          return false;
        }
      }
    }

    return true;
  };

  // function: handle given input
  const handleGivenInput = (row, col, keyCode) => {
    // not in setting input mode
    if (!inputGiven) {
      return;
    }

    // no valid focus
    if (row < 0 || col < 0) {
      return;
    }

    // number 1 - 9
    if (49 <= keyCode && keyCode <= 57) {
      const num = keyCode - 49 + 1;

      // set given number
      const newArr = copyArr(valueArr);
      newArr[row][col] = num;
      setValueArr(newArr);

      // set given flag
      const newGivenArr = copyArr(givenArr);
      newGivenArr[row][col] = true;
      setGivenArr(newGivenArr);
    }
    // delete or backspace
    else if (keyCode === 8 || keyCode === 46) {
      const newGivenArr = copyArr(givenArr);
      newGivenArr[row][col] = false;
      setGivenArr(newGivenArr);
    }
  };

  // function: handle delete
  const handleDelete = (row, col, shiftKey, ctrlKey, newArr) => {
    // using shift -> corner marking delete
    if (shiftKey) {
      deleteCorner(row, col, newArr);
    }
    // using ctrl -> center marking delete
    else if (ctrlKey) {
      deleteCenter(row, col, newArr);
    }
    // mode 0: pen
    else if (mode === 0) {
      newArr[row][col] = 0;
      setValueArr(newArr);
    }
    // mode 1: pencil -> corner
    else if (mode === 1) {
      deleteCorner(row, col, newArr);
    }
    // mode 2: pencil -> center
    else if (mode === 2) {
      deleteCenter(row, col, newArr);
    }
  };

  // function: handle number input
  const handleNumberInput = (
    row,
    col,
    num,
    shiftKey,
    ctrlKey,
    newArr,
    deleteOnly
  ) => {
    // if given cell is a given, do nothing
    if (givenArr[row][col]) {
      return;
    }

    // shift key -> corner
    if (shiftKey) {
      setCorner(row, col, num, newArr, deleteOnly);
    }
    // ctrl key -> center
    else if (ctrlKey) {
      setCenter(row, col, num, newArr, deleteOnly);
    }
    // mode 1: pencil: corner
    else if (mode === 1) {
      setCorner(row, col, num, newArr, deleteOnly);
    }
    // mode 2: pencil: center -> ctrl key
    else if (mode === 2) {
      setCenter(row, col, num, newArr, deleteOnly);
    }
    // mode 0: pen -> no modifier key
    else if (mode === 0) {
      newArr[row][col] = num;
    }
  };

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

  // helper function: add to focus
  const addToFocus = (row, col, mod) => {
    if (row < 0 || col < 0) {
      addToFocus(0, 0);
      return;
    } else if (mod) {
      const newFocus = new Set(focus);
      newFocus.add(convert2dTo1d(row, col));
      setFocus(newFocus);
    } else {
      const newFocus = new Set();
      newFocus.add(convert2dTo1d(row, col));
      setFocus(newFocus);
    }

    // add to last used focus
    setLastFocus([row, col]);
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
            corner={cornerArr[data.row][data.col]}
            center={centerArr[data.row][data.col]}
            given={givenArr[data.row][data.col]}
            onCellClick={handleCellClick}
            onCellDrag={addToFocus}
            focus={focus.has(convert2dTo1d(data.row, data.col))}
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

  // helper function: create 2d array of ararys
  function createBlankBoardArr() {
    const arr = Array.from(Array(MAX_ROW), () => Array(MAX_COL));

    for (let row = 0; row < MAX_ROW; row++) {
      for (let col = 0; col < MAX_COL; col++) {
        arr[row][col] = [];
      }
    }

    return arr;
  }

  // helper function: fill in center
  const setCenter = (row, col, num, newArr, deleteOnly) => {
    // includes? remove the number
    if (centerArr[row][col].includes(num)) {
      if (deleteOnly) {
        newArr[row][col] = newArr[row][col].filter((arrNum) => arrNum !== num);
      }
    }
    // does not include -> add the number
    else {
      newArr[row][col].push(num);
      newArr[row][col].sort((a, b) => a - b);
    }
  };

  // helper function: fill in corner
  const setCorner = (row, col, num, newArr, deleteOnly) => {
    // includes? remove the number
    if (cornerArr[row][col].includes(num)) {
      if (deleteOnly) {
        newArr[row][col] = newArr[row][col].filter((arrNum) => arrNum !== num);
      }
    }
    // does not include -> add the number
    else {
      newArr[row][col].push(num);
      newArr[row][col].sort((a, b) => a - b);
    }
  };

  // delete from center
  const deleteCenter = (row, col, newArr) => {
    newArr[row][col].pop();
  };

  // delete from corner
  const deleteCorner = (row, col, newArr) => {
    newArr[row][col].pop();
  };

  // helper function: calculate next mode
  const nextMode = () => {
    return (mode + 1) % 3; // mod total modes
  };

  // helper function: convert 2d coord to a 1d index
  const convert2dTo1d = (row, col) => {
    return row * MAX_COL + col;
  };

  // helper function: convert 1d coord to 2d index
  const convert1dTo2d = (index) => {
    return [Math.trunc(index / MAX_COL), index % MAX_COL];
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

  // help format numbers
  const numberFormatter = (num) => {
    return num.toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
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
          </button>{" "}
          <button className="button" onClick={() => setMode(nextMode())}>
            {modeLabel()}
          </button>
          <button
            className={
              "button" + (solved ? " button--solved" : " button--unsolved")
            }
            onClick={() => setSolved(SudokuLibrary.checkSolved(valueArr))}
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
