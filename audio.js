var fs = require('fs');
var Speaker = require('speaker');
var lame = require('lame');

//var speaker = new Speaker({	
//	channels: 1,
//	bitDepth: 16,
//	sampleRate: 11000
//});

//process.stdin.pipe(speaker)

//fs.createReadStream("r2d2-determined.mp3")
//	.pipe(new lame.Decoder())
//	.on('format', function(format){
//		this.pipe(new Speaker(format));
//	});




var Sound = require('node-aplay');
new Sound('R2D2c.wav').play();
