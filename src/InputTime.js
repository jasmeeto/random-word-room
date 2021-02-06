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
  initialValue: PropTypes.number,
}

export default function InputTime(props) {
  const initialValue = props.initialValue || 0;
  const classes = useStyles();
  const [timerSeconds, setTimerSeconds] = useState(initialValue);
  const handleSubmit = props.handleSubmit;

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(timerSeconds);
  }
  
  return (
    <div className={props.className || ""}>
      <form onSubmit={onSubmit}>
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
    </div>
  );
}
