import React, { useState } from "react";
import Timer from 'react-compound-timer';

const timerNumberStyle = {
  fontWeight: "bold",
};

const timerSectionStyle = {
  margin: "2px",
};

const timerDisplayStyle = {
  margin: "0.5em",
}

export default function InputTimer(props) {
  const [timerSeconds, setTimerSeconds] = useState(0);

  return (
    <div className={props.className}>
    <Timer 
        startImmediately={false}
        timeToUpdate={50}
        initialTime={0}
        direction="backward">
        {({ start, stop, reset, setTime}) => {
            const handleSubmit = (evt) => {
                evt.preventDefault();
                stop();
                setTime(timerSeconds * 1000);
            }
            return (
            <React.Fragment>
                <form onSubmit={handleSubmit}>
                  <label>
                      Timer Time (s) : &nbsp;
                      <input
                      type="number"
                      value={timerSeconds}
                      onChange={e => setTimerSeconds(e.target.value)}
                      />
                  </label>
                  &nbsp;
                  <input type="submit" value="Set Timer" />
                </form>
                <div style={timerDisplayStyle}>
                    <span style={timerSectionStyle}>
                      <span style={timerNumberStyle}><Timer.Minutes /></span> min
                    </span>
                    <span style={timerSectionStyle}>
                      <span style={timerNumberStyle}><Timer.Seconds /></span> s
                    </span>
                    <span style={timerSectionStyle}>
                      <span style={timerNumberStyle}><Timer.Milliseconds /></span> ms
                    </span>
                   
                </div>
                <div>
                    <button onClick={start}>Start</button>
                    <button onClick={stop}>Stop</button>
                    <button onClick={reset}>Reset</button>
                </div>

            </React.Fragment>
        )}
        
        }
      </Timer>
    </div>
  );
}
