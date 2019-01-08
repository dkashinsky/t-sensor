var btn1 = require('@amperka/button').connect(BTN1, {
	normalSignal: 0
});

var sensor = require('t-sensor').connect({
	powerPin: P13,
	signalPin: A0
});

btn1.on('release', function () {
	console.log(sensor.read());
});