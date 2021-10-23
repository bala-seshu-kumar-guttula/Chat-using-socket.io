const express = require('express');
const app = express();
const http = require('http');
const expressServer = http.createServer(app);
const { Server } = require("socket.io");
const path=require('path');


// linking socket server to express server
const io = new Server(expressServer, {
  cors: {
    origin: '*',
  }
});

// establising a connection for chat
io.on('connection', (socket) => {
  console.log('a user connected' + socket.handshake.query.roomId);
  // join using room id
  socket.join(socket.handshake.query.roomId);

  // listening messages from client
  socket.on("message", (res) => {
    res.source = "received";
    // broadcasting message from backend to all the clients
    socket.broadcast.emit("message", res)
  })
});

// for testing purpose for the backend
app.get('/', (req, res) => {
  res.send({
    app: "chat-backend"
  });
});

// Server listening
// expressServer.listen(3000, () => {
//   console.log('listening on *:3000');
// });

expressServer.listen(process.env.PORT || 3000,()=>{console.log('server is running on port number 3000')});

app.use(express.static(path.join(__dirname,'../dist')));