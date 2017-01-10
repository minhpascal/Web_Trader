/**
 * http://usejsdoc.org/
 */
// var Hedge = require('./Hedge');
// var Leg = require('./Leg');
function TradeReport() {
};

// Constructor
function TradeReport(ul, type, strike, expiry, price, qty,
		side, cond, buyer, seller) {
	// always initialize all instance properties
	this.ul = ul;
	this.type = type;
	this.strike = strike;
	this.expiry = expiry;
	this.price = price;
	this.qty = qty;
	this.side = side;
	this.cond = cond;
	this.buyer = buyer;
	this.seller = seller;
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
			"Side":this.side, 
	};
	return j;
};

// export the class
module.exports = TradeReport;