import React, { useState } from "react";
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    margin: '5px',
  },
});

InputTime.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  handleStart: PropTypes.func.isRequired,
  initialValue: PropTypes.number,
}

const MAX_TIME = 600; // seconds, 600s = 10 min

export default function InputTime(props) {
  const initialValue = props.initialValue || 0;
  const classes = useStyles();
  const [timerSeconds, setTimerSeconds] = useState(initialValue);
  const [helperText, setHelperText] = useState("");
  const handleSubmit = props.handleSubmit;
  const handleStart = props.handleStart;

  const onSubmit = (e) => {
    e.preventDefault();
    if (timerSeconds > MAX_TIME) {
      setHelperText("Time too high");
      return;
    }
    console.log(helperText);
    setHelperText("");
    handleSubmit(timerSeconds);
  }
  
  return (
    <div className={props.className || ""}>
      <form onSubmit={onSubmit}>
        <TextField
          error={helperText ? true : false}
          helperText={helperText}
          type="Number"
          label="Time (s)"
          value={timerSeconds}
          onChange={e => setTimerSeconds(e.target.value)}
        />
        <Button
          className={classes.root}
          type="submit"
          variant="outlined">
            Reset Timer
        </Button>
        <Button
          className={classes.root}
          onClick={() => {handleStart();}}
          variant="outlined">
            Start Time
        </Button>
      </form>
    </div>
  );
}
