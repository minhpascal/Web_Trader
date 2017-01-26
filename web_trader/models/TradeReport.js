/**
 * http://usejsdoc.org/
 */
// var Hedge = require('./Hedge');
// var Leg = require('./Leg');
function TradeReport() {
};

// Constructor
function TradeReport(ul, type, strike, expiry, price, qty,
		buyer, seller, group, status, remark) {
	// always initialize all instance properties
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
			"Instrument":this.ul, 
			"Strike":this.strike, 
			"Expiry":this.expiry, 
			"Price":this.price, 
			"Qty":this.qty, 
			"Buyer":this.buyer, 
			"Seller":this.seller, 
			"Group":this.group, 
			"Status":this.status, 
			"Remark":this.remark, 
	};
	return j;
};

TradeReport.prototype.setStatus = function(status) {
	this.status = status;
};

TradeReport.prototype.setRemark = function(remark) {
	this.remark = remark;
};

TradeReport.prototype.setGroupStatus = function(group, status, remark) {
};

// export the class
module.exports = TradeReport;