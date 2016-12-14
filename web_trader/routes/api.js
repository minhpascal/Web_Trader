var express = require('express');
var router = express.Router();
var path = require('path');
var BlockTradeReport = require('../models/BlockTradeReport');
var TradeReport = require('../models/TradeReport');

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
//router.get('/getTradeConfo', function(req, res, next) {
//	
//	var list = req.app.get('list');
//	res.send({data:list});
//	console.log('api/getTradeConfo ' + {data:list});
//});

router.post('/sendTradeReport', function(req, res, next) {
	console.log('api/sendTradeReport... ' + JSON.stringify(req.body.trList));
	
	if (req.url === '/favicon.ico') {
	   res.writeHead(200, {'Content-Type': 'image/x-icon'} );
	   res.end();
	   console.log('favicon requested');
	   return;
	}
	
	var map_block = req.app.get('map_block');
	var id = Object.keys(map_block).length + 1;
	var block = new BlockTradeReport();
	var list = req.body.trList.tradeReports;
	
	var n = list.length;
	for (i=0; i<n; i++) {
		var j = list[i];
		var tr = new TradeReport(j);
		block.add(tr);
	}
	map_block[id] = block;
	
	var plVent = req.app.get('plVent');
	plVent.SendTradeReport(id, JSON.stringify(req.body.trList));
});


module.exports = router;
