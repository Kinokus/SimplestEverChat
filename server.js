const express = require('express');
const app = express();
const httpPort = 3000;
const socketPort  = 3001;
const bodyParser = require('body-parser');
const io = require('socket.io').listen(socketPort, function (data) {
    console.log(`Example socket listening on port ${socketPort}!`)
});

let globalMessages = [];


io.sockets.on('connection', function (socket) {
    const ID = (socket.id).toString().substr(0, 5); // simplest name
    const time = (new Date).toLocaleTimeString();
    socket.json.send({'event': 'connected', 'name': ID, 'time': time});
    socket.broadcast.json.send({'event': 'userJoined', 'name': ID, 'time': time});

    socket.on('message', function (msg) {
        const time = (new Date).toLocaleTimeString();
        socket.broadcast.json.send({'event': 'messageSent', 'name': ID, 'text': msg, 'time': time});
        socket.json.send({'event': 'messageReceived', 'name': ID, 'text': msg, 'time': time})
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