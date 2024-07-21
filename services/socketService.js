import { io } from 'socket.io-client';
import { authService } from '../services/authService.js';
export let socket;

export const connect = async () => {
  const user = await authService.getUser();
  const userId = user.id;
  socket = io('http://192.168.1.20:3000'); 
  socket.on('connect', () => {
    console.log('Connected to socket server');
    emit('setUserId', userId); // Send to server
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from socket server');
    socket = null; // Clear socket reference
  });

  socket.on('newMessage', (messageData) => {
    console.log('Received new message:', messageData);
  });
};

export const emit = (eventName, data) => {
  if (socket) {
    socket.emit(eventName, data);
  } else {
    console.log('Socket not connected, cannot emit event:', eventName);
  }
};

export const disconnect = () => {
  if (socket) socket.disconnect();
  socket = null;
};

export const on = (eventName, callback) => {
  if (socket) {
    socket.on(eventName, callback);
    console.log('Recieved event:', eventName);
  } else {
    console.log('Socket not connected, cannot listen for event:', eventName);
  }
};
