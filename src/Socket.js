import io from 'socket.io-client';

let socket;
export const initiateSocket = (room) => {
  //socket = io("http://localhost:5000");
  socket = io();
  console.log(`Connecting socket...`);
  if (socket && room) socket.emit('join', room);
}

export const disconnectSocket = () => {
  console.log('Disconnecting socket...');
  if(socket) socket.disconnect();
}

export const subscribeToMessage = (cb) => {
  if (!socket) return(true);
  socket.on('message', msg => {
    return cb(null, msg);
  });
}

export const sendCommand = (room, command, data) => {
  if (socket) socket.emit('command', { command:command, room:room, value:data });
}