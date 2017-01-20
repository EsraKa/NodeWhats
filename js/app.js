/**
 * Created by Esra on 20/01/2017.
 */
var socket = io.connect('http://localhost:8000');

var pseudo = prompt('Quel est votre pseudo ?');
socket.emit('nouveau_client', pseudo);
document.title = pseudo + ' - ' + document.title;


socket.on('message', function(data) {
  insereMessage(data.pseudo, data.message)

})


//socket.on('nouveau_client', function(pseudo) {
//  $('#zone_chat').append('<p><em>' + pseudo + ' a rejoint le Chat !</em></p>');
//})

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

function parseEmoji(message) {
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

