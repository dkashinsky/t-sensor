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

TemperatureSensor.prototype.getResistance = function () {
	var vOut = this.read() * this.vIn;
	var rT = (this.vIn - vOut) * this.r / vOut;
	return rT;
};

//reference data for ntc 10k 3435 1%
var referenceData = [
	//[temp C, resistance]
	[-40.0, 190953],
	[-35.0, 145953],
	[-30.0, 112440],
	[-25.0, 87285],
	[-20.0, 68260],
	[-15.0, 53762],
	[-10.0, 42636],
	[-5.0, 34038],
	[0.0, 27348],
	[5.0, 22108],
	[10.0, 17979],
	[15.0, 14706],
	[20.0, 12094],
	[25.0, 10000],
	[30.0, 8310.8],
	[35.0, 6941.1],
	[40.0, 5824.9],
	[45.0, 4910.6],
	[50.0, 4158.3],
	[55.0, 3536.2],
	[60.0, 3019.7],
	[65.0, 2588.8],
	[70.0, 2228.0],
	[75.0, 1924.6],
	[80.0, 1668.4],
	[85.0, 1451.3],
	[90.0, 1266.7],
	[95.0, 1109.2],
	[100.0, 974.26],
	[105.0, 858.33]
];

function getReferenceInterval(resistance) {
	var lastIndex = referenceData.length - 1;

	//out of bounds case
	if (resistance > referenceData[0][1] || resistance < referenceData[lastIndex][1]) {
		return null;
	}

	//regular case. resistance is in reference data
	for (var i = 0, ic = lastIndex; i < ic; i++) {
		var start = referenceData[i];
		var end = referenceData[i + 1];
		if (start[1] >= resistance && resistance >= end[1]) {
			return {
				r0: start[1],
				t0: start[0],
				r1: end[1],
				t1: end[0]
			};
		}
	}

	//bad case. reference data is not consistent
	return null;
}

function interpolate(x0, y0, x1, y1, x) {
	return y0 + (x - x0) * (y1 - y0) / (x1 - x0);
}

TemperatureSensor.prototype.getTemperature = function () {
	var r = this.getResistance();
	var segment = getReferenceInterval(r);
	if (segment) {
		return interpolate(segment.r0, segment.t0, segment.r1, segment.t1, r);
	}

	return null;
};

exports.connect = function (options) {
	return new TemperatureSensor(options);
};