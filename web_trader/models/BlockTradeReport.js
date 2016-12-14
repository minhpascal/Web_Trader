/**
 * http://usejsdoc.org/
 */

var TradeReport = require('./TradeReport')

// Constructor
function BlockTradeReport() {
	// always initialize all instance properties
	this.listTr = [];
};

// class methods
BlockTradeReport.prototype.add = function(tr) {
	this.listTr.push(tr);
};

// export the class
module.exports = BlockTradeReport;