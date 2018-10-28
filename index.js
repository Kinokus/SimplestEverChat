jQuery(document).ready(function ($) {
    // let socket = io.connect('http://46.182.31.65:8080');
    const socket = io.connect('http://127.0.0.1:3001');
    let sendMessage = function () {

        socket.send($('#message-to-send').val());

    };

    socket.on('connect', function () {

        $('#send-message-to-server').click(sendMessage);
        // $('#get-messages-from-server').click(getMessages);

        socket.on('message', function (msg) {
            console.log(msg);
            switch (msg.event) {
                case '' : {
                    break
                }
                case 'messageSent' : {
                    // todo add time, status, whatever
                    $('#messages-got-from-server').append('<span class="msg-main">' + msg.text + '</span>');
                    break
                }
                case 'userSplit' : {

                    break
                }
                case 'userJoined' : {

                    break
                }
                case 'connected' : {

                    break
                }
                case 'messageReceived' : {
                    // todo add time, status, whatever
                    $('#messages-got-from-server').append('<span class="msg-echo">' + msg.text + '</span>');
                    break
                }
                default: {

                    break
                }
            }


        });

    });


});