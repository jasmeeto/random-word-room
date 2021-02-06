import React, { useState } from "react";
import Timer from 'react-compound-timer';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    margin: '5px',
  },
});

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
  const classes = useStyles();
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
                  <TextField
                    type="Number"
                    label="Time"
                    value={timerSeconds}
                    onChange={e => setTimerSeconds(e.target.value)}
                  />
                  <Button
                    className={classes.root}
                    type="submit"
                    variant="contained">
                      Set Timer
                  </Button>
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
                  <Button
                    className={classes.root}
                    variant="contained"
                    onClick={start}>
                    Start
                  </Button>
                  <Button
                    className={classes.root}
                    variant="contained"
                    onClick={stop}>
                    Stop
                  </Button>
                  <Button
                    className={classes.root}
                    variant="contained"
                    onClick={reset}>
                    Reset
                  </Button>
                </div>
            </React.Fragment>
        )}
        
        }
      </Timer>
    </div>
  );
}
