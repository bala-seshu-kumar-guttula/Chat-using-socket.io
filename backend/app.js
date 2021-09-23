const express = require('express');
const app = express();
const http = require('http');
const expressServer = http.createServer(app);
const { Server } = require("socket.io")
const io = new Server(expressServer, {
  cors: {
    origin: '*',
  }
});


io.on('connection', (socket) => {
  console.log('a user connected' + socket.handshake.query.roomId);
  socket.join(socket.handshake.query.roomId);
  socket.on("message", (res) => {
    res.source = "received";
    socket.broadcast.emit("message", res)
  })
});
app.get('/', (req, res) => {
  res.send({
    app: "chat-backend"
  });
});
expressServer.listen(3000, () => {
  console.log('listening on *:3000');
});