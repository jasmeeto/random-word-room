const path = require("path");
const express = require("express");
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const words = require("./public/words.json");

const PORT = process.env.PORT || 5000;

// add middlewares
app.use(express.static(path.join(__dirname, "..", "build")));
app.use(express.static("public"));

app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "..", "build", "index.html"));
});

// GLOBALS

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateIndexArr(wordsArr) {
  return [...Array(wordsArr.length).keys()];
}

// Fisher-Yates mutating random iterator
function getNextRandomIndex(indexArr) {
  if (indexArr.length <= 0) return -1;
  let j = getRandomInt(0, indexArr.length-1);

  //swap
  let ret = indexArr[j];
  indexArr[j] = indexArr[indexArr.length-1];
  indexArr.pop();

  return ret;
}

function genRoomInfo() {
  return {
    indexArr: generateIndexArr(words),
    currIndex: -1,
    sucessCount: 0,
    initialTime: 30,
    timerSeconds: 30
  };
}

function getNextWord(room) {
  let roomInfo = rooms[room];
  let wordIndex = getNextRandomIndex(roomInfo.indexArr);
  if (wordIndex === -1) {
    rooms[room] = genRoomInfo();
    roomInfo = rooms[room];
    wordIndex = getNextRandomIndex(roomInfo.indexArr);
  }
  roomInfo.currIndex = wordIndex;
  return words[wordIndex];
}

function getCount(room) {
  let roomInfo = rooms[room];
  return roomInfo.sucessCount;
}

function getCurrWord(room) {
  let roomInfo = rooms[room];
  return words[roomInfo.currIndex];
}

function getCurrTime(room) {
  let roomInfo = rooms[room];
  return roomInfo.timerSeconds;
}

function getInitialTime(room) {
  let roomInfo = rooms[room];
  return roomInfo.initialTime;
}

function updateCount(room, count) {
  let roomInfo = rooms[room];
  return roomInfo.sucessCount = count;
}

function updateAndEmitCount(room, count=-1) {
  if (!(room in rooms)) {
    rooms[room] = genRoomInfo();
  }
  if (count > -1) {
    updateCount(room, count);
  } else {
    updateCount(room, rooms[room].sucessCount + 1);
  }
  io.to(room).emit('message', { type: "counterUpdate", data: getCount(room) });
}

function updateAndEmitWord(room) {
  if (!(room in rooms)) {
    rooms[room] = genRoomInfo();
  }
  io.to(room).emit('message', { type: "wordUpdate", data: getNextWord(room) });
}

function setTimer(room, value) {
  if (!(room in rooms)) {
    rooms[room] = genRoomInfo();
  }
  let roomInfo = rooms[room];
  roomInfo.initialTime = value;
  roomInfo.timerSeconds = roomInfo.initialTime;
  io.to(room).emit("message", {type:'timerSet', data:roomInfo.timerSeconds});
  if (roomInfo.currTimer) clearInterval(roomInfo.currTimer);
}

function updateAndStartTimer(room) {
  if (!(room in rooms)) {
    rooms[room] = genRoomInfo();
  }
  let roomInfo = rooms[room];
  roomInfo.timerSeconds = roomInfo.initialTime;
  io.to(room).emit("message", {type:'timerUpdate', data:roomInfo.timerSeconds});
  if (roomInfo.currTimer) clearInterval(roomInfo.currTimer);
  var gameCountDown = setInterval(function() {
    roomInfo.timerSeconds = roomInfo.timerSeconds - 1;
    io.to(room).emit("message", {type:'timerUpdate', data:roomInfo.timerSeconds});
    if (roomInfo.timerSeconds <= 0) {
      io.to(room).emit("message", {type:'gameOver', data: roomInfo.sucessCount});
      clearInterval(gameCountDown);
      if (roomInfo.currTimer) delete roomInfo.currTimer;
    }
  }, 1000); // countdown in seconds
  roomInfo.currTimer = gameCountDown;
}
// room model
let rooms = {}

// < /GLOBALS>

io.on('connection', (socket) => {
  console.log(`Connected: ${socket.id}`);

  socket.on('disconnect', () =>
     console.info(`Disconnected: ${socket.id}`));

  socket.on('join', (room) => {
     console.log(`Socket ${socket.id} joining ${room}`);
     socket.join(room);
     if (!(room in rooms)) {
       rooms[room] = genRoomInfo();
       getNextWord(room);
     }
     io.to(room).emit('message', { type: "wordInit", data: getCurrWord(room)});
     io.to(room).emit('message', { type: "timerInit", data: getInitialTime(room)});
     io.to(room).emit('message', { type: "timerSet", data: getCurrTime(room)});
     io.to(room).emit('message', { type: "counterUpdate", data: getCount(room)});
  });

  socket.on('command', (data) => {
      const { command, room, value } = data;
      switch (command) {
        case "success":
          updateAndEmitCount(room);
          updateAndEmitWord(room);
          break;
        case "skip":
          updateAndEmitWord(room);
          break;
        case "resetGame":
          updateAndEmitCount(room, 0);
          updateAndStartTimer(room);
          break;
        case "setTimer":
          setTimer(room, value);
          break;
        default:
          console.error("invalid command " + command);
      }
  });
});

// start express server on port 5000 or env PORT variable
http.listen(PORT, () => {
  console.log("server started on port 5000");
});


