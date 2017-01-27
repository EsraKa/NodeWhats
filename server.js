var express = require('express');
var app = express();

app.use(express.static('public/upload'));

var server = require('http').Server(app);
var io = require('socket.io')(server);
var ent = require('ent');
var path = require('path');
var fs = require('fs');
var mongoConn = require('./js/MongoConn');

var Files = {};

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


  ////// BEGIN Upload //////
  socket.on('StartUpload', function (data) { //data contains the variables that we passed through in the html file
        var Name = data['Name'];
        Files[Name] = {  //Create a new Entry in The Files Variable
            FileSize : data['Size'],
            Data     : "",
            Downloaded : 0
        }
        var Place = 0;
        try{
            var Stat = fs.statSync('public/upload/' +  Name);
            if(Stat.isFile())
            {
                Files[Name]['Downloaded'] = Stat.size;
                Place = Stat.size / 524288;
            }
        }
        catch(er){} //It's a New File
        fs.open("public/upload/" + Name, "a", 0755, function(err, fd){
            if(err)
            {
                console.log(err);
            }
            else
            {
                Files[Name]['Handler'] = fd; //We store the file handler so we can write to it later
                socket.emit('MoreData', { 'Place' : Place, Percent : 0 });
            }
        });
});

  socket.on('Uploading', function (data){
        var Name = data['Name'];
        Files[Name]['Downloaded'] += data['Data'].length;
        Files[Name]['Data'] += data['Data'];
        if(Files[Name]['Downloaded'] == Files[Name]['FileSize']) //If File is Fully Uploaded
        {   
            fs.write(Files[Name]['Handler'], Files[Name]['Data'], null, 'Binary', function(err, Writen){
                socket.emit('Done', {'Upload' : Name })
            });
        }
        else if(Files[Name]['Data'].length > 10485760){ //If the Data Buffer reaches 10MB
            fs.write(Files[Name]['Handler'], Files[Name]['Data'], null, 'Binary', function(err, Writen){
                Files[Name]['Data'] = ""; //Reset The Buffer
                var Place = Files[Name]['Downloaded'] / 524288;
                var Percent = (Files[Name]['Downloaded'] / Files[Name]['FileSize']) * 100;
                socket.emit('MoreData', { 'Place' : Place, 'Percent' :  Percent});
            });
        }
        else
        {
            var Place = Files[Name]['Downloaded'] / 524288;
            var Percent = (Files[Name]['Downloaded'] / Files[Name]['FileSize']) * 100;
            socket.emit('MoreData', { 'Place' : Place, 'Percent' :  Percent});
        }
    });

});
////// END Upload //////

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
