// Connects REQ socket to tcp://localhost:5555
var log4js = require('log4js');
var logger = log4js.getLogger('PipelineVentilator');

var zmq = require('zmq');
var pjson = require('../package.json');
// custom
//var TradeConfo = require('../models/TradeConfo');
var task_url = "tcp://" + pjson.pipeline_ip + ':' + pjson.pipeline_port;

var sender = zmq.socket('push');
var list = [];
var x = 0;

var that;

function PipelineVentilator(_app) {
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
//	socket.connect("tcp://" + pjson.ip + ':' + pjson.portlocalhost:6555");
};

PipelineVentilator.prototype.EmailInvoice = function(id_list) {
	logger.info("EmailInvoice...");
	sender.send('WATE' + id_list);
};

PipelineVentilator.prototype.DeleteInvoice = function(id_list) {
	logger.info("DeleteInvoice...");
	sender.send('WATR' + id_list);
};

PipelineVentilator.prototype.CreateInvoice = function(key) {
	logger.info("CreateInvoice");
	sender.send('WDTG' + key);
};

process.on('SIGINT', function() {
  sender.close();
//  sink.close();
});

PipelineVentilator.prototype.SaveInvoice = function(json) {
	logger.info("SaveInvoice...");
	sender.send("WDTU" + json);
};

PipelineVentilator.prototype.SendTradeReport = function(id, json) {
	logger.info("SendTradeReport... " + id + ',' + json);
	sender.send("TOTR" + id + ',' + json);
};

module.exports = PipelineVentilator;
