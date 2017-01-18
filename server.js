/**
 * Created by Esra on 16/01/2017.
 */

var app = require('express')()
var server = require('http').createServer(app)
var io = require('socket.io').listen(server)
var ent = require('ent')
var fs = require('fs');
var moment = require('moment');
// var MongoClient = require('mongodb').MongoClient;
// var url = 'mongodb://localhost:27017/test';


app.get('/', function(req, res) {
 res.sendFile(__dirname + '/views/index.html');
});

app.get('/css/style.css', function(req, res) {
  res.sendFile(__dirname + '/css/style.css');
});


io.sockets.on('connection', function(socket) {

socket.on('nouveau_client', function (pseudo) {
  pseudo = ent.encode(pseudo);
  socket.pseudo = pseudo;
  socket.broadcast.emit('nouveau_client', pseudo);
});

socket.on('message', function (message) {
  message = ent.encode(message);
  socket.broadcast.emit('message', {
    pseudo: socket.pseudo,
    message: message
  });
});


// MongoClient.connect(url, function(err, database) {
//   if (err){
//     console.log("Could not connect to the database");
//   }else {
//     console.log("Connection established to the database and server");
//     collection = database.collection("Users");
//
//     collection.find({}).toArray(function(error,result){
//       if (err){
//         console.log("Could not fetch the users from the database");
//       }else {
//         console.log(result);
//       }
//     })
//   }

});
  server.listen(8000);

