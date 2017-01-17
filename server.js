/**
 * Created by Esra on 16/01/2017.
 */

var app = require('express')()
var server = require('http').createServer(app)
var io = require('socket.io').listen(server)
var ent = require('ent')
var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;

app.get('/', function(req, res) {
  res.sendfile(__dirname + './views/index.html');
});


MongoClient.connect("mongodb://localhost/tutoriel", function(error, db) {
  if(error)
    return funCallback(error);

  console.log("connecté a la base");
});


server.listen(8080);
