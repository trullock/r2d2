var ws281x = require('rpi-ws281x-native');

module.exports = function(options){

	var numLeds = options.rear[2];
	var data = new Uint32Array(numLeds);

	function setFrontLogic(){
		for(var i = 0; i < 32; i++) {
			var color = Math.random() > 0.5 ? 0xffffff : 0x0000ff;
			var on = Math.random() > 0.5;
			data[i] = on ? color : 0x000000;
		}
	}

	function setRearLogic(){
		for(var i = 32; i < 80; i++) {
			var color = Math.random();
			if(color > 0.66)
				color = 0xff0000;
			else if(color > 0.33)
				color = 0x00ff00;
			else
				color = 0xffff00;
			
			var on = Math.random() > 0.5;
			data[i] = on ? color : 0x000000;
		}
	}
	
	function init(){
		return new Promise(function(resolve){					
			ws281x.init(numLeds);
			ws281x.setBrightness(16);
			resolve();
		});
	}

	var timerHandle = null;
	
	function reset(){
		return new Promise(function(resolve){
			clearInterval(timerHandle);
			resolve();
		});
	}
	
	function animate(interval){
		timerHandle = setInterval(function(){
			setFrontLogic();
			setRearLogic();
			ws281x.render(data);
		}, interval);
	}
	
	return {
		init: function(){
			return init().then(function(){
				reset();
			}
		},
		
		off: function(){
			return reset();
		},
		
		random: function(interval){
			return animate(interval);
		}
	}
};