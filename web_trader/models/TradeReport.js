/**
 * http://usejsdoc.org/
 */
var moment = require('moment');

// var Hedge = require('./Hedge');
// var Leg = require('./Leg');
function TradeReport() {
};

// Constructor
function TradeReport(instr, ul, type, strike, expiry, price, qty,
		buyer, seller, group, status, remark, trType, lastUpdateTime) {
	// always initialize all instance properties
	this.instr = instr;
	this.ul = ul;
	this.type = type;
	this.strike = strike;
	this.expiry = expiry;
	this.price = price;
	this.qty = qty;
	this.buyer = buyer;
	this.seller = seller;
	this.group = group;
	if (status || status !== '')
		this.status = status;
	else 
		this.status = 'UNSENT';
	this.remark = remark;
	this.trType = trType;
	this.lastUpdateTime = moment(new Date(lastUpdateTime)).format('HH:mm:ss.SSS');
	
	this.bStatus = '';
	this.sStatus = '';
};

//function TradeReport(json) {
//	// always initialize all instance properties
//	this.ul = json.ul;
//	this.type = json.type;
//	this.strike = json.strike;
//	this.expiry = json.expiry;
//	this.price = json.price;
//	this.qty = json.qty;
//	this.side = json.side;
//	this.cond = json.cond;
//	this.buyer = json.buyer;
//	this.seller = json.seller;
//};

// class methods
TradeReport.prototype.json = function() {
	var j = {
			"Instrument":this.instr, 
			"UL":this.ul, 
			"Strike":this.strike, 
			"Expiry":this.expiry, 
			"Price":this.price, 
			"Qty":this.qty, 
			"Buyer":this.buyer, 
			"Seller":this.seller, 
			"Group":this.group, 
			"Status":this.status, 
			"Remark":this.remark, 
			"TrType":this.trType, 
			"LastUpdateTime":this.lastUpdateTime, 
	};
	return j;
};

TradeReport.prototype.setStatus = function(status) {
	this.status = status;
};

TradeReport.prototype.setRemark = function(remark) {
	this.remark = remark;
};

TradeReport.prototype.updateGroup = function(group, status, remark) {
};

TradeReport.prototype.updateSideStatus = function(side, status) {
	logger.debug(side, status);
	if (side == 'Buy') {
		bStatus = status;
	}
	else if (side == 'Sell') {
		sStatus = status;
	}
}

// export the class
module.exports = TradeReport;