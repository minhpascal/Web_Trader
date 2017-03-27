var log4js = require('log4js');
var logger = log4js.getLogger('api');
var express = require('express');
var router = express.Router();
var path = require('path');
var BlockTradeReport = require('../models/BlockTradeReport');
var TradeReport = require('../models/TradeReport');
var Cmmf = require('../models/Cmmf');
var pjson = require('../package.json');
var fs = require('fs');


// local variable
var app = require('../app');

/* GET users listing. */
router.get('/getTradeReport', function(req, res, next) {
	console.log('api/getTradeReport ');	
	var oms = req.app.get('oms');
	var v = oms.getAllTradeReport();

	list = [];
	for (i=0; i<v.length; i++) {
		data = v[i].json();
		list.push(data);
logger.debug('api/getTradeReport 2: ', data);
	}
	
	res.send({data:list});
	console.log('api/getTradeReport ' + {data:list});
});

router.get('/getInstrument', function(req, res, next) {
//	logger.info('api/getInstrument ');	
	var oms = req.app.get('oms');
	var v = oms.getAllInstrument();
	
//	list = [];
//	for (i=0; i<v.length; i++) {
//		data = v[i].json();
//		list.push(data);
//	}
	
	res.send({data:v});
	logger.info('api/getInstrument ' + {data:v});
});

router.get('/getAccounts', function(req, res, next) {
	console.log('api/getAccounts ');	
	var oms = req.app.get('oms');
	var v = oms.getAllAccounts();
	
//	list = [];
//	for (i=0; i<v.length; i++) {
//		data = v[i].json();
//		list.push(data);
//	}
	
	res.send({data:v});
	console.log('api/getInstrument ' + {data:v});
});

router.post('/sendTradeReport', function(req, res, next) {
	console.log('api/sendTradeReport ' + req.body.trType  + ',' + JSON.stringify(req.body.legs));
	
	if (req.url === '/favicon.ico') {
	   res.writeHead(200, {'Content-Type': 'image/x-icon'} );
	   res.end();
	   console.log('favicon requested');
	   return;
	}
	
	var plVent = req.app.get('plVent');
	
	try {
		plVent.SendTradeReport(req.body.refId, req.body.trType,
				req.body.symbol, req.body.qty, req.body.delta, req.body.price,
				req.body.strat, req.body.futMat, req.body.buyer, req.body.seller,
				req.body.refId, req.body.multiplier, req.body.legs);
	}
	catch (err) {
		logger.error(err.message);
	}
	
	res.send('succ');
//	res.sendStatus(refId);
});

router.get('/getInfo', function(req, res, next) {
	var env = req.app.get('env');
	var revision = req.app.get('revision');
	res.send({
		data:req.connection.remoteAddress,
		revision: revision,
		env: env
	});
	console.log('api/getInfo ' + req.connection.remoteAddress + ', ' + revision + ', ' + env);
});

router.post('/createTradeConfo', function(req, res, next) {
	console.log('api/createTradeConfo ' 
			, req.body.refId 
			, req.body.symbol 
			, req.body.company 
			, req.body.cpCompany 
			, req.body.trader 
			, req.body.profile 
			, req.body.isFinal 
			, req.body.rate 
			, req.body.notional 
			, req.body.price 
			, req.body.tradeId 
			, req.body.ref 
			, req.body.side 
			, req.body.qty 
			, req.body.delta 
			, req.body.fee 
			, req.body.multiplier 
			, JSON.stringify(req.body.legs));
	var code = req.body.side === 'Buy' ? req.body.company : req.body.cpCompany;
	new Date().getYear();
	var file = /* pjson.temp_dir + '/' + */
			'CELERAEQ-' + new Date().getYear()
			+ '-' + req.body.tradeId + " "
			+ req.body.symbol.replace(/\//g, "_") + " " + code + ".pdf";
	
	if (req.url === '/favicon.ico') {
		res.writeHead(200, {'Content-Type': 'image/x-icon'} );
		res.end();
		console.log('favicon requested');
		return;
	}
	
	var plVent = req.app.get('plVent');
//	var rrClient = req.app.get('rrClient');
	
	try {
		plVent.CreateTradeConfo(req.body.refId, req.body.symbol, req.body.company, req.body.cpCompany,
				req.body.trader, req.body.profile, req.body.isFinal, req.body.rate, req.body.notional, req.body.price,
				req.body.tradeId, req.body.ref, req.body.side, req.body.qty,
				req.body.delta, req.body.fee, req.body.multiplier, req.body.legs);
	}
	catch (err) {
		logger.error(err.message);
	}
	
//	res.send(file);
//	res.sendStatus(refId);
	
//	var file = req.body.symbol.replace('/','');
//	var tempFile = pjson.temp_dir + file;
    var tempFile = pjson.temp_dir + 'CELERAEQ-2017-11222 KS200 APR17_MAY17 270 1x1 CTS 100 REF 269.5 (MAR17) SAMSUNG.pdf'
	fs.readFile(tempFile, function (err, data){
		res.contentType("application/pdf");
		res.send(data);
	});
});


module.exports = router;
