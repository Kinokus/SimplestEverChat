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
    // Т.к. чат простой - в качестве ников пока используем первые 5 символов от ID сокета
    const ID = (socket.id).toString().substr(0, 5);
    const time = (new Date).toLocaleTimeString();
    // Посылаем клиенту сообщение о том, что он успешно подключился и его имя
    socket.json.send({'event': 'connected', 'name': ID, 'time': time});
    // Посылаем всем остальным пользователям, что подключился новый клиент и его имя
    socket.broadcast.json.send({'event': 'userJoined', 'name': ID, 'time': time});
    // Навешиваем обработчик на входящее сообщение
    socket.on('message', function (msg) {
        const time = (new Date).toLocaleTimeString();
        // Уведомляем клиента, что его сообщение успешно дошло до сервера
        console.log(msg);
        socket.broadcast.json.send({'event': 'message', 'name': ID, 'text': msg, 'time': time});
        // Отсылаем сообщение остальным участникам чата
        socket.json.send({'event': 'messageReceived', 'name': ID, 'text': msg, 'time': time})
    });
    // При отключении клиента - уведомляем остальных
    socket.on('disconnect', function() {
        const time = (new Date).toLocaleTimeString();
        io.sockets.json.send({'event': 'userSplit', 'name': ID, 'time': time});
    });
});

app.use(express.static('.'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', (req, res) => res.send('Hello World!'));
app.get('/messages-from-server', (req, res) => res.send(globalMessages));
app.post('/message-from-ui', (req, res) => {
    globalMessages.unshift(req.body);
    globalMessages.length = 10;
    res.send({status:"got"})
});

app.listen(httpPort, () => console.log(`Example app listening on port ${httpPort}!`));