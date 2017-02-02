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
function BlockTradeReport(id, refId, status, trType, symbol, qty, delta, price, strat, buyer, seller, futMat, remark, inputTime, legs) {
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
	
	this.legs = [];
	for (i=0; i<legs.length; i++) 
	{
		tr = legs[i];
		    	this.legs.push(new TradeReport(tr.Instrument, '', tr.Strike, tr.Expiry,
				tr.Price, tr.Qty, tr.Buyer, tr.Seller, tr.Group, tr.Status,
				tr.Remark, tr.TrType, tr.LastUpdateTime));		
	}
};

// class methods
BlockTradeReport.prototype.updateGroup = function(group, status, remark, trType, lastUpdateTime) {
	logger.debug('updateGroup: ', group, status, remark, trType, lastUpdateTime);
	for (var i=0; i<this.legs.length; i++) {
		if (this.legs[i].Group === group) {
			this.legs[i].Status = status;
			this.legs[i].Remark = remark;
			this.legs[i].TrType = trType;
			this.legs[i].LastUpdateTime = moment(new Date(lastUpdateTime)).format('HH:mm:ss.SSS');
		} 
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