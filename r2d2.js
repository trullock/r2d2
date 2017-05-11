var pi_gpio = require('pi-gpio');
var express = require('express');
var Sound = require('node-aplay');
var bodyParser = require('body-parser');

var GPIO = function(){
	return {
		mode: function(pin, mode){
			console.info('Configuring GPIO' + pin + ' to ' + mode);
		},
		
		set: function(pin) {
			console.log('Setting GPIO' + pin);
		},
		
		unset: function(pin) {
			console.log('Unsetting GPIO' + pin);
		}
	};
}

var r2d2 = function(gpio){

	var Logic = function(pins){
	
		var timerInterval,
			alternateColorIndex;
		
		var colors = [];
		
		for(var color in pins) {
			if(!pins.hasOwnProperty(color)) continue;
			colors.push(color);
		}
		
		
		function allColors(delegate){
			for(var i = 0; i < colors.length; i++)
				delegate(i, colors[i], pins[colors[i]]);
		} 
		
		allColors(function(i, color, pin) {
			gpio.mode(pin, 'output');
		});
		
		function reset(){
			clearInterval(timerInterval);
			allColors(function(i, color, pin) {
				off(color);
			});
		}
		
		function on(color){
			gpio.set(pins[color]);
		}
		
		function off(color){
			gpio.unset(pins[color]);
		}
		
		reset();
		
		return {
			off: function(){
				reset();
			},
			
			solid: function(color) {
				reset();
				
				if(!pins.hasOwnProperty(color))
					throw Error('Color ' + color + ' not recognised');
				
				on(color);
			},
			
			all: function(){
				reset();
				
				allColors(function(i, color, pin){
					this.solid(color);
				});
			},
			
			cycle: function(interval) {
				reset();
			
				alternateColorIndex = 0;
				timerInterval = setInterval(function() {
					off(colors[alternateColorIndex]);
					
					alternateColorIndex++;
					if(alternateColorIndex == colors.length)
						alternateColorIndex = 0;
					
					on(colors[alternateColorIndex]);
				}, interval);
			},
			
			random: function(interval) {
				reset();
				
				timerInterval = setInterval(function(){
					allColors(function(i, color, pin){
						var r = Math.random();
						if(r >= 0.5)
							on(color);
						else
							off(color);
					});
				}, interval);
			}
		}
	
	};
	
	var Voice = function(){
		
		var happy = new Sound('R2D2a.wav');
		
		
		return {
			happy: function(){
				happy.play();
			}
		}
	}
	
	return {
		frontPSI: new Logic({ 'red': 1, 'blue': 2 }),
		rearPSI: new Logic({ 'yellow': 3, 'green': 4 }),
		logic: new Logic({ 'a': 5, 'b': 6, 'c': 7, 'd': 8, 'e': 9, 'f': 10, 'g': 11 }),
		frontHolo: new Logic({ 'white': 12 }),
		speak: new Voice()
	}

}(new GPIO());






var app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.get('/jquery-3.1.2-pre-custom.js', function(req, res){
	res.sendFile(__dirname + '/jquery-3.1.2-pre-custom.js');
});

app.post('/psi/:location', function(req, res){
	
	var psi;
	switch(req.params.location){
		case "front":
			psi = r2d2.frontLogic;
			break;
		case "rear":
			psi = r2d2.rearLogic;
			break;
	}
	
	switch(req.body.mode) {
		case "off":
			psi.off();
			break;
		case "solid":
			psi.solid(req.body.color);
			break;
		case "all":
			psi.all();
			break;
		case "cycle":
			psi.cycle(req.body.interval || 200);
			break;
		case "random":
			psi.random(req.body.interval || 200);
			break;
	}
});

app.post('/speak', function(req, res){
	var message = req.body.message;
	
	switch(message){
		case "happy":
			r2d2.speak.happy();
			break;
	}
	res.sendStatus(200);
});


var server = app.listen(8080, function (){
	var host = server.address().address;
	var port = server.address().port;
	
	console.log('Listening on ' + host + ':' + port);
});