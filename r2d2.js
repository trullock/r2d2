var Droid = require('./lib/droid.js');
var Server = require('./lib/server.js');

console.log(Droid);

var r2d2 = Droid();
var server = Server(r2d2);
		
var r2Ready = r2d2.init();

r2Ready
	.then(_ => r2d2.behaviour.idle())
	.then(_ => server.start());
