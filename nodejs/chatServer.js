var net = require('net')

var sockets = [];

var server = net.Server(function(socket) {

   sockets.push(socket);

   socket.write('hello\n');
   socket.write('world\n');
   
   socket.on('data', function(data){
      for (var i = 0; i < sockets.length; i++){
      
        if (sockets[i] != socket) 
        {        
	   sockets[i].write(data );
	}
      }
      
   });
   
   socket.on('end', function() {
      var i = sockets.indexOf(socket);
      sockets.splice(i,1);
   });
});

server.listen(8000);