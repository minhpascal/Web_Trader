// Connects REQ socket to tcp://localhost:5555


var log4js = require('log4js');
var logger = log4js.getLogger('RrClient');

var zmq = require('zmq');
var pjson = require('../package.json');
// custom
//var BlockTradeReport = require('../models/BlockTradeReport');
var Cmmf = require('../models/Cmmf');

var requester = zmq.socket('req');


//var list = [];
//var tc_map = {};
//var inv_list = [];
//var inv_map = {};
//var tcSummary_map = {};
var x = 0;

var that;

function RrClient(_app) {
	that = this;
	this.app = _app;
}

requester.on("message", function(reply) {
	logger.info("Receive: " + reply);
	try {
		var json = JSON.parse(reply);
		switch (json.command) {
		case Cmmf.Command.TRADE_REPORT: {
			that.onTradeReport(json);
			break;
		}
		case Cmmf.Command.ORDER_REQUEST: {
			that.onOrder(json);
			break;
		}
		default : {
			logger.error("Unknown message", json);
			break;
		}
		};
	}
	catch (err) {
		logger.error('error parsing json', err);
	}
});


//socket to talk to server
RrClient.prototype.Connect = function(callback) {
	logger.info("Connecting to server", "tcp://" + pjson.rrserver_ip + ':' + pjson.rrserver_port);
	requester.connect("tcp://" + pjson.rrserver_ip + ':' + pjson.rrserver_port);
//	requester.connect("tcp://" + pjson.ip + ':' + pjson.portlocalhost:6555");
}

process.on('SIGINT', function() {
  requester.close();
});

RrClient.prototype.CreateTradeConfo = function(
		refId, symbol, company, cpCompany,
		trader, profile, isFinal, rate, notional, price, tradeId, ref, side, qty, delta, fee, multiplier, legs) {
	var msg = JSON.stringify({
		'Symbol': symbol, 
		'Company': company,
		'CpCompany': cpCompany,
		'Trader': trader,
		'Profile': profile,
		'IsFinal': isFinal,
		'Rate': rate,
		'Notional': notional,
		'Price': price,
		'TradeId': tradeId,
		'RefPrice': ref,
		'Side': side,
		'Qty': qty,
		'Delta': delta,
		'Fee': fee,
		'Multiplier': multiplier,
//		'Legs': JSON.stringify(legs),
		'Legs': legs,
	});
	logger.info("CreateTradeConfo " + msg);
	requester.send("TOTF" + msg);
	
	$scope.myOtData[i].Trader = res.message.Trader;
	$scope.myOtData[i].Profile = res.message.Profile;
	$scope.myOtData[i].IsFinal = res.message.IsFinal;
	$scope.myOtData[i].Rate = res.message.Rate;
	$scope.myOtData[i].TradeId = res.message.TradeId;
	$scope.myOtData[i].Fee = res.message.Fee;
	
	bdxService = this.app.get('broadcastService');
	var bd = JSON.stringify({
		'RefId': refId,
		'Trader': trader,
		'Profile': profile,
		'IsFinal': isFinal,
		'Rate': rate,
		'TradeId': tradeId,
		'Fee': fee,
	});
		
	bdxService.updateTradeConfo(bd);
	
//	_map[refId] = -1;
};

module.exports = RrClient;