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

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// room model
let rooms = {}

io.on('connection', (socket) => {
  console.log(`Connected: ${socket.id}`);

  socket.on('disconnect', () =>
     console.info(`Disconnected: ${socket.id}`));

  socket.on('join', (room) => {
     console.log(`Socket ${socket.id} joining ${room}`);
     socket.join(room);
     if (!(room in rooms)) {
       rooms[room] = words[getRandomInt(words.length)];
     }
     io.to(room).emit('message', { type: "wordUpdate", data: rooms[room] });
  });

  socket.on('command', (data) => {
     const { command, room } = data;
     switch (command) {
       case "success":
       case "skip":
         rooms[room] = words[getRandomInt(words.length)];
         io.to(room).emit('message', { type: "wordUpdate", data: rooms[room] });
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