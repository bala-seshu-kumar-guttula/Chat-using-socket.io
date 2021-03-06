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
}).listen(expressServer);

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
// app.get('/', (req, res) => {
//   res.send({
//     app: "chat-backend"
//   });
// });
app.use(express.static(path.join(__dirname,'../dist/task/')));
app.get('/*', function(req,res) {
    
  res.sendFile(path.join(__dirname+'/dist/task/index.html'));
  });

expressServer.listen(process.env.PORT || 3000,()=>{console.log('server is running on port number 3000')});



// Server listening
// expressServer.listen(3000, () => {
//   console.log('listening on *:3000');
// });

// app.use('socket',io);