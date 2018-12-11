(function() {
  var element = function(id) {
    return document.getElementById(id);
  }

  // Get elements (chat)
  var status = element('status');
  var messages = element('messages');
  var textarea = element('textarea');
  var username = element('username');
  var clearBtn = element('clear');

  // Set default status to blank
  var statusDefault = status.textContent;
  var setStatus = function(s) {
    // Set status
    status.textContent = s;

    // Send update message which disappears after 4 seconds
    if (s !== statusDefault) {
      var delay = setTimeout(function () {
        setStatus(statusDefault);
      }, 4000);
    }
  }

  // Connect to socket.io
  var socket = io.connect('http://127.0.0.1:4000');

  // Check for connection
  if (socket !== undefined) {
    console.log('Connected to socket.io...');

    // Handle output
    socket.on('output', function(data) {
      //console.log(data);
      if (data.length) {
        for (var x = 0; x < data.length; x++) {
          // build out message div to display name and chat
          var message = document.createElement('div');
          message.setAttribute('class', 'chat-message');
          message.textContent = data[x].name+": "+data[x].message;
          messages.appendChild(message);
          // insert new chat on top ie most recent to least recent
          messages.insertBefore(message, messages.firstChild);

        }
      }
    });

    // Get status from server
    socket.on('status', function(data) {
      // Get message status
      setStatus((typeof data === 'object') ? data.message : data);

      // check to see if status is clear-> clear text
      if (data.clear) {
        textarea.value = '';
      }
    });

    // Handle input, want event when typing message
    textarea.addEventListener('keydown', function(event) {
      if (event.which === 13 && event.shiftKey === false) { // 13 is return or enter
        // Emit to server input
        socket.emit('input', {
          name: username.value,
          message: textarea.value,
          //chorePerson: chorePerson.value;
        });

        event.preventDefault();
      }
    });

    username.addEventListener('keydown', function(event) {
      if (event.which === 13 && event.shiftKey === false) { // 13 is return or enter
        // Emit to server input
        socket.emit('input', {
          name: username.value,
          message: textarea.value,
          //chorePerson: chorePerson.value;
        });

        event.preventDefault();
      }
    });

    // Handle chat clear
    clearBtn.addEventListener('click', function() {
      socket.emit('clear');
    });

    // Clear message and username
    socket.on('cleared', function() {
      messages.textContent = '';
      username.innerHTML = '';
    });

  }

})();
