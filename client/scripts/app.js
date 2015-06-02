// YOUR CODE HERE:

var app = {
  // Initialize event listeners
  init: function() {
    $('.submit').on('click', function(event){
      event.preventDefault();
      // event.stopPropagation();
      // console.log(event);
      return app.handleSubmit();
      // return false;
    });

    $('#rooms').on('change', function(e) {
      var classToHide = $('#rooms').val();
      // hide everything
      app.clearMessages();
      // populate room input
      $('#room-field').val($('#rooms').val());
      // reveal select class
      if (classToHide === 'All') {
        app.showMessages();
      } else {
        $('.' + classToHide).show(400);
      }
    });  
  },

  // POST request, send messages to server 
  send: function(message){
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'http://127.0.0.1:3000/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        // console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  },

  // GET request fetches messages from server
  fetch: function(filter) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      // https://api.parse.com/1/classes/chatterbox
      url: 'http://127.0.0.1:3000/classes/messages',
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        // console.log('chatterbox: Messages received');
        console.log(data);
        app.processIncoming(data);
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to get message');
      }
    });
  },

  // handle the incoming data from fetch
  processIncoming: function(data){
    arr = data.results.reverse(); // to stack messages
    _.each(arr, function(elem){
      var room = app.sanitize(elem.roomname, 'room'); // concat strings with '-'
      var id = elem.objectId;

      // if there isn't a message in app.messages, add it
      // and send it to addMessages function
      // should prevent duplicate messages from being published
      if (! (id in app.messages)) {
        app.messages[id] = elem;
        app.addMessage(elem, room);
      } 
      // check if room is already in list
      // should prevent our drop down from having duplicates
      if (! (room in app.rooms)) {
        if (room !== undefined && room !== "" && room !== '**_Create_a_Room_**') {
          app.rooms[room] = room;
          $('#rooms')
           .append($('<option>', { room : room })
           .text(room)); 
        }
      }
    });
  },

  clearMessages: function() {
    return $('#chats').children().hide();
  },
  showMessages: function() {
    return $('#chats').children().show(400);
  },

  addMessage: function(message, room) {
    // {
    //   username: 'Mel Brooks',
    //   text: 'I didn\'t get a harumph outa that guy.!',
    //   roomname: 'lobby'
    // }
    var user = app.sanitize(message.username, 'room');
    var text = app.sanitize(message.text);
    var time = moment(message.createdAt).fromNow();
    var msg = $('<div>').addClass(room)
                        .html('<p> <span class="username '+user+
                          ' "><a href="#">'+ user + '</a></span> in ' + room +
                          ' <span class="timestamp">' + time +
                          '</span></p><p>' + text + '</p>');

    // check the message.room
    var $selector = $('#rooms').val();
    if ( $selector === 'All' || message.roomname === $selector) {
      $('#chats').prepend(msg);  
    }

    // add event listener
    var $friends = $('.friends');
    var $username = $('.username');

    $username.off();
    $username.on('click', function(d){
      var friend = d.target.textContent;
      if (! (app.friends[friend])) {
        app.friends[friend] = friend;
        $friends.append('<a href="#"><p class="friend">'+friend+'</p></a>');
        app.highlightListener();
      } else {
        $('#chats').find('.' + friend).removeClass('highlight-friend');
      }
    });

  },

  addRoom: function(roomName) {
    // var room = '<span>' + roomName + '</span>';
    // $('#roomSelect').append(room);
  },

  highlightListener: function() {
    var $friend = $('.friend');

    $friend.off();
    $friend.on('click', function(d){
      var friend = d.target.textContent;
      $('#chats').find('.' + friend).addClass('highlight-friend');
    });

  },

  // should get data from gui and turn it into message object
  // roomname doesn't seem to be working...
  handleSubmit: function() {
    // console.log('handleSubmit called');    
    var msg = {
      username: $('#username').val() || 'tyler travers',
      text: $('#message').val(),
      roomname: $('#room-field').val() || $('#rooms').val() // default is all
    };
    $('#message').val("");

    app.send(msg);

  },

  // remove injection stuff, flag for 'room' to remove whitespace for css
  sanitize: function(string, flag){
    if (typeof string === 'string') {
      if(flag === 'room'){
        return string.replace(/\W+/ig, '_');
      }
        return string.replace(/<.+>/ig, 'CENSORED');
    }
  },


  // a list of all of the chat rooms available
  rooms: {
    // default
    All: 'All'
  },
  // storage for messages, used in preventing duplicates
  messages: {

  },

  friends: {

  }
};

$(document).ready(function() {
  app.init();
  // setInterval(app.fetch, 2000);
});



// ---- To D0 ------// 

// figure out why weird stuff highlights








