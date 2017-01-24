var app = require('express')()
var server = require('http').createServer(app)
var io = require('socket.io').listen(server)
var ent = require('ent')
var fs = require('fs');
var mongoConn = require('./js/MongoConn');

app.get('/', function(req, res) {
 res.sendFile(__dirname + '/views/index.html');
});

app.get('/css/style.css', function(req, res) {
  res.sendFile(__dirname + '/css/style.css');
});

app.get('/js/app.js', function(req, res) {
  res.sendFile(__dirname + '/js/app.js');
});



io.sockets.on('connection', function(socket) {

socket.on('nouveau_client', function (pseudo) {
  pseudo = ent.encode(pseudo);
  socket.pseudo = pseudo;
  socket.broadcast.emit('nouveau_client', pseudo);
  mongoConn.createUser(pseudo)
});

socket.on('message', function (message) {
  message = ent.encode(message);
  socket.broadcast.emit('message', {
    pseudo: socket.pseudo,
    message: message
  });
  mongoConn.postMessage(socket.pseudo,message)
});


});
  server.listen(8000);
