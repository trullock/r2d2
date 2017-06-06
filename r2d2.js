var express = require('express');
var Sound = require('node-aplay');
var bodyParser = require('body-parser');
var exec = require('child_process').exec;

var GPIO = require('./lib/gpio.js');
var Logic = require('./lib/logic.js');
var Voice = require('./lib/voice.js');

var Droid = function(gpio){

	var me = {
		frontPSI: new Logic({ 'red': 38, 'blue': 40 }),
		rearPSI: new Logic({ 'yellow': 32, 'green': 36 }),
		logic: new Logic({ 'a': 13, 'b': 15, 'c': 29, 'd': 31, 'e': 33, 'f': 35, 'g': 37 }),
		frontHolo: new Logic({ 'white': 7 }),
		voice: new Voice({
			'happy': 'R2D2a.wav',
			'angry': 'R2D2c.wav',
			'chirp': 'R2D2d.wav'
		})
	}
	
	me.behaviour = {
		idle: function(){
			me.frontPSI.solid('blue');
			me.rearPSI.solid('green');
			me.logic.random(200);
		},
		
		chirp: function(){
			me.frontPSI.cycle(100);
			me.rearPSI.cycle(100);
			me.logic.all();
			me.voice.say('chirp');
			
			setTimeout(function(){
				me.behaviour.idle();
			}, 2000);
		},
		
		celebrate: function(){
			me.frontPSI.cycle(100);
			me.rearPSI.cycle(100);
			me.voice.say('happy');
			
			setTimeout(function(){
				me.behaviour.idle();
			}, 2000);
		},
		
		complain: function(){
			me.frontPSI.solid('red');
			me.rearPSI.solid('yellow');
			me.voice.say('angry');
			
			setTimeout(function(){
				me.behaviour.idle();
			}, 2000);
		}
	}
	
	me.init = function(){
		return Promise.all([
			me.frontPSI.init(),
			me.rearPSI.init(),
			me.logic.init(),
			me.frontHolo.init(),
			me.speak.init()
		]);
	}
	
	return me;
};

var r2d2 = new Droid(new GPIO());
var r2Ready = r2d2.init();






var app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.get('/jquery-3.1.2-pre-custom.js', function(req, res){
	res.sendFile(__dirname + '/jquery-3.1.2-pre-custom.js');
});

app.post('/psi/:location', function(req, res){
	
	console.log(req.params);
	
	var psi;
	switch(req.params.location){
		case "front":
			psi = r2d2.frontPSI;
			break;
		case "rear":
			psi = r2d2.rearPSI;
			break;
	}
	
	switch(req.body.mode) {
		case "off":
			psi.off();
			break;
		case "red":
		case "blue":
		case "yellow":
		case "green":
			psi.solid(req.body.mode);
			break;
		case "all":
			psi.all();
			break;
		case "cycleFast":
			psi.cycle(200);
			break;
		case "cycleSlow":
			psi.cycle(800);
			break;
		case "random":
			psi.random(200);
			break;
	}
	
	res.sendStatus(200);
});


app.post('/logic', function(req, res){
	
	switch(req.body.mode) {
		case "off":
			r2d2.logic.off();
			break;
		case "all":
			r2d2.logic.all();
			break;
		case "cycleFast":
			r2d2.logic.cycle(200);
			break;
		case "cycleSlow":
			r2d2.logic.cycle(800);
			break;
		case "random":
			r2d2.logic.random(200);
			break;
	}
	
	res.sendStatus(200);
});

app.post('/behave', function(req, res){
	var mood = req.body.mood;
	
	switch(mood){
		case "celebrate":
			r2d2.behaviour.celebrate();
			break;
	}
	res.sendStatus(200);
});

app.post('/speak', function(req, res){
	var message = req.body.message;
	
	switch(message){
		case "happy":
		case "angry":
		case "chirp":
			r2d2.voice.say(message);
			break;
	}
	
	res.sendStatus(200);
});

app.post('/speak/volume', function(req, res){
	var vol = parseInt(req.body.volume, 10);
	
	r2d2.voice.volume(vol);
	
	res.sendStatus(200);
});


var server = app.listen(8080, function (){
	var host = server.address().address;
	var port = server.address().port;
	
	console.log('Listening on ' + host + ':' + port);
});