var btn1 = require('@amperka/button')
  .connect(BTN1, {
    normalSignal: 0
  });

function Temp(powerPin, signalPin){
  this.powerPin = powerPin;
  this.signalPin = signalPin;
  
  this.init();
}

Temp.prototype.init = function(){
  this.powerPin.mode('output');
  this.powerPin.write(false);
  
  this.signalPin.mode('analog');
};

Temp.prototype.read = function(){
  this.powerPin.write(true);
  console.log(analogRead(this.signalPin));
  this.powerPin.write(false);
};

var sensor = new Temp(P13, A0);

btn1.on('release', function() {
  sensor.read();
});