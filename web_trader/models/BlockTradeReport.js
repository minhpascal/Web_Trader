/**
 * http://usejsdoc.org/
 */
var log4js = require('log4js');
var logger = log4js.getLogger('Blocktradereport');
var moment = require('moment')
var TradeReport = require('./TradeReport')

function BlockTradeReport() {
	logger.debug('create Blocktradereport')
};

// Constructor
function BlockTradeReport(id, refId, status, trType, symbol, qty, delta, price, strat, buyer, seller, futMat, remark, inputTime, tradeId, multiplier, legs) {
	this.id = id;
	this.refId = refId;
	this.group = 1;
	this.status = status;
	this.trType = trType;
	this.symbol = symbol;
	this.qty = qty;
	this.delta = delta;
	this.price = price;
	this.strat = strat;
	this.buyer = buyer;
	this.seller = seller;
	this.remark = remark;
	this.futMat = futMat;
	this.inputTime = moment(new Date(inputTime)).format('HH:mm:ss.SSS');
	this.tradeId = tradeId;
	this.multiplier = multiplier;
	
	this.legs = [];
	for (i=0; i<legs.length; i++) 
	{
		var jsonStr = legs[i];
    	this.legs.push(new TradeReport(jsonStr.Instrument, jsonStr.UL, '', jsonStr.Strike,
			jsonStr.Expiry, jsonStr.Price, jsonStr.Qty, jsonStr.Buyer,
			jsonStr.Seller, jsonStr.Group, jsonStr.Status, jsonStr.Remark,
			jsonStr.TrType, jsonStr.LastUpdateTime));		
	}
};

// class methods
BlockTradeReport.prototype.updateGroup = function(group, status, remark, trType, lastUpdateTime) {
	logger.debug('updateGroup: ', group, status, remark, trType, lastUpdateTime);
	for (var i=0; i<this.legs.length; i++) {
		var leg = this.legs[i];
		if (leg.group === group) {
			leg.status = status;
			leg.remark = remark;
			leg.trType = trType;
			leg.lastUpdateTime = moment(new Date(lastUpdateTime)).format('HH:mm:ss.SSS');
		}
		logger.debug(group, leg.group, leg.status, leg.remark, leg.trType, leg.lastUpdateTime);
	}
};

// class methods
BlockTradeReport.prototype.add = function(tr) {
	this.listTr.push(tr);
};

BlockTradeReport.prototype.setId = function(id) {
	this.id = id;
	console.log('set id:' + id);
};

BlockTradeReport.prototype.setStatus = function(status) {
	this.status = status;
};
BlockTradeReport.prototype.setRemark = function(remark) {
	this.remark = remark;
};

BlockTradeReport.prototype.json = function() {
	data = {
		'Id' : 		this.id,
		'RefId' : 	this.refId,
		'TrType': 	this.trType, 
		'Qty': 		this.qty,
		'Delta' : 	this.delta,
		'CP': 		this.cp,
		'FutMat': 	this.futMat,   
		'Symbol': 	this.symbol,   
		'Status': 	this.status,   
		'Buyer': 	this.buyer,
		'Seller': 	this.seller,
		'Premium': 	this.price,
		'Strategy': this.strat,
		'Remark': 	this.remark,
		'InputTime': 	this.inputTime,
		'TradeId': 	this.tradeId,
		'Multiplier': 	this.multiplier,
		'Legs': [],
	};
	
	for (j=0; j<this.legs.length; j++) {
		var tr = this.legs[j];
		var json = tr.json();
		data.Legs.push(json);
	}
	
	return data;
}

// export the class
module.exports = BlockTradeReport;