/* eslint-disable react/prop-types */
import "./cell.css";

const Cell = (props) => {
  // handlers
  const handleMouseDown = () => {
    props.onCellClick(props.cell.row, props.cell.col);
  };

  const handleMouseEnter = (e) => {
    e.preventDefault();

    if (e.buttons === 1) {
      props.onCellDrag(props.cell.row, props.cell.col, true);
    }
  };

  // helper function
  const checkError = (num, pen) => {
    if (pen) {
      // row
      if (props.cell.seeRow.get(num) > 1) {
        return true;
      }

      // col
      if (props.cell.seeCol.get(num) > 1) {
        return true;
      }

      // box
      if (props.cell.seeBox.get(num) > 1) {
        return true;
      }
    } else {
      // row
      if (props.cell.seeRow.get(num) > 0) {
        return true;
      }

      // col
      if (props.cell.seeCol.get(num) > 0) {
        return true;
      }

      // box
      if (props.cell.seeBox.get(num) > 0) {
        return true;
      }
    }

    return false;
  };

  return (
    <div
      className={
        "cell" +
        (props.focus ? " cell--focus" : "") +
        (props.cell.given ? " cell--given" : "")
      }
      onMouseEnter={handleMouseEnter}
      onMouseDown={handleMouseDown}
    >
      <div className="cell__pencil pencil--corner">
        {props.cell.corner.slice(0, 4).map((data, index) => {
          return (
            <div
              key={`pencilCorner${index}`}
              className={checkError(data, false) ? " cell--error" : ""}
            >
              {data}
            </div>
          );
        })}
      </div>
      <div className="cell__pencil pencil--center">
        {props.cell.center.map((data, index) => {
          return (
            <div
              key={`pencilCenter${index}`}
              className={checkError(data, false) ? " cell--error" : ""}
            >
              {data}
            </div>
          );
        })}
      </div>
      <div className="cell__pencil pencil--corner">
        {props.cell.corner.slice(4).map((data, index) => {
          return (
            <div
              key={`pencilCorner${index + 4}`}
              className={checkError(data, false) ? " cell--error" : ""}
            >
              {data}
            </div>
          );
        })}
      </div>
      {props.cell.value === 0 ? null : (
        <div
          className={
            "cell--solved" +
            (props.focus ? " cell--focus" : "") +
            (props.cell.given ? " cell--given" : "") +
            (checkError(props.cell.value, true) ? " cell--error" : "")
          }
        >
          {props.cell.value}
        </div>
      )}
    </div>
  );
};

export default Cell;
