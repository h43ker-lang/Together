const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('video-event', (data) => {
    // Broadcast video control events to other users
    socket.broadcast.emit('video-event', data);
  });

  socket.on('webrtc-offer', (data) => {
    socket.broadcast.emit('webrtc-offer', data);
  });

  socket.on('webrtc-answer', (data) => {
    socket.broadcast.emit('webrtc-answer', data);
  });

  socket.on('webrtc-ice-candidate', (data) => {
    socket.broadcast.emit('webrtc-ice-candidate', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
