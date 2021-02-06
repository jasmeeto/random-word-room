import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { initiateSocket, disconnectSocket,
  subscribeToMessage, sendCommand } from './Socket';

import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

import grey from "@material-ui/core/colors/grey";


import InputTime from './InputTime';

const primary800 = grey["100"];

const useStyles = makeStyles({
  root: {
    margin: '5px',
  },
  word: {
    margin: '10px',
  },
  wordCard: {
    backgroundColor: primary800,
  },
  link: {
    paddingRight: '60px',
    paddingLeft: '60px',
  },
  restartButton: {
    margin: '15px',
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

function secondsToMs(d) {
  d = Number(d);
  var m = Math.floor(d / 60);
  var s = Math.floor(d % 60);

  var mDisplay = m > 0 ? String(m) : "";
  var sDisplay = s > 0 ? String(s) : "";
  return mDisplay.padStart(2, '0') + ":" + sDisplay.padStart(2, '0'); 
}

const Room = (props) => {
  const classes = useStyles();
  let location = useLocation();
  let room = location.pathname;
  const [word, setWord] = useState("");
  const [wordHistory] = useState([]);
  const [counter, setCounter] = useState(0);
  const [guesserValue, guesserProps] = useRadioButtons("playertype", "cluegiver");
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [initialTime, setInitialTime] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [updatedTimer, setUpdatedTimer] = useState(false);

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
      else if (data.type === "timerInit" || data.type==="timerSet") {
        setTimerSeconds(data.data);
        setInitialTime(data.data);
      }
      else if (data.type === "timerUpdate") {
        setTimerSeconds(data.data);
        setUpdatedTimer(true);
      }
    });
    return () => {
      disconnectSocket();
    }
  }, [room, wordHistory]);

  useEffect(() => {
    if (timerSeconds <=0 && updatedTimer) {
      setOpenDialog(true);
    }
  }, [timerSeconds, updatedTimer])

  const handleClose = () => {
    setOpenDialog(false);
  };

  return (
    <div>
      <Typography variant="body1" className={classes.link}> Link :
          <Link href={window.location.href}> {window.location.href} </Link>
      </Typography>
      <FormControl component="fieldset">
        <RadioGroup aria-label="Role" name="role" value={guesserValue} onChange={guesserProps.onChange}>
          <FormControlLabel value="cluegiver" control={<Radio />} label="Clue Giver" />
          <FormControlLabel value="guesser" control={<Radio />} label="Guesser" />
        </RadioGroup>
      </FormControl>
      <div>
        <Button
          size="small"
          className={classes.restartButton}
          variant="contained"
          onClick={() => {sendCommand(room, "resetGame");}}>
            Restart Game
        </Button>
      </div>
      { guesserValue === "cluegiver" &&
        <Box display="flex" justifyContent="center">
          <Card className={classes.wordCard}>
            <Typography variant="h3" color="primary" className={classes.word}> 
              {word}
            </Typography>
          </Card>
        </Box>
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
      <p />
      <Typography variant="h5">{secondsToMs(timerSeconds)}</Typography>
      <InputTime
        key={initialTime}
        initialValue={initialTime}
        handleSubmit={(time) => sendCommand(room, "setTimer", time)} />
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
      <Dialog
        disableBackdropClick
        disableEscapeKeyDown
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Game Over! Success count was {counter}.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" autoFocus>
            Return
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Room;
