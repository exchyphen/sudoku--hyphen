import { useEffect, useState } from "react";

import "./timer.css";
import { numberFormatter } from "../utils/generalFunctions";

const Timer = (props) => {
  const [baseTime, setBaseTime] = useState(Date.now());
  const [elapsedTime, setElapsedTime] = useState(Date.now());
  const [stopTimer, setStopTimer] = useState(() => {});

  // initial load
  useEffect(() => {
    if (props.status === 1) {
      // reset time
      setBaseTime(Date.now());

      // begin counting up
      const timeInterval = setInterval(() => {
        setElapsedTime(Date.now());
      }, 1000);

      return () => clearInterval(timeInterval);
    }
  }, [props.status]);

  return (
    <section className="time">
      <div className="time__title">Time</div>
      {props.status === 0 ? (
        "No Puzzle"
      ) : (
        <div>
          {numberFormatter(Math.trunc((elapsedTime - baseTime) / 1000 / 60))}:
          {numberFormatter(Math.trunc((elapsedTime - baseTime) / 1000) % 60)}
        </div>
      )}
    </section>
  );
};

export default Timer;
