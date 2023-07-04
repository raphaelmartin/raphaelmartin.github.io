const express = require('express');
const socketio = require('socket.io');
const http = require('http');

// Le serveur
const app = express();
const server = http.Server(app);

app.use(express.static('public'));

// socket.io (voir autre?)
const io = socketio(server);

let connectedUsers = [];

io.on('connection', (socket) => {
  connectedUsers.push(socket.id);
  const otherUsers = connectedUsers.filter(socketId => socketId !== socket.id);
  socket.emit('other-users', otherUsers);

  // offre
  socket.on('offer', (socketId, description) => {
    socket.to(socketId).emit('offer', socket.id, description);
  });

  // réponse
  socket.on('answer', (socketId, description) => {
    socket.to(socketId).emit('answer', description);
  });

  // 'signaling'
  socket.on('candidate', (socketId, candidate) => {
    socket.to(socketId).emit('candidate', candidate);
  });

  socket.on('disconnect', () => {
    connectedUsers = connectedUsers.filter(socketId => socketId !== socket.id);
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

server.listen(process.env.PORT || 80,
  () => console.log('Server Listen On: *:', process.env.PORT || 80));