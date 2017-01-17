/**
 * Created by Esra on 16/01/2017.
 */

 var app = require('express')()
 var server = require('http').createServer(app)
 var io = require('socket.io').listen(server)
 var ent = require('ent')
 var fs = require('fs');
 var MongoClient = require('mongodb').MongoClient;
 var url = 'mongodb://localhost:27017/test';

 app.get('/', function(req, res) {
   res.sendFile(__dirname + '/Public/views/index.html');
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
  server.listen(8000);

});
