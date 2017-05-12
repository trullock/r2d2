var pi_gpio = require('pi-gpio');
var express = require('express');
var Sound = require('node-aplay');
var bodyParser = require('body-parser');

var GPIO = function(){
	return {
		mode: function(pin, mode){
			console.info('Configuring GPIO' + pin + ' to ' + mode);
			pi_gpio.open(pin, mode);
		},
		
		set: function(pin) {
			console.log('Setting GPIO' + pin);
			pi_gpio.write(pin, 1);
		},
		
		unset: function(pin) {
			console.log('Unsetting GPIO' + pin);
			pi_gpio.write(pin, 0);
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
		var alert = new Sound('R2D2c.wav');
			
		
		return {
			happy: function(){
				happy.play();
			},
			alert: function(){
				alert.play();
			}
		}
	}
	
	return {
		frontPSI: new Logic({ 'red': 38, 'blue': 40 }),
		rearPSI: new Logic({ 'yellow': 32, 'green': 36 }),
		logic: new Logic({ 'a': 13, 'b': 15, 'c': 29, 'd': 31, 'e': 33, 'f': 35, 'g': 37 }),
		frontHolo: new Logic({ 'white': 7 }),
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
			psi.random(400);
			break;
	}
	
	res.sendStatus(200);
});

app.post('/speak', function(req, res){
	var message = req.body.message;
	
	switch(message){
		case "happy":
			r2d2.speak.happy();
			break;
		case "alert":
			r2d2.speak.alert();
			break;
	}
	res.sendStatus(200);
});


var server = app.listen(8080, function (){
	var host = server.address().address;
	var port = server.address().port;
	
	console.log('Listening on ' + host + ':' + port);
});