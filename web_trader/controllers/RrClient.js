// Connects REQ socket to tcp://localhost:5555


var log4js = require('log4js');
var logger = log4js.getLogger('RrClient');

var zmq = require('zmq');
var pjson = require('../package.json');
// custom
var BlockTradeReport = require('../models/BlockTradeReport');
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
});


//socket to talk to server
RrClient.prototype.Connect = function(callback) {
	logger.info("Connecting to server", "tcp://" + pjson.rrserver_ip + ':' + pjson.rrserver_port);
	requester.connect("tcp://" + pjson.rrserver_ip + ':' + pjson.rrserver_port);
//	requester.connect("tcp://" + pjson.ip + ':' + pjson.portlocalhost:6555");
}

RrClient.prototype.QueryAllInstrument = function() {
	logger.info("QueryAllInstrument...");
	requester.send("TOQP");
}

RrClient.prototype.QueryAllTradeReports = function() {
	logger.info("QueryAllTradeReports...");
	requester.send("TOQR");
}

process.on('SIGINT', function() {
  requester.close();
});

// callback
RrClient.prototype.onInstrumentUpdate = function(doc) {
	logger.info(doc);
////	var count  = 1;
//	doc.tradeconf.forEach(function(e) {
//		if (e) {
////			console.log(e);
//			var tradeConfo = new TradeConfo(e.summary, e.buyer, e.seller, e.price,
//					e.curncy, e.tradeDate, e.refPrice, e.tradeConfoId, e.delta,
//					e.buyQty, e.sellQty, e.ptValue, e.ptCny, e.premiumPmt,
//					e.notional, e.notionalCny, e.rate, e.premium, e.premiumCny,
//					e.hedges, e.brokerageFee, e.brokerageCny,
//					e.legs, e.hasInvoiceCreated);
//			list.push(tradeConfo);
//			tc_map[tradeConfo.id] = tradeConfo;
////			console.log(tradeConfo.toString());
//		}
//	});
//	this.app.set('list', list);
//	this.app.set('map_tc', tc_map);
}

RrClient.prototype.onOrder = function(doc) {
	logger.info(doc);
////	var count  = 1;
//	doc.summary.forEach(function(e) {
//		if (e) {
////			var ir = new InvoiceRegister(e.date, e.invoice, e.customer, e.accountNumber,
////					e.curncy, e.amount);
//			tcSummary_map[e.key] = e.amount;
////			console.log(tradeConfo.toString());
//		}
//	});
//	this.app.set('map_tcSummary', tcSummary_map);
}

RrClient.prototype.onTradeReport = function(doc) {
	logger.info(doc);
//	doc.invoices.forEach(function(e) {
//		if (e) {
//			var inv = new Invoice(
//					e.company,
//					e.address, 
//					e.attn, 
//					e.sentTo, 
//					e.invoice_number, 
//					e.invoice_date, 
//					e.account_number, 
//					e.due_date, 
//					e.amount_due, 
//					e.description, 
//					e.amount, 
//					e.key,  
//					e.isPaid, 
//					e.hasSent, 
//					e.paymentBanName, 
//					e.paymentBankAddress, 
//					e.paymentBankCode, 
//					e.paymentBranchCode, 
//					e.paymentAccountNumber, 
//					e.paymentAccountBeneficiary, 
//					e.paymentSwift,
//					e.currency,
//					e.id,
//					e.size,
//					e.hedge
//					);
//			inv_list.push(inv);
//			inv_map[inv.id] = inv;
////			console.log("====109====" + inv);
//		}
//	});
//	this.app.set('list_invoice', inv_list);
//	this.app.set('map_invoice', inv_map);
}

RrClient.prototype.SendTradeReport = function(
		refId, trType, symbol, qty, delta, price, 
		strat, futMat, cp, status, legs) {
//	var msg = JSON.stringify({'id': id}) + JSON.stringify({'legs': legs})
	var msg = JSON.stringify({message: {'refId': refId, 'trType': trType, 'cp': cp, 
		'delta': delta, 'qty': qty, 'futMat': futMat, 'legs': legs}});
	logger.info("SendTradeReport " + msg);
	sender.send("TOTR" + msg);
	
//	_map[refId] = -1;
};

module.exports = RrClient;