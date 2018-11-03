jQuery(document).ready(function ($) {
  // let socket = io.connect('http://46.182.31.65:8080');
  const socket = io.connect(window.location.hostname + ':3001');
  let sendMessage = function () {
    
    let message = {};
    message.text = $('#message-to-send').val();
    message.nickFrom = $('#nick-current').val();
    
    socket.send(message);
    $('#message-to-send').val('');
  };
  
  let checkInput = (event) => {
    if (event.which === 13 && $('#message-to-send').val().length) {
      sendMessage();
    }
  };
  
  // $('.msg-string').load(function () {
  //   console.log(this);
  // })
  
  socket.on('connect', function () {
    let myId = (socket.id).toString().substr(0, 5);
    $('#name-current').text(myId);
    
    $('#send-message-to-server').click(sendMessage);
    $('#message-to-send').keypress(checkInput);
    
    
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
      if (msg.add) {
        let msgLine = $(`
                            <span class="msg-string" style="display: none">
                            <pre class="msg-time">[${msg.time}]</pre>
                            <span class="${msg.userClass}">${msg.nickFrom || msg.name}</span>
                            <span class="${msg.class}">${msg.text}</span>
                            </span>
                        `);
        $('#messages-got-from-server > .messages-list').append(msgLine);
        msgLine.hover(
          function () {
            // $(this).css({border: '0px solid green'});
            $(this).animate({height: '+=10px'}, 'fast');
            $(this).animate({fontSize: '+=10px'}, 'fast');
            
            // $(this).animate({borderWidth: '0px'});
            
          },
          function () {
            $(this).animate({height: '-=10px'}, 'fast');
            $(this).animate({fontSize: '-=10px'}, 'fast');
  
          });
        msgLine.show(1000);
        
      }
      if (msg.status) {
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
    
    $('#nick-current')
      .focus(function () {
        $(this).css({background: 'wheat'})
      })
      .blur(function () {
        $(this).css({background: 'none'})
      })
      .select(function () {
        let value = $(this).val();
        let start = $(this)[0].selectionStart;
        let end = $(this)[0].selectionEnd;
        let selectedValue = value.substr(start, end - start);
        
        console.log(selectedValue);
        
      })
    
    $('#nick-current').change(function () {
    })
    
    
    $('body')
      .on(
        {
          'click': function () {
            console.log(this);
            // $(this).slideToggle()
            // $(this).fadeTo(1000,0.3);
            // $(this).off('click');
            // $(this).trigger('my-event', ['a1', 'a2', 'a3']);
            $(this).css({border: '0px solid green'});
            $(this).animate({borderWidth: '+=5px', borderColor: 'red'}, 3000);
            $(this).animate({borderWidth: '0px'});
            
          },
          'my-event': function () {
            console.log('some event ', arguments[0], arguments[1], arguments[2]);
          }/*,
          'mouseEnter': function (event) {
            $(this).css({border:'0px solid green'});
            $(this).animate({borderWidth:'+=5px',borderColor:'red'}, 3000);
            $(this).animate({borderWidth:'0px'});
  
            // console.log($(event.relatedTarget));
          }*/
        },
        '.msg-string'
      );
    
    $("#send-message-to-server").hover(function (event) {
      console.log($(event.relatedTarget));
      $(event.relatedTarget).focus()
    });
    $("#form-send-to-server").hover(function (event) {
      $(event.relatedTarget).focus()
    });
    
    
    $('.messages-list').resize(function () {
      console.log(this);
    })
    
    
    // .select(function () {
    //   console.log($(this));
    // })
    //
    
    $('#nick-current').parent()
      .focusin(function () {
        $(this).css({border: '1px solid blue'})
      })
      .focusout(function () {
        $(this).css({border: '0px'})
      });
    
    
  });
  
  
});