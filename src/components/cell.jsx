import "./cell.css";

const Cell = (props) => {
  const data = props.data;

  return <div className="cell">{data.value}</div>;
};

export default Cell;
