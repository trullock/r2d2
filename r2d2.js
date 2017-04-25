var gpio = require('pi-gpio');
var express = require('express');

var app = express();

var state = 0;


var r2d2 = (function(){

	var logicGPIOPins = [11, 12, 13, 15, 16];
	var frontPSI_red_GPIOPin = 18;
	var frontPSI_blue_GPIOPin = 22;
	
	function randomCycle(pins, delay) {
		for(var p = 0; p < pins.length; p++)
			gpio.open(pins[p], 'output');
		
		return setInterval(function(){
			for(var p = 0; p < pins.length; p++) {
				var on = Math.random >= 0.5;
				gpio.write(pins[p], on ? 1 : 0;)
			}
		}, delay);
	}
	
	
	var frontLogicCycleInterval;
	
	return {
		logic: {
			cycle: function(mode){
				if(mode == 'start'){
					frontLogicCycleInterval = randomCycle(logicGPIOPins, 200);
				} else {
					clearInterval(frontLogicCycleInterval);
				}
				
			}
		},
		frontPSI: {
			solid: function(color){
				if(color == 'red'){
					gpio.write(frontPSI_red_GPIOPin, 1);
					gpio.write(frontPSI_blue_GPIOPin, 0);
				} else {
					gpio.write(frontPSI_red_GPIOPin, 0);
					gpio.write(frontPSI_blue_GPIOPin, 1);
				}
			}
		}
		rearPSI: {
			
		}
	}

}());


r2d2.frontPSI.solid('red');


app.post('/logic/:mode', function(req, res){
	
	r2d2.frontLogic.cycle(req.params.mode)
		
	res.send(req.params.state);
});

app.get('/state', function(req, res){
	res.send(state + '');
	
});

var server = app.listen(8080, function (){
	var host = server.address().address;
	var port = server.address().port;
	
	console.log('Listening on ' + host + ':' + port);
});