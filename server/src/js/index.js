var express = require('express');
var path = require('path');
var data = require('./data');
var erp = require('./erp');
var bodyParser = require('body-parser')



var DATA_PATH = "../data/";
global.DATA_PATH = path.resolve(process.cwd(),DATA_PATH);


var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8080);

// Socket.io PART
io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('sendPosition',function(position){
  	console.log(position);
  	io.emit("newPosition",position);
  })
});


// MIDDLEWARE and ROUTER
app.use(bodyParser.json());
app.use('/static', express.static(__dirname +'/static'));
app.use("/data",data(io));
app.use("/erp", erp());



console.log("listen on 8080");






