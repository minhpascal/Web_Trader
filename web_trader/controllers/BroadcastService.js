/**
 * http://usejsdoc.org/
 */

function BroadcastService() {
};

// Constructor
function BroadcastService(io) {
	// always initialize all instance properties
	this.io = io;
};


BroadcastService.prototype.toAll = function(msg) {
	
	console.log('Broadcast to all clients');
	this.io.sockets.emit('send:message', {
	  message: msg
	});
};

BroadcastService.prototype.updateTradeConfo = function(msg) {
	
	console.log('Broadcast update trade confo to all clients');
	this.io.sockets.emit('update:tradeconfo', {
		message: msg
	});
};

// export the class
module.exports = BroadcastService;