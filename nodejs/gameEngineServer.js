var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(8000);

function handler (req, res) 
{
  
  fs.readFile(__dirname + '/public' + req.url,
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

var sockets = [];
var userEvents = [];
var userIdSeq = 1;

io.sockets.on('connection', function (socket) {
	
  //add socket to array
  
  socket.thisUserId = userIdSeq++;

  var xPos = Math.random() * 400 + 200;
  var yPos = Math.random() * 400 + 200;
  
  var imgIndex = (socket.thisUserId%3+1);
  
  socket.emit('userId', { userId: socket.thisUserId, x: xPos, y:yPos, imgIndex:imgIndex});          
  
  for (var i = 0; i < sockets.length; i++)
  {
  	sockets[i].emit('newShip', { userId: socket.thisUserId, x: xPos, y:yPos, imgIndex:imgIndex});          
  }
  
  sockets.push(socket);
  
  //add userEvent
  socket.on('userEvent', function (data) {
    data.thisUserId = socket.thisUserId;
    userEvents.push(data);
    console.log('userEvent' + data.thisUserId + ':' + data.cmdType + ' ' + data.cmdVal + ';' + userEvents.length);
  });
  
  //ReportExisting Status
  socket.on('existingShip', function(ship)
  {
     for (var i = 0; i < sockets.length; i++)
     {
	sockets[i].emit('existingShip', {shipId:ship.shipId, pointingDeg:ship.pointingDeg, imgIndex:ship.imgIndex, leftPressed:ship.leftPressed, rightPressed:ship.rightPressed, xPos:ship.xPos, yPos:ship.yPos, xv:ship.xv, yv:ship.yv, upPressed:ship.upPressed});          
     }
  });
  
  //Remove socket
  socket.on('end', function() 
  {
     var i = sockets.indexOf(socket);
     sockets.splice(i,1);
  });
  
  
  
  
});

//send out events every second
setInterval(function() 
{
     
   var eventResponse = [];
     
   //switch the references
   
   tempEvents = userEvents;
   userEvents = [];
     
   //create the response
   for (var i = 0; i < tempEvents.length; i++)
   {
      eventResponse.push({userId: tempEvents[i].thisUserId ,cmdType: tempEvents[i].cmdType ,cmdVal: tempEvents[i].cmdVal  });
   }
        
   //send the response to all sockets
   for (var i = 0; i < sockets.length; i++)
   {
      sockets[i].emit('events', { events:  eventResponse });      
   }
     
   //console.log('eventResponse:' + eventResponse);
  }, 200);
  

//