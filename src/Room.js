import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { initiateSocket, disconnectSocket,
  subscribeToMessage, sendCommand } from './Socket';

import InputTimer from './InputTimer';

const Room = (props) => {
  let location = useLocation();
  let room = location.pathname;
  const [word, setWord] = useState("");
  const [wordHistory] = useState([]);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    if (room) initiateSocket(room);
    subscribeToMessage((err, data) => {
      if(err) return;
      if (data.type === "initWord" || data.type === "wordUpdate") { 
        wordHistory.push(data.data);
        setWord(data.data);
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
      <h1 id="word-main"> {word} </h1>
      <h3> Success Counter: {counter} </h3>
      <button onClick={() => {setCounter(0)}}>Reset Counter</button>
      <button onClick={() => {setCounter(counter + 1); sendCommand(room, "success")}}>Success</button>
      <button onClick={() => {sendCommand(room, "skip")}}>Skip</button>
      <p />
      <InputTimer />
      <p />
      <h3>Your Word History</h3>
      <ul>
        {wordHistory.map((val, i, array) => {
          let revIndex = array.length - 1 - i;
          let revWord = array[revIndex];
          return <li key={revIndex}>{revWord}</li>
        })}
      </ul>
    </div>
  );
};

export default Room;
