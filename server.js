const mongo = require('mongodb').MongoClient;
const client = require('socket.io').listen(4000).sockets;

// Connect to mongodb
mongo.connect('mongodb://127.0.0.1/roomiechat', function(err, db) {
  if (err) {
    throw err;
  }

  console.log('MongoDB connected...');
  // Connect to socket.io
  client.on('connection', function(socket) {
    let chat = db.collection('chats');
    let chores = db.collection('chores');

    // Create function to send status
    sendStatus = function(s) {
      socket.emit('status', s); // emit passes something from server to client
    }

    // Get chores from mongo collection
    chores.find().toArray(function(err, res) {
      if (err) {
        throw err;
      }

      // Emit roomies assigned to chores
      socket.emit('output', res);
    });

    // Get chats from mongo collection
    chat.find().limit(100).sort({_id:1}).toArray(function(err, res) {
      if (err) {
        throw err;
      }

      // Emit messages
      socket.emit('output', res);
    });

    // Handle input events
    socket.on('input', function(data) {
      let name = data.name;
      let message = data.message;

      let chorePerson = data.chorePerson;

      // Check for name and message
      if ((name === '' || message === '') && chorePerson === '') {
        // Send error
        sendStatus('Invalid or missing information!');
      } else {
        if (chorePerson !== '') {
          chores.insert({chorePerson: chorePerson}, function() {
            client.emit('output', [data]);

            // Send status object
            sendStatus({
              message: 'Chore assigned',
              clear: true; 
            });
          });
        } else {
          // Insert message into database
          chat.insert({name: name, message: message}, function(){
            client.emit('output', [data]);

            // Send status object
            sendStatus({
              message: 'Message sent',
              clear: true
            });
          });
        }
      }
    });

    // Handle clear
    socket.on('clear', function(data) {
      // Remove all chats from collection
      chat.remove({}, function() {
        // Emit event letting client know that everything has been cleared
        socket.emit('cleared');
      });
    });
  });
});
