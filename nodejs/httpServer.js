var http = require('http');

var server = http.createServer(function(req, res) {
   res.writeHead(200, {'context-type': 'text/plain'});
   res.end("hello world\n");
});

server.listen(8000);