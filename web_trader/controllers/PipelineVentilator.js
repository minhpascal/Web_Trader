// Connects REQ socket to tcp://localhost:5555
var log4js = require('log4js');
var logger = log4js.getLogger('PipelineVentilator');

var zmq = require('zmq');
var pjson = require('../package.json');

var BlockTradeReport = require('../models/BlockTradeReport');
var Cmmf = require('../models/Cmmf');

// custom
//var TradeConfo = require('../models/TradeConfo');
var task_url = "tcp://" + pjson.pipeline_ip + ':' + pjson.pipeline_port;
var task_sink_url = "tcp://" + pjson.sink_ip + ':' + pjson.sink_port;

var sender = zmq.socket('push');
var receiver = zmq.socket('pull');

var list = [];
var x = 0;

var that;

MessageType = {
		ADMIN: 'A',
		QUERY: 'Q',
		RESPONSE: 'R',
		TASK: 'T',
};

Command = {
		ALL_HISTORICAL_TRADE: 'A',
		ORDER_REQUEST: 'O',
		TRADE_REPORT: 'R',
		INSTRUMENT_UPDATE: 'P',
		HKEX_ADMIN_COMMAND: 'H',
	};

var JSON_TAG = {
	SYMBOL : "Symbol", 
	EXPIRY : "Expiry", 
	STRIKE : "Strike", 
	COUNTER_PARTY : "Cp", 
	QTY : "Qty", 
	PRICE : "Price", 
	STATUS : "Status", 
	LEGS : "Legs", 
	TRADE_REPORT_TYPE : "TrType", 
	ORDER_ID : "Id", 
	REFERENCE_ID : "RefId", 
	SIDE : "Side", 
	FUTURE_MATURITY : "FutMat", 
};

function PipelineVentilator(_app) {
	this.JSON_TAG = {
		SYMBOL : "Symbol", 
		EXPIRY : "Expiry", 
		STRIKE : "Strike", 
		COUNTER_PARTY : "Cp", 
		QTY : "Qty", 
		PRICE : "Price", 
		STATUS : "Status", 
		LEGS : "Legs", 
		TRADE_REPORT_TYPE : "TrType", 
		ORDER_ID : "Id", 
		REFERENCE_ID : "RefId", 
		SIDE : "Side", 
		FUTURE_MATURITY : "FutMat", 
	};
	
	that = this;
	this.app = _app;
};

//socket to talk to server
PipelineVentilator.prototype.Bind = function(callback) {
	logger.info("Bind task server", task_url);
	// bind to an address and port 
	sender.bindSync(task_url, function( err ){  
	    if( err ){ 
	        logger.error(err.message);
	        process.exit(0); 
	    } 
	});

	receiver.bindSync(task_sink_url, function( err ){  
	    if( err ){ 
	        logger.error(err.message);
	        process.exit(0); 
	    } 
	});
	receiver.send("", 0);
};

process.on('SIGINT', function() {
  sender.close();
//  sink.close();
});

PipelineVentilator.prototype.SOD = function() {
//	var msg = JSON.stringify({'id': id}) + JSON.stringify({'legs': legs})
	logger.info("SOD ");
	
//	_map[refId] = -1;
	try {
		sender.send("TOAS");	// ask OMS to connect
	}
	catch (err) {
		logger.error(err.message);
	}
};

// Query 
PipelineVentilator.prototype.QueryAllTradeReport = function() {
	logger.info("QueryAllTradeReport");
	sender.send("TOQR");
}

PipelineVentilator.prototype.QueryAllInstrument = function() {
	logger.info("QueryAllInstrument");
	sender.send("TOQP");
}
		
PipelineVentilator.prototype.SendTradeReport = function(
		refId, trType, symbol, qty, delta, price, 
		strat, futMat, buyer, seller, legs) 
{
	
//	logger.info("SendTradeReport " + refId + ',' + trType  + ',' +  symbol  + ',' +  qty  + ',' +  delta  + ',' +  price  + ',' +  
//			strat  + ',' +  futMat  + ',' +  cp  + ',' +  status  + ',' +  legs);
	
	try {
//		var oms = this.app.get('oms');
//		var refId = oms.getOrderId();
		
//	var msg = JSON.stringify({'id': id}) + JSON.stringify({'legs': legs})
		var msg = JSON.stringify({
			RefId : refId,
			TrType : trType,
			Buyer : buyer,
			Seller : seller,
			Delta : delta,
			Qty : qty,
			Price : price,
			FutMat : futMat,
			Symbol : symbol,
			Legs : legs
		});
	
		oms = this.app.get('oms');
		var block_tr = new BlockTradeReport('', refId, 'UNSENT', trType, symbol, qty, delta, price, strat, buyer, seller, futMat, legs);
		oms.addBlockTradeReport(refId, block_tr);
		
		bdxService = this.app.get('broadcastService');
		bdxService.toAll(block_tr.json());
		
		sender.send("TOTR" + msg);
	}
	catch (err) {
		logger.error(err.message);
	}

	logger.info("SendTradeReport: " + msg); 
};

PipelineVentilator.prototype.onTradeReport = function(doc) {
	logger.info('onTradeReport: ', doc);
	
	try {
		oms = this.app.get('oms');
		var refId = doc.tradeReport.RefId;
		var id = doc.tradeReport.Id;
		var status = doc.tradeReport.Status;
logger.debug('onTradeReport: ', refId + ',' + id + ',' + status);
		var tr = oms.get(refId);
		if (tr) {
			// update internal oms
			tr.id = id;
			tr.status = status;
			
			bdxService = this.app.get('broadcastService');
			bdxService.toAll(doc.tradeReport);
		}
		else {
			logger.error('order not found: ' + refId);
			
			var trType = doc.tradeReport.TrType;
			var symbol = doc.tradeReport.Symbol;
			var qty = doc.tradeReport.Qty;
			var delta = doc.tradeReport.Delta;
			var buyer = doc.tradeReport.Buyer;
			var seller = doc.tradeReport.Seller;
			var futMat = doc.tradeReport.FutMat;
			
			var legs = [];
			var list = doc.tradeReport.Legs;
			for (i=0; i<list.length; i++) {
				var Instrument = list[i].Instrument;
				var UL = list[i].UL;
				var Qty = list[i].Qty;
				var Buyer = list[i].Buyer;
				var Seller = list[i].Seller;
				var Strike = list[i].Strike;
				var Expiry = list[i].Expiry;
				var Price = list[i].Price;
				legs.push({'Instrument' : Instrument, 'UL': UL, 'Qty' : Qty,
					'Buyer': Buyer, 'Seller': Seller, 'Strike': Strike, 'Expiry': Expiry, 'Price': Price});
			}

			if (list.length > 0) {
				var block_tr = new BlockTradeReport(id, refId, status, trType, symbol, qty, delta, '', '', buyer, seller, futMat, legs);
				oms.addBlockTradeReport(refId, block_tr);
			}
		}
	} catch (err) {
		logger.error(err.message);
	}
};


PipelineVentilator.prototype.onOrder = function(doc) {
	logger.info(doc);
};

PipelineVentilator.prototype.onQueryAllInstrument = function(doc) {
	logger.info('onQueryAllInstrument: ', doc);
	
	
		oms = this.app.get('oms');
		var instruments = [];
		var size = doc.Size;
		var list = doc.Instruments;
		for (i=0; i<size; i++) {
			try {
			var instr = list[i];
logger.info('instr: ', instr);			
			var Symbol = instr.Symbol;
			var Status = instr.Status;
//			if (Symbol.startWith('HHI') || Symbol.startWith('HSI'))
				oms.addInstrument(Symbol, Status);
			} catch (err) {
				logger.error(instr + "," + err.message);
			}
		}
}

//onPipelineVentilator.prototype.onInstrumentUpdate = function(doc) {
//	logger.info('onInstrumentUpdate: ', doc);
//	
//	try {
//			var legs = [];
//			var list = doc.Instruments;
//			for (i=0; i<list.length; i++) {
//				var Instrument = list[i].Instrument;
//				var UL = list[i].UL;
//				var Qty = list[i].Qty;
//				var Buyer = list[i].Buyer;
//				var Seller = list[i].Seller;
//				var Strike = list[i].Strike;
//				var Expiry = list[i].Expiry;
//				var Price = list[i].Price;
//				legs.push({'Instrument' : Instrument, 'UL': UL, 'Qty' : Qty,
//					'Buyer': Buyer, 'Seller': Seller, 'Strike': Strike, 'Expiry': Expiry, 'Price': Price});
//			}
//
//			if (list.length > 0) {
//				var block_tr = new BlockTradeReport(id, refId, status, trType, symbol, qty, delta, '', '', buyer, seller, futMat, legs);
//				oms.addBlockTradeReport(refId, block_tr);
//			}
//	} catch (err) {
//		logger.error(err.message);
//	}
//};

receiver.on('message', function(buf) {
	
	logger.info('onSink: ' + buf.toString());
	
	var json = JSON.parse(buf.toString());
	switch (json.message_type) {
		case MessageType.RESPONSE : {
			switch (json.command) {
			case Command.TRADE_REPORT: {
				that.onTradeReport(json);
				break;
			}
			case Command.ORDER_REQUEST: {
				that.onOrder(json);
				break;
			}
			case Command.INSTRUMENT_UPDATE: {
				that.onQueryAllInstrument(json);
				break;
			}
			default : {
				logger.error("Unknown message", json);
				break;
			}
			}
			break;
		};
//		case MessageType.RESPONSE : {
//			switch (json.command) {
//			case Command.TRADE_REPORT: {
////				that.onQueryTradeReport(json);
//				break;
//			}
//			case Command.ORDER_REQUEST: {
//				that.onOrder(json);
//				break;
//			}
//			case Command.INSTRUMENT_UPDATE: {
//				that.onInstrumentUpdate(json);
//				break;
//			}
//			default : {
//				logger.error("Unknown message", json);
//				break;
//			}
//			}
//			break;
//		};
		default:
			break;
	}
	});

module.exports = PipelineVentilator;
