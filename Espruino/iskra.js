//iskraJS has onboard button so we will use it for test purpose.
//import button module and instantiate button on BTN1 pin
var btn1 = require('@amperka/button').connect(BTN1, {
	normalSignal: 0 // released button produces 0. pressed button produces 1.
});

//import t-sensor module and instantiate sensor.
//sensor requires at least 2 options provided.
var sensor = require('t-sensor').connect({
	powerPin: P13, //digital output pin. it will power up the cirquit when measurement is requested
	signalPin: A0 //analog input pin. it will measure the voltage on the pin when measurement is requested
});

//run some code when button is pressed and then released
btn1.on('release', function () {
	//get temperature
	var temperature = sensor.getTemperature();
	//format value and output to console
	console.log(`${temperature.toFixed(2)} C`);
});
