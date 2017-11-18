var express = require('express');
var bodyParser = require('body-parser');

module.exports = function(droid) {

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
			case 'front':
				psi = droid.frontPSI;
				break;
			case 'rear':
				psi = droid.rearPSI;
				break;
			default:
				// TODO: complain;
		}
		
		switch(req.body.mode) {
			case 'off':
				psi.off();
				break;
			case 'red':
			case 'blue':
			case 'yellow':
			case 'green':
				psi.solid(req.body.mode);
				break;
			case 'all':
				psi.all();
				break;
			case 'cycleFast':
				psi.cycle(200);
				break;
			case 'cycleSlow':
				psi.cycle(800);
				break;
			case 'random':
				psi.random(200);
				break;
			default:
				// TODO: complain;
		}
		
		res.sendStatus(200);
	});


	app.post('/logic', function(req, res){
		
		switch(req.body.mode) {
			case "off":
				droid.logic.off();
				break;
			case "all":
				droid.logic.all();
				break;
			case "cycleFast":
				droid.logic.cycle(200);
				break;
			case "cycleSlow":
				droid.logic.cycle(800);
				break;
			case "random":
				droid.logic.random(200);
				break;
			default:
				// TODO: complain;
		}
		
		res.sendStatus(200);
	});
	
	app.post('/holo', function(req, res){
		
		switch(req.body.mode) {
			case "off":
				droid.frontHolo.off();
				break;
			case "all":
				droid.frontHolo.all();
				break;
			case "cycleFast":
				droid.frontHolo.cycle(200);
				break;
			case "cycleSlow":
				droid.frontHolo.cycle(800);
				break;
			case "random":
				droid.frontHolo.random(200);
				break;
			default:
				// TODO: complain;
		}
		
		res.sendStatus(200);
	});

	app.post('/behave', function(req, res){
		var mood = req.body.mood;
		
		switch(mood){
			case 'celebrate':
				droid.behaviour.celebrate();
				break;
			case 'complain':
				droid.behaviour.complain();
				break;
			case 'quip':
				droid.behaviour.quip();
				break;
			default:
				// TODO: complain;
		}
		res.sendStatus(200);
	});

	app.post('/speak', function(req, res){
		var message = req.body.message;
		
		switch(message){
			case 'happy':
			case 'angry':
			case 'chirp':
				droid.voice.say(message);
				break;
		}
		
		res.sendStatus(200);
	});

	app.post('/speak/volume', function(req, res){
		var vol = parseInt(req.body.volume, 10);
		
		droid.voice.volume(vol);
		
		res.sendStatus(200);
	});

	return {
		start: function() {
			var server = app.listen(8080, function (){
				var host = server.address().address;
				var port = server.address().port;
				
				console.log('Listening on ' + host + ':' + port);
			});
		}
	};	
}