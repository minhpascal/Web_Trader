/**
 * http://usejsdoc.org/
 */
// var Hedge = require('./Hedge');
// var Leg = require('./Leg');
function TradeReport() {
};

// Constructor
function TradeReport(ul, type, strike, month, year, price, qty,
		side, cond, buyer, seller) {
	// always initialize all instance properties
	this.ul = ul;
	this.type = type;
	this.strike = strike;
	this.month = month;
	this.year = year;
	this.price = price;
	this.qty = qty;
	this.side = side;
	this.cond = cond;
	this.buyer = buyer;
	this.seller = seller;
};

function TradeReport(json) {
	// always initialize all instance properties
	this.ul = json.ul;
	this.type = json.type;
	this.strike = json.strike;
	this.month = json.month;
	this.year = json.year;
	this.price = json.price;
	this.qty = json.qty;
	this.side = json.side;
	this.cond = json.cond;
	this.buyer = json.buyer;
	this.seller = json.seller;
};

// class methods
TradeReport.prototype.json = function() {
	var j = {
			"ul":this.ul, 
			"strike":this.strike, 
			"month":this.month, 
			"year":this.year, 
			"price":this.price, 
			"qty":this.qty, 
			"side":this.side, 
			"cond":this.cond, 
			"buyer":this.buyer, 
			"seller":this.seller, 
	};
	return JSON.stringify(j);
};

// export the class
module.exports = TradeReport;