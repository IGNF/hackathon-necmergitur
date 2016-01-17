var express = require('express');
var path = require('path');
var data = require('./data');
var erp = require('./erp');
var bodyParser = require('body-parser')
var cors = require('cors');



var DATA_PATH = "../data/";
global.DATA_PATH = path.resolve(process.cwd(),DATA_PATH);


var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8080);

var allPosition = {};

// Socket.io PART
io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('sendPosition',function(data){
  	console.log("Get Position from "+data.user);
  	allPosition[data.user] = data;
  	io.emit("newPosition",allPosition);
  })
});


// MIDDLEWARE and ROUTER
app.use(bodyParser.json());
app.use(cors());
app.use('/', express.static(__dirname +'/static'));
app.use("/data",function(req,res){
	res.json(allPosition).end();
});
app.use("/erp", erp.app());

console.log("Loading data...")
erp.import(function(err){
	if (err){
		console.log("Error :"+err)
	} else {
		console.log("Data loaded !")
	}
});


console.log("listen on 8080");






