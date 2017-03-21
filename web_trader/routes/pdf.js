var express = require('express');
var router = express.Router();

var path = require('path');
var fs = require('fs');

var pjson = require('../package.json');

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.sendFile(path.join(__dirname, '../public', 'pdf.html'));
});

//router.get('/test.pdf', function(req, res, next) {
router.get('/*', function(req, res, next) {
//	res.sendFile(path.join(__dirname, '../public', 'pdf.html'));
	var url = req.url;
	var file = url.replace('/','');
	
	var tempFile = pjson.pdf_dir + file;
//	  var tempFile = "/home/lloyd/git/Web_Trader/web_trader/public/javascripts/pdf/" + file;
	fs.readFile(tempFile, function (err, data){
		res.contentType("application/pdf");
		res.send(data);
	});
});

module.exports = router;
