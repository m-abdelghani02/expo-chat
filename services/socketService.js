import * as io from 'socket.io-client';

let socket;

//const connect = (token) => {
  if (socket) return; // Avoid reconnection attempts
  socket = io('http://your-server-address', { // Replace with your server address
    //query: { token }, // Include authentication token in query
  });

  socket.on('connect', () => {
    console.log('Connected to socket server');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from socket server');
    socket = null; // Clear socket reference
  });

  socket.on('newMessage', (messageData) => {
    console.log('Received new message:', messageData);
  });
//};

const emit = (eventName, data) => {
  if (socket) {
    socket.emit(eventName, data);
  } else {
    console.log('Socket not connected, cannot emit event:', eventName);
  }
};

const disconnect = () => {
  if (socket) socket.disconnect();
  socket = null;
};

export { socket, connect, emit, disconnect };
