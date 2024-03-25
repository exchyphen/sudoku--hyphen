import "./box.css";

import Cell from "./cell";

const Box = (props) => {
  // create box
  const createBox = () => {
    return props.data.map((data, index) => {
      return <Cell key={`cell_R${data.row}_C${data.col}`} data={data}></Cell>;
    });
  };

  return <section className="box">{createBox()}</section>;
};

export default Box;
