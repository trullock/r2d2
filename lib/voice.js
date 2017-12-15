var Sound = require('node-aplay');
var exec = require('child_process').exec;

module.exports = function(_phrases){
	var phrases = {}
	for(var p in _phrases){
		if(!_phrases.hasOwnProperty(p))
			continue;
		
		phrases[p] = new Sound(_phrases[p]);
	}
	
	
	return {
		init: function(){
			return new Promise(function(resolve) { resolve(); });
		},
		
		say: function(phrase){
			if(!phrases.hasOwnProperty(phrase))
				throw new Error('Phrase `' + phrase + '` not recognised');
			
			phrases[phrase].play();
		}
	}
}
