var GPIO = require('./gpio.js');
var Logic = require('./logic.js');
var PSI = require('./psi.js');
var Voice = require('./voice.js');

module.exports = function(){
	
	var gpio = new GPIO();

	// the main Droid public object
	var me = {
		frontPSI: new PSI(gpio, { 'red': 40, 'blue': 38 }),
		rearPSI: new PSI(gpio, { 'yellow': 16, 'green': 18 }),
		logic: new Logic({
			front: [0, 31],
			rear: [32, 79],
			gpio: 18
		}),
		
		frontHolo: new PSI(gpio, { 'white': 32 }),
		
		voice: new Voice({
			'happy': '/home/pi/r2d2/lib/R2D2a.wav',
			'angry': '/home/pi/r2d2/lib/R2D2c.wav',
			'chirp': '/home/pi/r2d2/lib/R2D2d.wav'
		})
	}
	
	// Behaviour module
	me.behaviour = {
		
		// Behave idly
		idle: function(){
			me.frontPSI.solid('blue');
			me.rearPSI.solid('green');
			me.frontHolo.off();
			me.logic.random(150);
		},
		
		// Make a quick quip/chirp
		quip: function(){
			me.frontPSI.cycle(100);
			me.rearPSI.cycle(100);
			me.frontHolo.cycle(100);
			me.logic.random(50);
			me.voice.say('chirp');
			
			setTimeout(function(){
				me.behaviour.idle();
			}, 2000);
		},
		
		// Do a celebration!
		celebrate: function(){
			me.frontPSI.cycle(100);
			me.rearPSI.cycle(100);
			me.frontHolo.cycle(100);
			me.logic.random(50);
			me.voice.say('happy');
			
			setTimeout(function(){
				me.behaviour.idle();
			}, 2000);
		},
		
		// Kick off
		complain: function(){
			me.frontPSI.solid('red');
			me.rearPSI.solid('yellow');
			me.frontHolo.cycle(100);
			me.logic.random(50);
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
