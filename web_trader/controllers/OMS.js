// Connects REQ socket to tcp://localhost:5555
var log4js = require('log4js');
var Instrument = require('../models/Instrument');

var logger = log4js.getLogger('OMS');


var zmq = require('zmq');
var pjson = require('../package.json');

var list = [];
var x = 0;

var that;
var orderId;
var tradeId;

function OMS(_app) {
	that = this;
	this.app = _app;
	if (pjson.next_order_id) {
		this.orderId = pjson.next_order_id;
	}
	else {
		this.orderId = 1;
	}
	if (pjson.next_trade_id) {
		this.tradeId = pjson.next_trade_id;
	}
	else {
		this.tradeId = 1;
	}
	
	this.map = {};
	this.mapInstruments = {};
	this.mapAccounts = {};
};

OMS.prototype.getOrderId = function(callback) {
	logger.info("order id", this.orderId);
	return this.orderId++;
};

OMS.prototype.getTradeId = function(callback) {
	logger.info("trade id", this.tradeId);
	return this.tradeId++;
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
		  logger.debug('key ', key, this.map[key]);
	  }
	}
	return list;
};

OMS.prototype.getAllInstrument = function() {
	logger.info("getAllInstrument");
	var list = [];
	for (var key in this.mapInstruments) {
		list.push(key.json());
//			console.log(key + " -> " + this.mapInstruments[key]);
	}
	return list;
};

OMS.prototype.addInstrument = function(symbol, status, type, expiry) {
	logger.info("add instrument ", symbol, status);
	this.mapInstruments[symbol] = new Instrument(symbol, status, type, expiry);
};

OMS.prototype.getAllAccounts = function() {
	logger.info("getAllAccounts");
	var list = [];
	for (var key in this.mapAccounts) {
		list.push(this.mapAccounts[key]);
//			console.log(key + " -> " + this.mapInstruments[key]);
	}
	return list;
};

OMS.prototype.addAccount = function(code, account) {
	logger.info("add account ", code, account);
	this.mapAccounts[code] = account;
};


module.exports = OMS;
