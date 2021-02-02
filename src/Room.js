import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { initiateSocket, disconnectSocket,
  subscribeToMessage, sendCommand } from './Socket';

const Room = (props) => {
  let location = useLocation();
  let room = location.pathname;
  const [word, setWord] = useState("");
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    if (room) initiateSocket(room);
    subscribeToMessage((err, data) => {
      if(err) return;
      if (data.type === "wordUpdate") {
        setWord(data.data);
      }
    });
    return () => {
      disconnectSocket();
    }
  }, [room]);
  
  return (
    <div>
      <h3> This is the room page for: {room} </h3>
      <h2> Word: {word} </h2>
      <h3> Counter: {counter} </h3>
      <button onClick={() => {setCounter(0)}}>Reset Counter</button>
      <button onClick={() => {setCounter(counter + 1); sendCommand(room, "success")}}>Success</button>
      <button onClick={() => {sendCommand(room, "skip")}}>Skip</button>
    </div>
  );
};

export default Room;
