// Connects REQ socket to tcp://localhost:5555


var log4js = require('log4js');
var logger = log4js.getLogger('RrClient');

var zmq = require('zmq');
var pjson = require('../package.json');
// custom
var TradeConfo = require('../models/TradeConfo');
var Invoice = require('../models/Invoice');


var requester = zmq.socket('req');
var list = [];
var tc_map = {};
var inv_list = [];
var inv_map = {};
var tcSummary_map = {};
var x = 0;

var that;

function RrClient(_app) {
	that = this;
	this.app = _app;
}

requester.on("message", function(reply) {
	logger.info("Receive: " + reply);
	var json = JSON.parse(reply);
	if (json.command === 'A' || json.command === 'B')
		that.onQueryAllTradeConfo(json);
	else if (json.command === 'I')
		that.onQueryAllInvoice(json);
	else if (json.command === 'S')
		that.onQueryAllTcSummary(json);
	else if (json.command === 'G') {
		that.onCreateInvoice(json);
	} else {
		console.log("Unknown message", json);
	}
});


//socket to talk to server
RrClient.prototype.Connect = function(callback) {
	logger.info("Connecting to server", "tcp://" + pjson.rrserver_ip + ':' + pjson.rrserver_port);
	requester.connect("tcp://" + pjson.rrserver_ip + ':' + pjson.rrserver_port);
//	requester.connect("tcp://" + pjson.ip + ':' + pjson.portlocalhost:6555");
}

RrClient.prototype.QueryAllTradeConfo = function() {
	logger.info("QueryAllTradeConfo...");
	requester.send("WDQA");
}

RrClient.prototype.QueryAllInvoice = function() {
	logger.info("QueryAllInvoice...");
	requester.send("WDQI");
}

RrClient.prototype.QueryAllTcSummary = function() {
	logger.info("QueryAllTradeConfoSummary...");
	requester.send("WDQS");
}

process.on('SIGINT', function() {
  requester.close();
});


RrClient.prototype.onQueryAllTradeConfo = function(doc) {
	logger.info(doc);
//	var count  = 1;
	doc.tradeconf.forEach(function(e) {
		if (e) {
//			console.log(e);
			var tradeConfo = new TradeConfo(e.summary, e.buyer, e.seller, e.price,
					e.curncy, e.tradeDate, e.refPrice, e.tradeConfoId, e.delta,
					e.buyQty, e.sellQty, e.ptValue, e.ptCny, e.premiumPmt,
					e.notional, e.notionalCny, e.rate, e.premium, e.premiumCny,
					e.hedges, e.brokerageFee, e.brokerageCny,
					e.legs, e.hasInvoiceCreated);
			list.push(tradeConfo);
			tc_map[tradeConfo.id] = tradeConfo;
//			console.log(tradeConfo.toString());
		}
	});
	this.app.set('list', list);
	this.app.set('map_tc', tc_map);
}

RrClient.prototype.onQueryAllTcSummary = function(doc) {
	logger.info(doc);
//	var count  = 1;
	doc.summary.forEach(function(e) {
		if (e) {
//			var ir = new InvoiceRegister(e.date, e.invoice, e.customer, e.accountNumber,
//					e.curncy, e.amount);
			tcSummary_map[e.key] = e.amount;
//			console.log(tradeConfo.toString());
		}
	});
	this.app.set('map_tcSummary', tcSummary_map);
}

RrClient.prototype.onQueryAllInvoice = function(doc) {
	logger.info(doc);
//	var count  = 1;
	doc.invoices.forEach(function(e) {
		if (e) {
//			console.log(e);
			var inv = new Invoice(
					e.company,
					e.address, 
					e.attn, 
					e.sentTo, 
					e.invoice_number, 
					e.invoice_date, 
					e.account_number, 
					e.due_date, 
					e.amount_due, 
					e.description, 
					e.amount, 
					e.key,  
					e.isPaid, 
					e.hasSent, 
					e.paymentBanName, 
					e.paymentBankAddress, 
					e.paymentBankCode, 
					e.paymentBranchCode, 
					e.paymentAccountNumber, 
					e.paymentAccountBeneficiary, 
					e.paymentSwift,
					e.currency,
					e.id,
					e.size,
					e.hedge
					);
			inv_list.push(inv);
			inv_map[inv.id] = inv;
//			console.log("====109====" + inv);
		}
	});
	this.app.set('list_invoice', inv_list);
	this.app.set('map_invoice', inv_map);
}

RrClient.prototype.SaveInvoice = function(str) {
	logger.info("SaveInvoice...");
	console.log("WDQU" + str);
	requester.send("WDQU" + str);
};

RrClient.prototype.SaveAccount = function(list) {
	logger.info("SaveAccount...");
	requester.send("WDTC" + list);
};

RrClient.prototype.CreateInvoice = function(currency, invoice_month, company) {
	logger.info("CreateInvoice");
	// WDQGxxxyyyyz...
	requester.send('WDQG' + currency + invoice_month + company);
};

RrClient.prototype.onCreateInvoice = function(doc) {
	logger.info(doc);
//	var count  = 1;
	var e = doc.invoice;
	if (e) {
//			console.log(e);
		var inv = new Invoice(
				e.company,
				e.address, 
				e.attn, 
				e.sentTo, 
				e.invoice_number, 
				e.invoice_date, 
				e.account_number, 
				e.due_date, 
				e.amount_due, 
				e.description, 
				e.amount, 
				e.key,  
				e.isPaid, 
				e.hasSent, 
				e.paymentBanName, 
				e.paymentBankAddress, 
				e.paymentBankCode, 
				e.paymentBranchCode, 
				e.paymentAccountNumber, 
				e.paymentAccountBeneficiary, 
				e.paymentSwift,
				e.currency,
				e.id,
				e.size,
				e.hedge
				);
		inv_list = this.app.get('list_invoice');
		inv_map = this.app.get('map_invoice');
//console.log("=========201======" + inv_list.length);
		inv_list.push(inv);
		inv_map[inv.id] = inv;
		this.app.set('list_invoice', inv_list);
		this.app.set('map_invoice', inv_map);
//console.log("=========206======" + inv_list.length);
//			console.log("====109====" + inv);
	}

}

module.exports = RrClient;