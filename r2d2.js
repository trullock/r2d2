var Droid = require('./lib/droid.js');
var Server = require('./lib/server.js');

var r2d2 = new Droid();
var server = new Server(r2d2);
		
var r2Ready = r2d2.init();

r2Ready
	.then(_ => r2d2.behaviour.idle())
	.then(_ => server.start());
