import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { initiateSocket, disconnectSocket,
  subscribeToMessage, sendCommand } from './Socket';

import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import InputTimer from './InputTimer';

const useStyles = makeStyles({
  root: {
    margin: '5px',
  },
  word: {
    margin: '10px',
  }
});

function useRadioButtons(name, initialValue=null) {
  const [value, setState] = useState(initialValue);

  const handleChange = e => {
    setState(e.target.value);
  };

  const inputProps = {
    name,
    type: "radio",
    onChange: handleChange
  };

  return [value, inputProps];
}

const Room = (props) => {
  const classes = useStyles();
  let location = useLocation();
  let room = location.pathname;
  const [word, setWord] = useState("");
  const [wordHistory] = useState([]);
  const [counter, setCounter] = useState(0);
  const [guesserValue, guesserProps] = useRadioButtons("playertype", "cluegiver");

  useEffect(() => {
    if (room) initiateSocket(room);
    subscribeToMessage((err, data) => {
      if(err) return;
      if (data.type === "wordInit" || data.type === "wordUpdate") { 
        wordHistory.push(data.data);
        setWord(data.data);
      }
      else if (data.type === "counterUpdate") {
        setCounter(data.data);
      }
    });
    return () => {
      disconnectSocket();
    }
  }, [room, wordHistory]);

  return (
    <div>
      <Typography variant="body1"> Link :
          <Link href={window.location.href}> {window.location.href} </Link>
      </Typography>
      <FormControl component="fieldset">
        <RadioGroup aria-label="Role" name="role" value={guesserValue} onChange={guesserProps.onChange}>
          <FormControlLabel value="cluegiver" control={<Radio />} label="Clue Giver" />
          <FormControlLabel value="guesser" control={<Radio />} label="Guesser" />
        </RadioGroup>
      </FormControl>
      { guesserValue === "cluegiver" &&
        <Typography variant="h3" color="primary" className={classes.word}> 
          {word}
        </Typography>
      }
      <Typography variant="h5" className={classes.root}>
        Success Count <Typography variant="h4">{counter}</Typography>
      </Typography>
      <div>
        <Button
          size="large"
          className={classes.root}
          variant="contained"
          color="primary"
          onClick={() => {sendCommand(room, "success");}}>
            Success
        </Button>
      </div>
      <div>
        <Button
          size="large"
          className={classes.root}
          variant="contained"
          color="secondary"
          onClick={() => {sendCommand(room, "skip");}}>
          Skip
        </Button>
      </div>
      <div>
        <Button
          size="small"
          className={classes.root}
          variant="contained"
          onClick={() => {sendCommand(room, "resetCounter");}}>
            Reset Counter
        </Button>
      </div>
      <p />
      <InputTimer startTime={30} />
      <p />
      <Typography variant="h5">
        Your Word History
      </Typography>

      <ul>
        {wordHistory.map((val, i, array) => {
          if (i===0) return null;
          let revIndex = array.length - 1 - i;
          let revWord = array[revIndex];
          return (
            <Typography variant="body1">
              <li key={revIndex}>{revWord}</li>
            </Typography>
          );
        })}
      </ul>
    </div>
  );
};

export default Room;
