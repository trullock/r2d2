var ws281x = require('rpi-ws281x-native');

var numLeds = 48;
var data = new Uint32Array(numLeds);

function setFrontLogic(){
	for(var i = 0; i < 32; i++) {
		var color = Math.random() > 0.5 ? 0xffffff : 0x0000ff;
		var on = Math.random() > 0.5;
		data[i] = on ? color : 0x000000;
	}
}

ws281x.init(numLeds);

setInterval(function(){
	setFrontLogic();
	ws281x.render(data);
	
}, 250);