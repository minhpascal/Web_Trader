var log4js = require('log4js');
var logger = log4js.getLogger('api');
var express = require('express');
var router = express.Router();
var path = require('path');
var BlockTradeReport = require('../models/BlockTradeReport');
var TradeReport = require('../models/TradeReport');
var Cmmf = require('../models/Cmmf');

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
	console.log('api/getInstrument ');	
	var oms = req.app.get('oms');
	var v = oms.getAllInstrument();
	
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
				req.body.refId, req.body.legs);
	}
	catch (err) {
		logger.error(err.message);
	}
	
	res.send('succ');
//	res.sendStatus(refId);
});


module.exports = router;
