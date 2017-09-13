var GPIO = require('./gpio.js');
var Logic = require('./logic.js');
var Voice = require('./voice.js');

module.exports = function(){
	
	var gpio = new GPIO();

	// the main Droid public object
	var me = {
		frontPSI: new Logic(gpio, { 'red': 40, 'blue': 38 }),
		rearPSI: new Logic(gpio, { 'yellow': 16, 'green': 18 }),
		logic: new Logic(gpio, { 'a': 13, 'b': 15, 'c': 29, 'd': 31, 'e': 33, 'f': 35, 'g': 37 }),
		
		frontHolo: new Logic(gpio, { 'white': 7 }),
		
		voice: new Voice({
			'happy': 'lib/R2D2a.wav',
			'angry': 'lib/R2D2c.wav',
			'chirp': 'lib/R2D2d.wav'
		})
	}
	
	// Behaviour module
	me.behaviour = {
		
		// Behave idly
		idle: function(){
			//me.frontPSI.solid('blue');
			//me.rearPSI.solid('green');
			//me.logic.random(200);
		},
		
		// Make a quick quip/chirp
		quip: function(){
			me.frontPSI.cycle(100);
			me.rearPSI.cycle(100);
			me.logic.all();
			me.voice.say('chirp');
			
			setTimeout(function(){
				me.behaviour.idle();
			}, 2000);
		},
		
		// Do a celebration!
		celebrate: function(){
			me.frontPSI.cycle(100);
			me.rearPSI.cycle(100);
			me.voice.say('happy');
			
			setTimeout(function(){
				me.behaviour.idle();
			}, 2000);
		},
		
		// Kick off
		complain: function(){
			me.frontPSI.solid('red');
			me.rearPSI.solid('yellow');
			me.voice.say('angry');
			
			setTimeout(function(){
				me.behaviour.idle();
			}, 2000);
		}
	}
	
	// Inits all the components
	me.init = function(){
		return Promise.all([
			me.frontPSI.init(),
			me.rearPSI.init(),
			me.logic.init(),
			me.frontHolo.init(),
			me.voice.init()
		]);
	}
	
	return me;
};
