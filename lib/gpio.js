var pi_gpio = require('pi-gpio');

module.exports = function(){
	return {
		init: function(pin) {
			console.info('Closing GPIO' + pin);
			return new Promise(function(resolve){
				pi_gpio.close(pin, function(){
					resolve()
				});
			});
		},
		
		mode: function(pin, mode){
			console.info('Configuring GPIO pin ' + pin + ' to ' + mode);
			return new Promise(function(resolve){
				pi_gpio.open(pin, mode, function(){
					resolve()
				});
			});
		},
		
		set: function(pin) {
			console.log('Setting GPIO pin ' + pin + ' high');
			
			return new Promise(function(resolve){
				pi_gpio.write(pin, 1, function(){
					resolve()
				});
			});
		},
		
		unset: function(pin) {
			console.log('Setting GPIO pin ' + pin + ' low');
			return new Promise(function(resolve){
				pi_gpio.write(pin, 0, function(){
					resolve()
				});
			});
		}
	};
}
