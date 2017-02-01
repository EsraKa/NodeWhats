/**
 * Created by Esra on 01/02/2017.
 */

var socket = io.connect('http://' + document.domain + ':'+ location.port);
var video;
var id;

socket.on('createUsersVideo', function(usr){
  $('img').remove();
  $.each(usr, function(index, val) {
    if (val != id) {
      $('body').append('<img id='+val+'>');
    }
  });
});

socket.on('myId', function(myId){
  id = myId;
});

socket.on('updateImage', function(data){
  $('img[id='+data.id+']').attr('src',data.capture)
});

var points = [];

function setup() {
  c = createCanvas(320, 240);
  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();
  noStroke();
}


function draw(){
  image(video, 0, 0, 320, 240);

  if (mouseIsPressed){
    points.push({x:mouseX, y:mouseY})
  }
  fill("red");
  $.each(points, function(index, val) {
    ellipse(val.x, val.y, 5,5);
  });

  if (frameRate() > 55  && id != null) {
    socket.emit('updateImage',{id:id, capture:c.canvas.toDataURL()});
  }

}
