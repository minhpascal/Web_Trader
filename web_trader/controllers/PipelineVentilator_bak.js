// Connects REQ socket to tcp://localhost:5555
var log4js = require('log4js');
var logger = log4js.getLogger('PipelineVentilator');

var BlockTradeReport = require('../models/BlockTradeReport');

var zmq = require('zmq');
var pjson = require('../package.json');

var task_push_url = "tcp://" + pjson.pipeline_ip + ':' + pjson.pipeline_port;
var task_sink_url = "tcp://" + pjson.sink_ip + ':' + pjson.sink_port;

var sender = zmq.socket('push');
var receiver = zmq.socket('pull');
var list = [];
var x = 0;

//var _map = {};

var that;

var app;

function PipelineVentilator(_app) {
	that = this;
	this.app = _app;
	app = _app;
};

////socket to talk to server
//PipelineVentilator.prototype.Connect = function(callback) {
//	console.log('connect push ' + task_send_url);
//	console.log('connect sink ' + task_recv_url);
//	receiver.connect(task_send_url);
//	sender.connect(task_recv_url);
//}



PipelineVentilator.prototype.Bind = function(callback) {
	logger.info("Connect task sink ", task_sink_url);
	receiver.bindSync(task_sink_url, function( err ){  
	    if( err ){ 
	        logger.error(err.message);
	        process.exit(0); 
	    } 
	});
	receiver.send("", 0);
//	receiver.connect(task_sink_url);
//	socket.connect("tcp://" + pjson.ip + ':' + pjson.portlocalhost:6555");

	logger.info("Connect task server", task_push_url);
	// bind to an address and port
	sender.connect(task_push_url);
	sender.bindSync(task_push_url, function( err ){  
	    if( err ){ 
	        logger.error(err.message);
	        process.exit(0); 
	    } 
	});
	// The first message is "0" and signals start of batch
//	this.SOD();
	sender.send("", 0);
};

receiver.on('message', function(buf) {
	
	logger.info('onSink: ' + buf);
	
	try {
		var json = JSON.parse(buf.toString());
		
		var refId = json.refId;
		var id = json.id;
		oms = app.get('oms');
		var o = oms.get(refId);

		if (o != undefined) {
			o.setId(id);
		}
		else {
			logger.error('order not found: ' + refId);
//		logger.info(refId + ', old_id=' + _map[refId]);
		}
		bdxService = app.get('broadcastService');
		bdxService.toAll(json);
	
	} catch (err) {
		logger.error(err.message);
	}
	//  var msec = parseInt(buf.toString(), 10);

	  // simple progress indicator for the viewer
	//  process.stdout.write(buf.toString() + ".");

//		  // do the work
//		  // not a great node sample for zeromq,
//		  // node receives messages while timers run.
//		  setTimeout(function() {
//		    sender.send("");
//		  }, msec);
	});

//PipelineVentilator.prototype.EmailInvoice = function(id_list) {
//	logger.info("EmailInvoice...");
//	sender.send('WATE' + id_list);
//};
//
//PipelineVentilator.prototype.DeleteInvoice = function(id_list) {
//	logger.info("DeleteInvoice...");
//	sender.send('WATR' + id_list);
//};
//
//PipelineVentilator.prototype.CreateInvoice = function(key) {
//	logger.info("CreateInvoice");
//	sender.send('WDTG' + key);
//};

process.on('SIGINT', function() {
  sender.close();
  receiver.close();
});

//PipelineVentilator.prototype.SaveInvoice = function(json) {
//	logger.info("SaveInvoice...");
//	sender.send("WDTU" + json);
//};

PipelineVentilator.prototype.SendTradeReport = function(
		refId, trType, symbol, qty, delta, price, 
		strat, futMat, cp, status, legs) {
//	var msg = JSON.stringify({'id': id}) + JSON.stringify({'legs': legs})
	var msg = JSON.stringify({message: {'refId': refId, 'trType': trType, 'cp': cp, 
		'delta': delta, 'qty': qty, 'futMat': futMat, 'legs': legs}});
	logger.info("SendTradeReport " + msg);
	
	try {
		sender.send("TOTR" + msg);
	
//	_map[refId] = -1;
	

		oms = app.get('oms');
//		var block_tr = new BlockTradeReport();
		var block_tr = new BlockTradeReport('', refId, status, trType, symbol, qty, delta, price, strat, cp, legs);
		oms.addBlockTradeReport(refId, block_tr);
	}
	catch (err) {
		logger.error(err.message);
	}
};

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

module.exports = PipelineVentilator;
