function TemperatureSensor(options) {
	this.vIn = options.vIn || 5; //default in voltage
	this.r = options.r || 10000; // second resistor

	this.powerPin = options.powerPin;
	this.signalPin = options.signalPin;

	if (options.initializePins) {
		this.initializePins();
	}
}

TemperatureSensor.prototype.initializePins = function () {
	this.powerPin.mode('output');
	this.powerPin.write(false);

	this.signalPin.mode('analog');
};

TemperatureSensor.prototype.read = function () {
	this.powerPin.write(true);
	var result = analogRead(this.signalPin);
	this.powerPin.write(false);
	return result;
};

TemperatureSensor.prototype.getResistence = function () {
	var vOut = this.read() * this.vIn;
	var rT = (this.vIn - vOut) * this.r / vOut;
	return rT;
};

exports.connect = function (options) {
	return new TemperatureSensor(options);
};