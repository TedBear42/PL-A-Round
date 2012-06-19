var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  , gr = require('./public/gameRule')

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
var pendingSockets = [];

var userEvents = [];
var userIdSeq = 1;


io.sockets.on('connection', function (socket) {
	
  //add socket to array
  

  //sockets.push(socket);
  pendingSockets.push(socket);
  
  //add userEvent
  socket.on('userEvent', function (data) 
  {
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
   //handle possible new ships
   if (pendingSockets.length > 0)
   {
   
   	var snapPendingSocket = pendingSockets;
   	pendingSockets = [];
   
   	for (var i = 0; i < snapPendingSocket.length; i++)
		{
			//publish existing ships to pending clients
			for (var j = 0; j < gameRules.ships.length;j++)
			{
				snapPendingSocket[i].emit('existingShip', {shipId:gameRules.ships[j].shipId, pointingDeg:gameRules.ships[j].pointingDeg, imgIndex:gameRules.ships[j].imgIndex, leftPressed:gameRules.ships[j].leftPressed, rightPressed:gameRules.ships[j].rightPressed, xPos:gameRules.ships[j].xPos, yPos:gameRules.ships[j].yPos, xv:gameRules.ships[j].xv, yv:gameRules.ships[j].yv, upPressed:gameRules.ships[j].upPressed});          
			}
			
			//add snapPendingSockets to the master array
  			sockets.push(snapPendingSocket[i]);
  		}
   
   	for (var i = 0; snapPendingSocket.length; i++)
   	{
   		var socket = snapPendingSocket[i];
		   		
		   socket.thisUserId = userIdSeq++;
				
		   var xPos = Math.random() * 400 + 200;
		   var yPos = Math.random() * 400 + 200;
				  
  			var imgIndex = (socket.thisUserId%3+1);
   	
   		//send new ship information to clients new and old
  			for (var j = 0; j < sockets.length; i++)
			{
				sockets[j].emit('newShip', { userId: socket.thisUserId, x: xPos, y:yPos, imgIndex:imgIndex});          
			}
		
		   //send new ship information to server engine
			gameRules.newShip(snapPendingSocket[i].thisUserId, xPos, yPos, data.imgIndex);
   	}
   }
     
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
   
   //send events to server engine
   gameRules.tickArray.push(dataArray);
	gameRules.tickArray.push(dataArray);
	gameRules.tickArray.push(dataArray);
     
   //console.log('eventResponse:' + eventResponse);
  }, 200);
  
setTimeout('gameRules.tick()', 50);
//