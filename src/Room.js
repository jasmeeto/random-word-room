import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { initiateSocket, disconnectSocket,
  subscribeToMessage, sendCommand } from './Socket';

import InputTimer from './InputTimer';

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
      <h3> Copy room link : &nbsp; 
          <input class="link-input" type="text" value={window.location.href} />
      </h3>
      <form>
        <div >
          <label style={{margin:"5px"}}>
            <input
              value="cluegiver"
              checked={guesserValue === "cluegiver"}
              {...guesserProps}
            />
            Clue Giver
          </label>
          <label style={{margin:"5px"}}>
            <input
              value="guesser"
              checked={guesserValue === "guesser"}
              {...guesserProps}
            />
            Guesser
          </label>
        </div>
      </form>
      { guesserValue === "cluegiver" &&
        <h1 id="word-main"> {word} </h1>
      }
      <h3> Success Counter: {counter} </h3>
      <button onClick={() => {sendCommand(room, "resetCounter");}}>Reset Counter</button>
      <button onClick={() => {sendCommand(room, "success")}}>Success</button>
      <button onClick={() => {sendCommand(room, "skip")}}>Skip</button>
      <p />
      <InputTimer />
      <p />
      <h3>Your Word History</h3>
      <ul>
        {wordHistory.map((val, i, array) => {
          if (i===0) return;
          let revIndex = array.length - 1 - i;
          let revWord = array[revIndex];
          return <li key={revIndex}>{revWord}</li>
        })}
      </ul>
    </div>
  );
};

export default Room;
