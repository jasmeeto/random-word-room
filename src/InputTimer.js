import React, { useState } from "react";
import Timer from 'react-compound-timer';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

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

export default function InputTimer(props) {
  const startTime = props.startTime || 0;
  const classes = useStyles();
  const [timerSeconds, setTimerSeconds] = useState(startTime);

  return (
    <div className={props.className || ""}>
    <Timer 
        startImmediately={false}
        timeToUpdate={50}
        initialTime={timerSeconds * 1000}
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
                    label="Time (s)"
                    value={timerSeconds}
                    onChange={e => setTimerSeconds(e.target.value)}
                  />
                  <Button
                    className={classes.root}
                    type="submit"
                    variant="outlined">
                      Set Timer
                  </Button>
                </form>
                <div className={classes.root}>
                  <Typography variant="h5">
                    <div>
                        <span style={timerSectionStyle}>
                          <span style={timerNumberStyle}><Timer.Minutes /></span> min
                        </span>
                        <span style={timerSectionStyle}>
                          <span style={timerNumberStyle}><Timer.Seconds /></span> s
                        </span>
                    </div>
                  </Typography>
                  <Typography >
                    <div>
                        <span style={timerSectionStyle}>
                          <span style={timerNumberStyle}><Timer.Milliseconds /></span> ms
                        </span>
                    </div>
                  </Typography>
                </div>
                <div>
                  <Button
                    className={classes.root}
                    variant="outlined"
                    onClick={start}>
                    Start
                  </Button>
                  <Button
                    className={classes.root}
                    variant="outlined"
                    onClick={stop}>
                    Stop
                  </Button>
                  <Button
                    className={classes.root}
                    variant="outlined"
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
