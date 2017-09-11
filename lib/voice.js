var Sound = require('node-aplay');
var exec = require('child_process').exec;

module.exports = function(_phrases){
	
	var phrases = {}
	for(var p in _phrases){
		if(!_phrases.hasOwnProperty(p))
			continue;
		
		phrases[p] = new Sound(_phrases[p]);
	}
	
	function setVolume(percent){
		console.info('Setting volume to ' + percent + '%');
		
		return new Promise(function(resolve, reject){
			var child = exec('amixer set PCM ' + percent + '%', function(error, stdout, stderror) {
				if(error)
				{
					console.error('Error setting volume');
					console.error(error);
					reject(error);
				}
				else
					resolve();
			})
		});
	}		
	
	return {
		init: function(){
			return setVolume(100);
		},
		
		say: function(phrase){
			if(!phrases.hasOwnProperty(phrase))
				throw new Error('Phrase `' + phrase + '` not recognised');
			
			phrases[phrase].play();
		},
		
		volume: function(percent) {
			percent = Math.round(percent);
			
			return setVolume(percent);
		}
	}
}
