import React, { useState } from "react";
import Timer from 'react-compound-timer';

export default function NameForm(props) {
  const [timerSeconds, setTimerSeconds] = useState(0);

  return (
    <div>
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
                <div>
                    <Timer.Minutes /> minutes 
                    <div />
                    <Timer.Seconds /> seconds
                    <div />
                    <Timer.Milliseconds /> milliseconds
                </div>
                <br />
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
