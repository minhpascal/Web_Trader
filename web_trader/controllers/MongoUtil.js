var MongoClient = require('mongodb').MongoClient
	, assert = require('assert');
var db;

function MongoUtil() {
}

MongoUtil.prototype.connect = function(callback) {
	// Initialize connection once
	MongoClient.connect("mongodb://ds139985.mlab.com:39985/cm", function(err,
			database) {
		if (err) {
			console.log(err);
			database.close();
			throw err;
		} else {
			database.authenticate("lloyd.chan", "passw0rd", function(err, res) {
				if (err) {
					console.log(err);
					database.close();
					throw err;
				} else {
					db = database;
					console.log("connect mongodb");
					callback();
				}
			});
		}
	});
}

MongoUtil.prototype.findTradeConfoByDate = function(collName, sDate, callback) {
	console.log("findTradeConfoByDate ", sDate);
//	db.collection("tradeconfo").find({
	db.collection(collName).find({
		tradeDate : sDate
//		"tradeDate" : "05-Oct-16"
	}, function(err, docs) {
		callback(docs);
	});
}

MongoUtil.prototype.findLatestTradeConfo = function(collName, callback) {
	console.log("findLatestTradeConfo", collName);
	db.collection(collName).aggregate([
		{$sort: {"tradeConfoId" : 1, "lastModified" : 1}}
		, {$group: {
			_id: "$tradeConfoId", 
	        lastModified: {$first: "$lastModified"}, 
	        price: {$first: "$price"},
	        summary: {$first: "$summary"},
	        buyer: {$first: "$buyer"},
	        price: {$first: "$price"},
	        curncy: {$first: "$curncy"},
	        tradeDate: {$first: "$tradeDate"},
	        tradeConfoId: {$first: "$tradeConfoId"},
	        delta: {$first: "$delta"},
	        buyQty: {$first: "$buyQty"},
	        sellQty: {$first: "$sellQty"},
	        ptValue: {$first: "$ptValue"},
	        ptCny: {$first: "$ptCny"},
	        premiumPmt: {$first: "$premiumPmt"},
	        notationalCny: {$first: "$notationalCny"},
	        premiumCny: {$first: "$premiumCny"},
	        hedges: {$first: "$hedges"},
	        brokerageFee: {$first: "$brokerageFee"},
	        brokerageCny: {$first: "$brokerageCny"},
	        lastModified: {$first: "$lastModified"},
	        legs: {$first: "$legs"},
		}}
    ]).toArray(function(err, docs) {
    	assert.equal(null, err);
		callback(docs);
	});
}

MongoUtil.prototype.findAllTradeConfo = function(collName, callback) {
	console.log("findAllTradeConfo", collName);
	db.collection(collName).find({}, function(err, docs) {
		assert.equal(null, err);
//		if (err) {
//			conosle.log(err);
//			throw err;
//		}
//		else {
//			console.log(docs);
		callback(docs);
//		}
	});
}

module.exports = MongoUtil;
