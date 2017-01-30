// Variables used with the upload system
var SelectedFile; 
var FReader;


var socket = io.connect('http://' + document.domain + ':'+ location.port);

var pseudo = prompt('Quel est votre pseudo ?');
socket.emit('nouveau_client', pseudo);
document.title = pseudo + ' - ' + document.title;


socket.on('message', function(data) {
  insereMessage(data.pseudo, data.message)

});

  $('#zone_users').append('<p>' + pseudo + '</p>');


$('#formulaire_chat').submit(function () {
  var text = parseEmoji($('#message').val());
  var time = getTime();
  var message = time + " " + text;

  if ($('#message').val()) { //prevent to send empty messages
    socket.emit('message', message);
    insereMessage(pseudo, message);
    $('#message').val('').focus();
    window.scrollTo(0,document.body.scrollHeight); //scroll to the bottom of the page
    return false;
  }
  return false;
});

function insereMessage(pseudo, message) {

  $('#zone_chat').append(' <div class="row"><div class="col-md-6" style="background: #fff; border-radius: 0px 5px 5px 5px;padding-top: 5px; margin-top: 10px; padding-bottom: 5px; padding-left: 5px; padding-right: 5px; margin-left: 5px;">' + pseudo + '<br> ' + message +' </div> <div class="col-md-6"> </div></div></br>');
}

function parseEmoji(message) { //Emoji system that parse the entered text, to replace some text by an emoji
  var arraySplitText = message.split(" ");
  var text = "";
  for ( var i = 0 ; i < arraySplitText.length; i++) {
    if (arraySplitText[i] == ":)") {
      arraySplitText[i] = "😁";
    }
    if (arraySplitText[i] == ":(") {
      arraySplitText[i] = "😞";
    }
    if (arraySplitText[i] == ":p") {
      arraySplitText[i] = "😋";
    }

    text += arraySplitText[i] + " ";
  }
  return text;
}

function getTime() {
  var time = new Date();
  var text = '[' + addZero(time.getHours())+':'+addZero(time.getMinutes())+':'+addZero(time.getSeconds()) + ']';
  return text;
}

function addZero(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

function onClickUpload() { //Button to toggle the visibility of the upload system
  if(document.getElementById("UploadBox").style.visibility == "visible") {
    document.getElementById("UploadBox").style.visibility='hidden';
  }
  else {
    document.getElementById("UploadBox").style.visibility='visible';
  }
}

function onCLickButton(emoji){ //function that will add the sended emoji in the message text
  var text = document.getElementById("message").value;
  document.getElementById("message").value = text + emoji;
}

function clickEmoji() { //toggle visibility of emoji button
  if(document.getElementById('emoji').style.visibility == "visible") {
    document.getElementById("emoji").style.visibility='hidden';
  }
  else {
    document.getElementById("emoji").style.visibility='visible';
  }
}


///// Upload files ////
function StartUpload(){
    if(document.getElementById('FileBox').value != "")
    { 
        FReader = new FileReader();
        Name = SelectedFile.name;

        var Content = ' <div class="progress" id=progressbar><div class="progress-bar" role="progressbar" aria-valuenow="0"aria-valuemin="0" aria-valuemax="100" style="width:0%">0%</div></div>'

        Content += "<span id='Uploaded'> En cours de transfert... <span id='MB'>0</span> / " + Math.round(SelectedFile.size / 1048576) + " Mo</span>";
        document.getElementById('UploadArea').innerHTML = Content;
        FReader.onload = function(evnt){
            socket.emit('Uploading', { 'Name' : Name, Data : evnt.target.result });
        }
        socket.emit('StartUpload', { 'Name' : Name, 'Size' : SelectedFile.size });
    }
    else {
        alert("Veuillez choisir un fichier.");
    }
}


window.addEventListener("load", Ready); //Once the page is loaded.

function Ready(){ 
    if(window.File && window.FileReader){ //These are the relevant HTML5 objects that we are going to use 
        document.getElementById('FileBox').addEventListener('change', FileChosen);
    }
    else {
        document.getElementById('UploadArea').innerHTML = "Veuillez mettre à jour votre navigateur Internet.";
    }
}

function FileChosen(evnt) { //File chosen with the upload button selector
    SelectedFile = evnt.target.files[0];
}


function UpdateBar(percent){ //refresh the progress bar during the upload
  var MBDone = Math.round(((percent/100.0) * SelectedFile.size) / 1048576); //1024 * 1024 = MegaByte
  document.getElementById('MB').innerHTML = MBDone;
  document.getElementById('progressbar').innerHTML = '<div class="progress-bar" role="progressbar" aria-valuenow="'+ (Math.round(percent*100)/100) +'"aria-valuemin="0" aria-valuemax="100" style="width:'+ (Math.round(percent*100)/100) +'%">'+ (Math.round(percent*100)/100) +'%</div>';
}

socket.on('MoreData', function (data){ //send more data
  UpdateBar(data['Percent']);
  var Place = data['Place'] * 524288; //The next blocks starting position
  var NewFile; //The variable that will hold the new block of data
  if(SelectedFile.slice) 
      NewFile = SelectedFile.slice(Place, Place + Math.min(524288, (SelectedFile.size-Place)));
  else
      NewFile = SelectedFile.slice(Place, Place + Math.min(524288, (SelectedFile.size-Place)));
  FReader.readAsBinaryString(NewFile);
});

socket.on('Done', function (data){ //Once the file is uploaded
    document.getElementById('UploadArea').innerHTML = "<p>Upload OK !</p>";
    document.getElementById('message').value = 'http://' + document.domain + ':'+ location.port + "/" + data['Upload'];

    document.getElementById("UploadArea").innerHTML = '<label for="FileBox">Choisissez un fichier à partager : </label><input type="file" id="FileBox"><br><button  type="button" id="UploadButton" class="Button" onclick="StartUpload()">Partager</button>';
    document.querySelector('#FileBox').addEventListener('change', FileChosen); //To fix a bug. 
});