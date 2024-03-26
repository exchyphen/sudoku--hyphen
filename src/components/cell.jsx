import "./cell.css";

const Cell = (props) => {
  const data = props.data;

  // handlers
  const handleClick = () => {
    console.log("focus on", data.row, data.col);

    props.onCellClick(data.row, data.col);
  };

  const handleMouseEnter = (e) => {
    e.preventDefault();

    if (e.buttons === 1) {
      console.log("mouse entered cell", data.row, data.col);
    }
  };

  return (
    <div
      className={"cell" + (props.focus ? " cell--focus" : "")}
      // onMouseEnter={handleMouseEnter}
      onMouseDown={handleClick}
    >
      {props.value === 0 ? null : (
        <div className="cell--solved">{props.value}</div>
      )}
    </div>
  );
};

export default Cell;
