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
  const [cornerArr, setCornerArr] = useState(createBlankBoardArr());
  const [centerArr, setCenterArr] = useState(createBlankBoardArr());
  const [givenArr, setGivenArr] = useState(
    Array.from(Array(MAX_ROW), () => Array(MAX_COL).fill(false))
  );
  const [inputGiven, setInputGiven] = useState(false);
  // 0 = pen, 1 = corner marking
  const [mode, setMode] = useState(0);
  const [solved, setSolved] = useState(false);

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

    // if we click on the same cell -> remove focus
    if (focus[0] === row && focus[1] === col) {
      setFocus([-1, -1]);
      return;
    }

    setFocus([row, col]);
  };

  const handleKeyDown = (e) => {
    console.log("key press summary");
    console.log("key pressed", e.keyCode);
    console.log("shift is pressed", e.shiftKey);
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

    // space bar: change modes
    if (e.keyCode === 32) {
      setMode(nextMode());
    }

    // if focus exists, overwrite the focus cell
    if (row >= 0 && col >= 0) {
      // if we are trying to overwrite a given number and we are not setting given: dont let it
      if (givenArr[row][col] && !inputGiven) {
        console.log("cannot overwrite a given number");
        return;
      }

      // valid 1 - 9
      if (49 <= e.keyCode && e.keyCode <= 57) {
        const num = e.keyCode - 49 + 1;

        // inputting given numbers when setting given
        if (inputGiven) {
          // set given number
          const newArr = copyArr(valueArr);
          newArr[row][col] = num;
          setValueArr(newArr);

          // set given flag
          const newGivenArr = copyArr(givenArr);
          newGivenArr[row][col] = true;
          setGivenArr(newGivenArr);
          return;
        }

        // mode 1: pencil: corner
        if (mode === 1 || e.shiftKey) {
          const newArr = copyArr(cornerArr);

          // includes? remove the number
          if (cornerArr[row][col].includes(num)) {
            newArr[row][col] = newArr[row][col].filter(
              (arrNum) => arrNum !== num
            );
            setCornerArr(newArr);
          }
          // does not include -> add the number
          else {
            newArr[row][col].push(num);
            newArr[row][col].sort((a, b) => a - b);
            setCornerArr(newArr);
          }
        }
        // mode 0: pen
        else if (mode === 0) {
          const newArr = copyArr(valueArr);
          newArr[row][col] = num;
          setValueArr(newArr);
        } else if (mode === 2) {
          const newArr = copyArr(centerArr);

          // includes? remove the number
          if (centerArr[row][col].includes(num)) {
            newArr[row][col] = newArr[row][col].filter(
              (arrNum) => arrNum !== num
            );
            setCenterArr(newArr);
          }
          // does not include -> add the number
          else {
            newArr[row][col].push(num);
            newArr[row][col].sort((a, b) => a - b);
            setCenterArr(newArr);
          }
        }
      }
      // backspace or delete
      else if (e.keyCode === 8 || e.keyCode === 46) {
        if (valueArr[row][col] !== 0) {
          const newArr = copyArr(valueArr);
          newArr[row][col] = 0;
          setValueArr(newArr);
        } else {
          if (mode === 2) {
            const newArr = copyArr(centerArr);
            newArr[row][col].pop();
            setCenterArr(newArr);
          } else {
            const newArr = copyArr(cornerArr);
            newArr[row][col].pop();
            setCornerArr(newArr);
          }
        }

        // deleting given numbers when setting given
        if (inputGiven) {
          const newGivenArr = copyArr(givenArr);
          newGivenArr[row][col] = false;
          setGivenArr(newGivenArr);
        }
      }
    }
  };

  const handleClear = () => {
    setFocus([-1, -1]);
    setValueArr(Array.from(Array(MAX_ROW), () => Array(MAX_COL).fill(0)));
    setCornerArr(createBlankBoardArr());
    setCenterArr(createBlankBoardArr());
    setMode(0);
    setSolved(false);
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

  // helper function: calculate next mode
  const nextMode = () => {
    return (mode + 1) % 3; // mod total modes
  };

  // helper function: determine what to display as a button for mode
  const modeLabel = () => {
    if (mode === 0) {
      return "Pen";
    }

    if (mode === 1) {
      return "Corner";
    }

    if (mode === 2) {
      return "Center";
    }
  };

  // initial load
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
      <main className="main">
        <article
          className="board prevent-select"
          tabIndex="0"
          onKeyDown={handleKeyDown}
        >
          {createBoard()}
        </article>
        <article className="controls">
          <h1>Controls</h1>
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
          <button className="button" onClick={() => handleClear()}>
            Clear
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
