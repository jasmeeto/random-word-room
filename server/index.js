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
  return {indexArr: generateIndexArr(words), currIndex: -1};
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
     io.to(room).emit('message', { type: "initWord", data: words[rooms[room].currIndex]});
  });

  socket.on('command', (data) => {
      const { command, room } = data;
      switch (command) {
        case "success":
        case "skip":
          io.to(room).emit('message', { type: "wordUpdate", data: getNextWord(room)});
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
