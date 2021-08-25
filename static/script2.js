let name_user = prompt("Please enter your name :");
if (name_user != null) {
  var $messages = $('.messages-content'),
      d, h, m;
  let user_id = Math.floor(Math.random() * 9000).toString();
  let socket = io.connect('http://127.0.0.1:5000');
  $(window).load(function () {
    $messages.mCustomScrollbar();
  });

  function updateScrollbar() {
    $messages.mCustomScrollbar("update").mCustomScrollbar('scrollTo', 'bottom', {
      scrollInertia: 10,
      timeout: 0
    });
    console.log('asd')
  }

  socket.on('connect', function () {
    socket.emit('join', {name: name_user});
    $('.status').html('Online');
  });

  socket.on('join', function (data) {
    console.log(data)
    $('<div class="join">' + data['name'] + ' join in chat</div>').appendTo($('.mCSB_container'));
  });
  socket.on('istyping', function (data) {
    if (data['user_id'] != user_id) {
      $('.status').html('<div class="message loading"><span></span></div>');
      setTimeout(function () {
        $('.status').html('Online');
      }, 1000);
    }
  });

  function setDate() {
    d = new Date()
    if (m != d.getMinutes()) {
      m = d.getMinutes();
      $('<div class="timestamp">' + d.getHours() + ':' + m + '</div>').appendTo($('.message:last'));
    }
  }


  socket.on('delete', function (data) {
    $('#' + data['message_id']).remove();
    console.log(data['message_id'])
  });
  socket.on('message', function (msg) {
    if (msg['user_id'] == user_id) {
      $('<div class="message message-personal" id="' + msg["message_id"] + '" onclick="delete_message('+ msg['message_id'] +')">' + msg['message'] + '</div>').appendTo($('.mCSB_container')).addClass('new');
    } else {
      $('<div class="message new" id="' + msg["message_id"] + '"><div class="nameuser">' + msg['name'] + '</div>' + msg['message'] + '</div>').appendTo($('.mCSB_container')).addClass('new');
    }
    setDate();
    updateScrollbar();
  });

  function delete_message(message_id){
    socket.emit('delete', {message_id:message_id})
  }

  function insertMessage() {
    msg = $('.message-input').val();
    if ($.trim(msg) == '') {
      return false;
    }
    socket.emit('message', {name: name_user, message: msg, user_id: user_id});
    $('.message-input').val(null);
  }

  $('.message-submit').click(function () {
    insertMessage();
  });

  $(window).on('keydown', function (e) {
    if (e.which == 13) {
      insertMessage();
      return false;
    }
  })
  $('.message-input').keypress(function (){
    socket.emit('istyping', {name: name_user, user_id: user_id});
  })
}
else {
  alert('Name is required')
  location.reload()
}