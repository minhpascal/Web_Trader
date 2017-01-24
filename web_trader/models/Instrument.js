/**
 * http://usejsdoc.org/
 */
function Instrument() {
	console.log('create Instrument')
};

// Constructor
function Instrument(symbol, status) {
	this.symbol = symbol;
	this.status = status;
};

Instrument.prototype.setSymbol = function(symbol) {
	this.symbol = symbol;
};

Instrument.prototype.setStatus = function(status) {
	this.status = status;
};

Instrument.prototype.json = function() {
	data = {
		'Symbol' : 	this.symbol,
		'Status' : 	this.status,
	};
	return data;
}

// export the class
module.exports = Instrument;