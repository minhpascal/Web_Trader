// Connects REQ socket to tcp://localhost:5555
var log4js = require('log4js');
var logger = log4js.getLogger('OMS');

var zmq = require('zmq');
var pjson = require('../package.json');

var list = [];
var x = 0;

var that;
var orderId;

function OMS(_app) {
	that = this;
	this.app = _app;
	if (pjson.next_order_id) {
		this.orderId = pjson.next_order_id;
	}
	else {
		this.orderId = 1;
	}
	this.map = {};
	this.mapInstruments = {};
};

OMS.prototype.getOrderId = function(callback) {
	logger.info("order id", this.orderId);
	return this.orderId++;
};

OMS.prototype.get = function(id) {
	return this.map[id];
};

OMS.prototype.addBlockTradeReport = function(id, blockTradeReport) {
	logger.info("add trade report", id);
	this.map[id] = blockTradeReport;
};

OMS.prototype.getAllTradeReport = function() {
	logger.info("getAllTradeReport");
	var list = [];
	for (var key in this.map) {
	  if (this.map.hasOwnProperty(key)) {
		  list.push(this.map[key]);
		  console.log(key + " -> " + this.map[key]);
	  }
	}
	return list;
};

OMS.prototype.getAllInstrument = function() {
	logger.info("getAllInstrument");
	var list = [];
	for (var key in this.mapInstruments) {
			list.push(key);
//			console.log(key + " -> " + this.mapInstruments[key]);
	}
	return list;
};

OMS.prototype.addInstrument = function(symbol, status) {
	logger.info("add instrument ", symbol, status);
	this.mapInstruments[symbol] = status;
};

module.exports = OMS;
