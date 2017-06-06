exports = function(pins){

	var timerInterval,
		alternateColorIndex;
	
	var colors = [];
	
	for(var color in pins) {
		if(!pins.hasOwnProperty(color)) continue;
		colors.push(color);
	}
			
	function allColors(delegate){
		var promises = [];
		
		for(var i = 0; i < colors.length; i++)
			promises.push(delegate(i, colors[i], pins[colors[i]]));
		
		return Promise.all(promises);
	} 
	
	function init(){
		return allColors(function(i, color, pin){
			return gpio.init(pins[colors[i]]).then(function() {
				return gpio.mode(pins[colors[i]], 'output');
			});
		});
	}
	
	function reset(){
		clearInterval(timerInterval);
		
		return allColors(function(i, color, pin) {
			return off(color);
		});
	}
	
	function on(color){
		return gpio.set(pins[color]);
	}
	
	function off(color){
		return gpio.unset(pins[color]);
	}
	
	return {
		
		init: function(){
			return init().then(function(){
				return reset();
			});
		},
		
		off: function(){
			return reset();
		},
		
		solid: function(color) {
			if(!pins.hasOwnProperty(color))
				throw Error('Color ' + color + ' not recognised');
			
			reset().then(function(){
				on(color);
			});
		},
		
		all: function(){
			reset();
			
			allColors(function(i, color, pin){
				on(color);
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
	};
};
