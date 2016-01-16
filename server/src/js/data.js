var express = require('express');
var fs = require('fs');

var data = {"name":"DataInfoGreffe","type":"FeatureCollection","features":[]};

module.exports = function(io){
	var app = express();

	app.post("/create",function(req,res){
		console.log("POST create position : "+JSON.stringify(req.body.coordinates));
		var newpos = {
			"type":"Feature",
			"geometry":{
			"type":"Point"
			},
		"properties":{}
		};
		newpos.coordinates = req.body;
		data.features.push(newpos);
		io.emit("createPosition",req.body);
	})

	return app;
}