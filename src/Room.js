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

import InputTimer from './InputTimer';

const useStyles = makeStyles({
  root: {
    margin: '5px',
  },
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
      <h3> Copy room link :
          <Link href={window.location.href}> {window.location.href} </Link>
      </h3>
      <FormControl component="fieldset">
        <RadioGroup aria-label="Role" name="role" value={guesserValue} onChange={guesserProps.onChange}>
          <FormControlLabel value="cluegiver" control={<Radio />} label="Clue Giver" />
          <FormControlLabel value="guesser" control={<Radio />} label="Guesser" />
        </RadioGroup>
      </FormControl>
      { guesserValue === "cluegiver" &&
        <h1 id="word-main"> {word} </h1>
      }
      <h3> Success Counter: {counter} </h3>
      <div>
        <Button
          size="large"
          className={classes.root}
          variant="contained"
          onClick={() => {sendCommand(room, "success");}}>
            Success
        </Button>
      </div>
      <div>
        <Button
          size="large"
          className={classes.root}
          variant="contained"
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
      <InputTimer />
      <p />
      <h3>Your Word History</h3>
      <ul>
        {wordHistory.map((val, i, array) => {
          if (i===0) return null;
          let revIndex = array.length - 1 - i;
          let revWord = array[revIndex];
          return <li key={revIndex}>{revWord}</li>
        })}
      </ul>
    </div>
  );
};

export default Room;
