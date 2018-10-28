jQuery(document).ready(function ($) {
    // let socket = io.connect('http://46.182.31.65:8080');
    const socket = io.connect('http://127.0.0.1:3001');
    let sendMessage = function () {

        socket.send($('#message-to-send').val());

        // $.post('message-from-ui', {message:$('#message-to-send').val()}, function (data) {
        //     $('#status-got-from-server').html('<div>' + data.status + '</div>');
        //     getMessages();
        // })
    };

    // let getMessages = function () {
    //     $.get('messages-from-server', function (data) {
    //         console.log(data);
    //         $('#messages-got-from-server').empty();
    //         data.forEach(function (msg) {
    //             $('#messages-got-from-server')
    //                 .append('<span>' + msg.message + '</span>');
    //         })
    //     })
    // };

    socket.on('connect', function () {

        $('#send-message-to-server').click(sendMessage);
        // $('#get-messages-from-server').click(getMessages);

        socket.on('message', function (msg) {
            console.log(msg);
            switch (msg.event) {
                case '' : {
                    break
                }
                case 'message' : {
                    $('#messages-got-from-server').append('<span>' + msg.message + '</span>');
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
                    $('#messages-got-from-server').append('<span class="msg-echo">' + msg.message + '</span>');
                    break
                }
                default: {

                    break
                }
            }


        });

    });


});