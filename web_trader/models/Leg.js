/**
 * http://usejsdoc.org/
 */
// var Hedge = require('./Hedge');
// var Leg = require('./Leg');
function Leg() {
};

// Constructor
function Leg(ul, type, price, qty, side, strike, expiry) {
	// always initialize all instance properties
	this.ul = ul;
	this.type = type;
	this.price = price;
	this.qty = qty;
	this.side = side;
	this.strike = strike;
	this.expiry = expiry;
};

//function Leg(json) {
//	// always initialize all instance properties
//	this.ul = json.ul;
//	this.type = json.type;
//	this.strike = json.strike;
//	this.month = json.month;
//	this.year = json.year;
//	this.price = json.price;
//	this.qty = json.qty;
//	this.side = json.side;
//	this.cond = json.cond;
//	this.buyer = json.buyer;
//	this.seller = json.seller;
//};
//
// class methods

Leg.prototype.json = function() {
	var j = {
			"ul":this.ul, 
			"type":this.type, 
			"price":this.price, 
			"qty":this.qty,
			"side":this.side,
			"strike":this.strike, 
			"expiry":this.expiry, 
	};
	return JSON.stringify(j);
};

// export the class
module.exports = Leg;