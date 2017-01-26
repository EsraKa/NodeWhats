var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var ent = require('ent');
var path = require('path');
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

app.get('/views/video.html', function(req, res) {
  res.sendFile(path.join(__dirname + '/views/video.html'));
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


var usr = [];
io.on('connection', function(socket){

  socket.emit('myId', usr.length);
  usr.push(usr.length);

  io.emit('createUsersVideo', usr);


  socket.on('part', function(data){
    socket.emit('part', data);
  });

  socket.on('updateImage', function(data){
    socket.broadcast.emit('updateImage',data);
  });

  socket.on('disconnect', function () {
    //TODO
  });
});
  server.listen(8000);
