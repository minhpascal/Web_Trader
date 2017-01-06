// Connects REQ socket to tcp://localhost:5555
var log4js = require('log4js');
var logger = log4js.getLogger('PipelineSink');

var zmq = require('zmq');
var pjson = require('../package.json');
// custom
//var TradeConfo = require('../models/TradeConfo');
var task_sink_url = "tcp://" + pjson.sink_ip + ':' + pjson.sink_port;

var receiver = zmq.socket('pull');
var list = [];
var x = 0;

var that;

function PipelineSink(_app) {
	that = this;
	this.app = _app;
};

PipelineSink.prototype.Bind = function(callback) {
	logger.info("bind task sink ", task_sink_url);
	// bind to an address and port 
	receiver.bindSync(task_sink_url, function( err ){  
	    if( err ){ 
	        logger.error(err.message);
	        process.exit(0); 
	    } 
	});
};

receiver.on('message', function(buf) {
	//  var msec = parseInt(buf.toString(), 10);
	  logger.info('recv.on ' + buf);
	  // simple progress indicator for the viewer
	//  process.stdout.write(buf.toString() + ".");

//		  // do the work
//		  // not a great node sample for zeromq,
//		  // node receives messages while timers run.
//		  setTimeout(function() {
//		    sender.send("");
//		  }, msec);
	});

process.on('SIGINT', function() {
  receiver.close();
});

module.exports = PipelineSink;
