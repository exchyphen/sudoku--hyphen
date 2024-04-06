/* eslint-disable react/prop-types */
import "./cell.css";

const Cell = (props) => {
  // handlers
  const handleMouseDown = () => {
    console.log("focus on", props.row, props.col);

    props.onCellClick(props.row, props.col);
  };

  const handleMouseEnter = (e) => {
    e.preventDefault();

    if (e.buttons === 1) {
      console.log("mouse entered cell", props.row, props.col);
      props.onCellDrag(props.row, props.col, true);
    }
  };

  return (
    <div
      className={
        "cell" +
        (props.focus ? " cell--focus" : "") +
        (props.given ? " cell--given" : "")
      }
      onMouseEnter={handleMouseEnter}
      onMouseDown={handleMouseDown}
    >
      <div className="cell__pencil pencil--corner">
        {props.corner.slice(0, 4).map((data, index) => {
          return <div key={`pencilCorner${index}`}>{data}</div>;
        })}
      </div>
      <div className="cell__pencil pencil--center">
        {props.center.map((data, index) => {
          return <div key={`pencilCenter${index}`}>{data}</div>;
        })}
      </div>
      <div className="cell__pencil pencil--corner">
        {props.corner.slice(4).map((data, index) => {
          return <div key={`pencilCorner${index + 4}`}>{data}</div>;
        })}
      </div>
      {props.value === 0 ? null : (
        <div
          className={
            "cell--solved" +
            (props.focus ? " cell--focus" : "") +
            (props.given ? " cell--given" : "")
          }
        >
          {props.value}
        </div>
      )}
    </div>
  );
};

export default Cell;
