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
  sockets.push(socket);
  socket.thisUserId = userIdSeq++;
  
  socket.emit('userId', { userId: socket.thisUserId});          
  
  //add userEvent
  socket.on('userEvent', function (data) {
    data.thisUserId = socket.thisUserId;
    userEvents.push(data);
    console.log('userEvent' + data.thisUserId + ':' + data.cmdType + ' ' + data.cmdVal + ';' + userEvents.length);
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
        
   if (tempEvents.length > 0)
   {
      //send the response to all sockets
      for (var i = 0; i < sockets.length; i++)
      {
         sockets[i].emit('events', { events:  eventResponse });      
      }
   }
     
   //console.log('eventResponse:' + eventResponse);
  }, 100);
  

//