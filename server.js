const mongo = require('mongodb').MongoClient;
const client = require('socket.io').listen(4000).sockets;
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

var db;

let chore1;
let chore2;
let chore3;
let chore4;

// Connect to mongodb
mongo.connect('mongodb://jesspeng:Whackmypinata10@ds131814.mlab.com:31814/roomiechat', function(err, client) {
  if (err) {
    throw err;
  }

  db = client.db('roomiechat');
  app.listen((process.env.PORT || 3000), function() {
    console.log('listening on 3000');
  });

  console.log('MongoDB connected...');

  chore1 = db.collection('chore1');
  chore2 = db.collection('chore2');
  chore3 = db.collection('chore3');
  chore4 = db.collection('chore4');

  // Connect to socket.io
  client.on('connection', function(socket) {
    let chat = db.collection('chats');

    // Create function to send status
    sendStatus = function(s) {
      socket.emit('status', s); // emit passes something from server to client
    }

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

      // Check for name and message
      if (name === '' || message === '') {
        // Send error
        sendStatus('Invalid or missing information!');
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


app.get('/', function(req, res) {
  // res.send('Hello World');
  // res.sendFile(__dirname + '/index.html');
  // bad form sorry...
  chore1.find().toArray(function (err, result1) {
    chore2.find().toArray(function (err, result2) {
      chore3.find().toArray(function (err, result3) {
        chore4.find().toArray(function (err, result4) {
          // console.log(result);
          if (err) {
            throw err;
          }
          res.render('index.ejs', {
            chore1: result1,
            chore2: result2,
            chore3: result3,
            chore4: result4
          });

        })
      })
    })
  });
});

app.post('/chore1', function (req, res) {
   // console.log(req.body);

  chore1.save(req.body, function (err, result) {
    if (err) {
      throw err;
    }

    // console.log('saved to database');
    res.redirect('/');
  });
});

app.post('/chore2', function (req, res) {
   // console.log(req.body);

  chore2.save(req.body, function (err, result) {
    if (err) {
      throw err;
    }

    // console.log('saved to database');
    res.redirect('/');
  });
});

app.post('/chore3', function (req, res) {
   // console.log(req.body);

  chore3.save(req.body, function (err, result) {
    if (err) {
      throw err;
    }

    // console.log('saved to database');
    res.redirect('/');
  });
});

app.post('/chore4', function (req, res) {
   // console.log(req.body);

  chore4.save(req.body, function (err, result) {
    if (err) {
      throw err;
    }

    // console.log('saved to database');
    res.redirect('/');
  });
});
