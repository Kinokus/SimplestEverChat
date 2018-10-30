const express = require('express');
const app = express();
const httpPort = 3000;
const socketPort = 3001;
const bodyParser = require('body-parser');

const stringify = require('json-stringify-safe');


const io = require('socket.io').listen(socketPort, function (data) {
  console.log(`Example socket listening on port ${socketPort}!`)
});

// todo sync messages

io.sockets.on('connection', function (socket) {
  
  
  console.log('====================================');
  // console.log(stringify(socket));
  console.log(socket.conn.request.client._peername.port,socket.conn.request.client._peername.address);
  
  
  const ID = (socket.id).toString().substr(0, 5); // simplest name
  const time = (new Date).toLocaleTimeString();
  socket.json.send({'event': 'connected', 'name': ID, 'time': time});
  socket.broadcast.json.send({'event': 'userJoined', 'name': ID, 'time': time});
  
  socket.on('message', function (msg) {
    let text = msg.text || msg;
    let nickFrom = msg.nickFrom || 'unknown';
    const time = (new Date).toLocaleTimeString();
    let message = {};
    message.name = ID;
    message.text = text;
    message.time = time;
    message.event = 'messageSent';
    message.nickFrom = nickFrom;
    socket.broadcast.json.send(message);
    message.event = 'messageReceived';
    socket.json.send(message);
  });
  
  socket.on('disconnect', function () {
    const time = (new Date).toLocaleTimeString();
    io.sockets.json.send({'event': 'userSplit', 'name': ID, 'time': time});
  });
});

app.use(express.static('.'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.listen(httpPort, () => console.log(`Example app listening on port ${httpPort}!`));