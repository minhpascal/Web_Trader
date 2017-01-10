var express = require('express');
var router = express.Router();
var path = require('path');
var BlockTradeReport = require('../models/BlockTradeReport');
var TradeReport = require('../models/TradeReport');
var Cmmf = require('../models/Cmmf');

// local variable
var app = require('../app');

function updateTradeConfo(key, myData) 
{
	for (var i in myData) 
	{
		var tc = myData[i];
		var company = parsecompany(tc.participant);
		var key2 = generatekey(company, tc.curncy, tc.tradeDate);
		if (key === key2) {
			tc.hasSent = true;
		}
	}
}

/* GET users listing. */
router.get('/getTradeReport', function(req, res, next) {
	console.log('api/getTradeReport ');	
	var oms = req.app.get('oms');
	var v = oms.getAllTradeReport();

	list = [];
	for (i=0; i<v.length; i++) {
		data = v[i].json();
		list.push(data);
	}
	
	res.send({data:list});
	console.log('api/getTradeReport ' + {data:list});
});

router.post('/sendTradeReport', function(req, res, next) {
	console.log('api/sendTradeReport ' + req.body.trType + ',' + req.body.cp + ',' + JSON.stringify(req.body.legs));
	
	if (req.url === '/favicon.ico') {
	   res.writeHead(200, {'Content-Type': 'image/x-icon'} );
	   res.end();
	   console.log('favicon requested');
	   return;
	}
	
//	var map_block = req.app.get('map_block');
//	var id = Object.keys(map_block).length + 1;
//	var block = new BlockTradeReport();
//	var list = req.body.trList.tradeReports;
//	
//	var n = list.length;
//	for (i=0; i<n; i++) {
//		var j = list[i];
//		var tr = new TradeReport(j);
//		block.add(tr);
//	}
//	map_block[id] = block;
	
	var plVent = req.app.get('plVent');
//	var oms = req.app.get('oms');
//	var refId = oms.getOrderId();
	
//	plVent.SOD();
	
	try {
//		plVent.SendTradeReport1(refId, req.body.trType, req.body.symbol,
//				req.body.qty, req.body.delta, req.body.price,  
//				req.body.strat, req.body.futMat, req.body.cp);
		plVent.SendTradeReport(req.body.trType, req.body.symbol,
				req.body.qty, req.body.delta, req.body.price,  
				req.body.strat, req.body.futMat, req.body.cp,  
				req.body.side,
				req.body.legs);
		
//		var block_tr = new BlockTradeReport('', refId, status, trType, symbol, qty, delta, price, strat, cp, legs);
//		oms.addBlockTradeReport(refId, block_tr);
	}
	catch (err) {
		logger.error(err.message);
	}
	
	
	res.send('succ');
//	res.sendStatus(refId);
});


module.exports = router;
