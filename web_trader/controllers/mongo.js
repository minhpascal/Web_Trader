///**
// * http://usejsdoc.org/
// */
//var MongoClient = require('mongodb').MongoClient;
//var pjson = require('../package.json');
//console.log(pjson.mongo_url);
//
//var myCollection;
//var db;
//MongoClient.connect(pjson.mongo_url, function(err, database) {
//	// db = MongoClient.connect(pjson.mongo_url, function(err, db) {
//	if (err)
//		throw err;
//	console.log("connected to the mongoDB !");
//	database.authenticate(pjson.mongo_user, pjson.mongo_password, function(err, res) {
//		if (err)
//			throw err;
//	});
//	
//	db = database;
////	myCollection = db.collection('tradeconfo');
//	// findDocument('tradeconfo', callback);
//});
//
//var callback = function(err, data) {
//	if (err) {
//		return console.error(err);
//	} else {
//		console.log(data);
//	}
//}

// function findDocument(onFinded){
function findDocument(collection, callback) {
	// myCollection = db.collection('tradeconfo');
	var cursor = myCollection.find({
		// field : value
		"tradeDate" : "05-Oct-16"
	});
	cursor.each(function(err, doc) {
		if (err)
			throw err;
		if (doc == null)
			return;

		console.log("document find:");
		console.log(doc._id);
		console.log(doc._class);
		console.log(doc.rate);
		console.log(doc.legs);
		// console.log(doc.company.employed);
		// onFinded();
		var TradeConf;

		callback(TradeConf);
	});
}

var express = require('express');
var mongodb = require('mongodb');
var app = express();

var MongoClient = require('mongodb').MongoClient;
var db;

// Initialize connection once
MongoClient.connect("mongodb://ds139985.mlab.com:39985/cm", function(err,
		database) {
	if (err)
		throw err;
	database.authenticate("lloyd.chan", "passw0rd", function(err,
			res) {
		if (err)
			throw err;
		db = database;
	});

//	// Start the application after the database connection is ready
	app.listen(3000);
	console.log("Listening on port 3000");
});

// Reuse database object in request handlers
//app.get("/", function(req, res) {
//	console.log("get");
//	db.collection("tradeconfo").find({
//		"tradeDate" : "05-Oct-16"
//	}, function(err, docs) {
//		docs.each(function(err, doc) {
//			if (doc) {
//				console.log(doc);
//			} else {
//				res.end();
//			}
//		});
//	});
//});

module.exports = app;
