"use strict";

var Service, Characteristic, HomebridgeAPI;

const httpreq = require("axios");


module.exports = function(homebridge) {

  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  HomebridgeAPI = homebridge;
  homebridge.registerAccessory("homebridge-tube-light", "TubeLight", TubeLight);
}



function TubeLight(log, config) {
  this.log = log;
  this.name = config.name;
  this.onLink = config.onLink;
  this.offLink = config.offLink;
  this.statusLink = config.statusLink;
  this.tubeName= config["tube_name"] || this.name;
  this.tubeState = false;
  this.log("Starting a Tubelight  with name '" + this.tubeName + "'...");

}
TubeLight.prototype.getPowerOn = function(callback) {
	
  httpreq.get(this.statusLink)
  .then(response => {

  if(response.data == "ON" || response.data == "1"){
		this.log("'%s' status is ON",this.tubeName);
		this.tubeState = true;
	}else if(response.data == "OFF" || response.data == "0"){
		this.log("'%s' status is OFF",this.tubeName);
		this.tubeState = false;
	}else{
		this.log("The TubeLight accessory returns Invalid data");
	}
		
   
  })
  .catch(error => {
    this.log(error);
  });	
  var powerOn = this.tubeState > 0;
  callback(null, powerOn);
}

CeilingFan.prototype.setPowerOn = function(powerOn, callback) {
	
if(powerOn){	
	  httpreq.get(this.onLink)
	  .then(response => {
		if(response.data == "ON" || response.data == "1"){
		this.log("'%s' is set to ON",this.tubeName);
		this.tubeState = true;
	}
	  })
	  .catch(error => {
		this.log(error);
	  });}
  else{
	 httpreq.get(this.offLink)
  .then(response => {
     if(response.data == "OFF" || response.data == "0"){
		this.log("'%s' is set to OFF",this.tubeName);
		this.tubeState = false;
	}
  })
  .catch(error => {
    this.log(error);
  }); 
  }	
   callback(null);
}

TubeLight.prototype.getServices = function() {
    var tubeService = new Service.LightBulb(this.name);
    
    tubeService
      .getCharacteristic(Characteristic.On)
      .on('get', this.getPowerOn.bind(this))
      .on('set', this.setPowerOn.bind(this));
    
    return [tubeService];
}

