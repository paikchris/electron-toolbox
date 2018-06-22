const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

// Connection URL
const dbUrl = "mongodb://localhost:27017";

// Database Name
const dbName = "toolbox";

exports.insert = function(insertDoc) {
	MongoClient.connect(dbUrl, function(err, client) {
		assert.equal(null, err);
		console.log("Connected correctly to server");

		const db = client.db(dbName);

		// Insert a single document
		db.collection("project").insertOne(insertDoc, function(err, r) {
			assert.equal(null, err);
			assert.equal(1, r.insertedCount);

			// Insert multiple documents
			// db.collection("inserts").insertMany([{ a: 2 }, { a: 3 }], function(err, r) {
			// 	assert.equal(null, err);
			// 	assert.equal(2, r.insertedCount);

			//
			// });
			client.close();
		});
	});
};

exports.update = function(collectionName, query, updatedObj) {
	MongoClient.connect(dbUrl, function(err, client) {
		assert.equal(null, err);
		console.log("Connected correctly to server");

		const db = client.db(dbName);

		const col = db.collection(collectionName);

		// Insert a single document

		col.updateOne(query, updatedObj, function(err, r) {
			assert.equal(null, err);
			assert.equal(1, r.matchedCount);
			assert.equal(1, r.modifiedCount);
			client.close();
		});
	});
};

exports.find = function(collectionName, query, options) {
	MongoClient.connect(dbUrl, function(err, client) {
		assert.equal(null, err);
		console.log("Connected correctly to server");

		const db = client.db(dbName);

		const col = db.collection(collectionName);

		return col.find(query, options);
	});
};

exports.findAll = function(collectionName, resultCB) {
	MongoClient.connect(dbUrl, function(err, client) {
		assert.equal(null, err);
		console.log("Connected correctly to server");

		const db = client.db(dbName);

		const col = db.collection(collectionName);

		let test = col.find().toArray(function(err, results) {
			console.log(results);
			resultCB(err, results);
		});
	});
};
