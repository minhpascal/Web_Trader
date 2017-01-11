/**
 * http://usejsdoc.org/
 */

var TradeReport = require('./TradeReport')

function BlockTradeReport() {
	console.log('create Blocktradereport')
};

// Constructor
function BlockTradeReport(id, refId, status, trType, symbol, qty, delta, price, strat, buyer, seller, futMat, legs) {
	this.id = id;
	this.refId = refId;
	this.status = status;
	this.trType = trType;
	this.symbol = symbol;
	this.qty = qty;
	this.delta = delta;
	this.price = price;
	this.strat = strat;
	this.buyer = buyer;
	this.seller = seller;
	this.futMat = futMat;
	
	this.legs = [];
	for (i=0; i<legs.length; i++) 
	{
		tr = legs[i];
    	this.legs.push(new TradeReport(tr.Instrument, '', 
    			tr.Strike, tr.Expiry, tr.Price, tr.Qty, tr.Buyer, tr.Seller));		
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
		'legs': [],
	};
	
	for (j=0; j<this.legs.length; j++) {
		var tr = this.legs[j];
		var json = tr.json();
//			var leg = {
//				'Instrument' : l.ul,
//				'Expiry' : v[i].legs[j].expiry,
//				'Strike' : v[i].legs[j].strike,
//				'Qty' : v[i].legs[j].qty,
//				'Price' : v[i].legs[j].price,
//				'Side' : v[i].legs[j].side,
//			};
		data.legs.push(json);
	}
	
	return data;
}

// export the class
module.exports = BlockTradeReport;