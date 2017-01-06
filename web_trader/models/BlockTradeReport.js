/**
 * http://usejsdoc.org/
 */

var TradeReport = require('./TradeReport')

function BlockTradeReport() {
	console.log('create Blocktradereport')
};

// Constructor
function BlockTradeReport(id, refId, status, trType, symbol, qty, delta, price, strat, cp, legs) {
	this.id = id;
	this.refId = refId;
	this.status = status;
	this.trType = trType;
	this.symbol = symbol;
	this.qty = qty;
	this.delta = delta;
	this.price = price;
	this.strat = strat;
	this.cp = cp;
	
	this.listTr = [];
	for (i=0; i<legs.length; i++) 
	{
		tr = legs[i];
		buyer = legs[i].Side === 'Buy' ? 'HKCEL' : cp; 
		seller = legs[i].Side === 'Sell' ? 'HKCEL' : cp; 
    	this.listTr.push(new TradeReport(tr.Instrument, '', 
    			tr.Strike, tr.Expiry, '', tr.Price, tr.Qty, tr.Side, '', buyer, seller));		
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

// export the class
module.exports = BlockTradeReport;