import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { initiateSocket, disconnectSocket,
  subscribeToMessage, sendCommand } from './Socket';

const Room = (props) => {
  let location = useLocation();
  let room = location.pathname;
  const [word, setWord] = useState("");
  const [wordHistory, setWordHistory] = useState([]);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    if (room) initiateSocket(room);
    subscribeToMessage((err, data) => {
      if(err) return;
      if (data.type === "initWord") { 
        setWord(data.data);
      }
      else if (data.type === "wordUpdate") {
        setWord(data.data);
        wordHistory.push(data.data);
        setWordHistory(wordHistory);
      }
    });
    return () => {
      disconnectSocket();
    }
  }, [room, wordHistory]);

  return (
    <div>
      <h3> This is the room page for: {room} </h3>
      <h2> Word: {word} </h2>
      <h3> Success Counter: {counter} </h3>
      <button onClick={() => {setCounter(0)}}>Reset Counter</button>
      <button onClick={() => {setCounter(counter + 1); sendCommand(room, "success")}}>Success</button>
      <button onClick={() => {sendCommand(room, "skip")}}>Skip</button>
      <h3>Local Word History</h3>
      <ul>
        {wordHistory.map((word, i) => {
          return <li key={i}>{word}</li>
        })}
      </ul>
    </div>
  );
};

export default Room;
