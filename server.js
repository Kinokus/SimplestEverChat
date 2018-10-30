const express = require('express');
const app = express();
const httpPort = 3000;
const socketPort  = 3001;
const bodyParser = require('body-parser');
const io = require('socket.io').listen(socketPort, function (data) {
    console.log(`Example socket listening on port ${socketPort}!`)
});

// todo sync messages

io.sockets.on('connection', function (socket) {
    const ID = (socket.id).toString().substr(0, 5); // simplest name
    const time = (new Date).toLocaleTimeString();
    socket.json.send({'event': 'connected', 'name': ID, 'time': time});
    socket.broadcast.json.send({'event': 'userJoined', 'name': ID, 'time': time});

    socket.on('message', function (msg) {
        let text = msg.text || msg;
        let nickFrom = msg.nick || 'anonimous';
        const time = (new Date).toLocaleTimeString();
        let message = {};
        message.name = ID;
        message.text = text;
        message.time = time;
        message.nickFrom = nickFrom;
        message.event = 'messageSent';
        socket.broadcast.json.send(message);
        message.event = 'messageReceived';
        socket.json.send(message);
    });

    socket.on('disconnect', function() {
        const time = (new Date).toLocaleTimeString();
        io.sockets.json.send({'event': 'userSplit', 'name': ID, 'time': time});
    });
});

app.use(express.static('.'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(httpPort, () => console.log(`Example app listening on port ${httpPort}!`));