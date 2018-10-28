jQuery(document).ready(function ($) {
    // let socket = io.connect('http://46.182.31.65:8080');
    const socket = io.connect('http://127.0.0.1:3001');
    let sendMessage = function () {

        socket.send($('#message-to-send').val());

    };

    socket.on('connect', function () {
        let myId = (socket.id).toString().substr(0, 5);
        $('#name-current').text(myId);

        $('#send-message-to-server').click(sendMessage);

        socket.on('message', function (msg) {
            // todo add time, status, whatever
            // todo check duplicated messages
            // todo templates
            // todo private messages
            // todo add color to message
            // todo send nick
            switch (msg.event) {
                case '' : {
                    break
                }
                case 'messageSent' : {
                    msg.userClass = 'user-main';
                    msg.class = 'msg-main';
                    msg.add = true;
                    msg.status = 'message got';
                    break
                }
                case 'userSplit' : {
                    console.log(msg);
                    msg.status = 'user logout';
                    break
                }
                case 'userJoined' : {
                    console.log(msg);
                    msg.status = 'user joined';
                    break
                }
                case 'connected' : {
                    console.log(msg);
                    break
                }
                case 'messageReceived' : {
                    msg.userClass = 'user-echo';
                    msg.class = 'msg-echo';
                    msg.add = true;
                    msg.status = 'message recieved by server from';
                    break
                }
                default: {
                    break
                }
            }
            if(msg.add) {
                $('#messages-got-from-server > .messages-list')
                    .append(`
                            <span class="msg-string">
                            <pre class="msg-time">[${msg.time}]</pre>
                            <span class="${msg.userClass}">${msg.name}</span>
                            <span class="${msg.class}">${msg.text}</span>
                            </span>
                        `);
            }
            if(msg.status){
                $('#status-got-from-server')
                    .html(`
                            <span class="msg-string">
                            <pre class="msg-time">[${msg.time}]</pre>
                            <span class="${msg.class}">${msg.status}</span>
                            <span class="${msg.userClass}">${msg.name}</span>
                            </span>
                        `)
            }



        });

    });


});