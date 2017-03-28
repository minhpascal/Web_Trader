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

//	var file = url.replace('/','').replace(/%20/g, ' ');
//	var tempFile = pjson.temp_dir + file;
	
//	console.log('/pdf ' + tempFile);
	
	var file = url.replace(/%20/g, ' ');
	console.log('/pdf ' + file);
	
//	  var tempFile = "/home/lloyd/git/Web_Trader/web_trader/public/javascripts/pdf/" + file;
//	var tempFile = "/home/lloyd/cmsfo/temp/CELERAEQ-2017-22345 KS200 APR17_MAY17 270 1x1 CTS 100 REF 269.5 (MAR17) NH.pdf";
//	fs.readFile(tempFile, function (err, data){
	fs.readFile(file, function (err, data){
		res.contentType("application/pdf");
		res.send(data);
	});
});

module.exports = router;
