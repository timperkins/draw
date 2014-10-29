var db = new MongoDB('mydb');

exports.addCollection = function(app, data) {
	var endpoint = data.endpoint,
		collectionName = data.collection,
		parent = data.parent,
		fields = data.fields;

	// CREATE
	app.post('/' + endpoint, function(req, res) {
		var dbData = {};

		for (var i=0; i<fields.length; i++) {
			var field = fields[i];
			dbData[field] = req.body[field];
		}

		if (parent) {
			dbData[parent + 'Id'] = req.body[parent + 'Id'];
		}

		console.log('dbData', dbData);
		
		db.query({
			collection: collectionName,
			action: 'insert',
			data: dbData,
			res: res
		});
	});

	// READ (single)
	app.get('/' + endpoint + '/:id', function(req, res) {
		var ObjectId = require('mongodb').ObjectID;

		// Cache drawing id
		// At some point this should be moved somewhere better
		if (endpoint == 'drawing') {
			db.drawingId = req.params.id;
		}

		db.query({
			collection: collectionName,
			action: 'find',
			data: {
				_id: ObjectId(req.params.id)
			},
			res: res
		});
	});

	// READ (bulk)
	app.get('/' + endpoint, function(req, res) {
		var ObjectId = require('mongodb').ObjectID;

		// console.log('params', req.body.x, typeof req.body.x);
		console.log('id', req.query);
		db.query({
			collection: collectionName,
			action: 'find',
			data: {},
			res: res
		});
	});

	// UPDATE
	app.put('/' + endpoint + '/:id', function(req, res) {
		var ObjectId = require('mongodb').ObjectID,
			data = {};

		for (var i=0; i<fields.length; i++) {
			var field = fields[i];
			data[field] = req.body[field];
		}

		if (parent) {
			data[parent + 'Id'] = req.body[parent + 'Id'];
		}

		db.query({
			collection: collectionName,
			action: 'update',
			id: ObjectId(req.params.id),
			data: data,
			res: res
		});
	});

	// DELETE
	app.delete('/' + endpoint + '/:id', function(req, res) {
		var ObjectId = require('mongodb').ObjectID;

		db.query({
			collection: collectionName,
			action: 'remove',
			id: ObjectId(req.params.id),
			data: {},
			res: res
		});
	});
};

function MongoDB(dbName) {
	var self = this,
		MongoClient = require('mongodb').MongoClient;

	self.cachedQueries = [];
	self.db;
	self.drawingId = null;

	MongoClient.connect("mongodb://localhost:27017/" + dbName, function(err, db) {
		if (!err) {
			console.log("Successfully connected to the db.");

			self.db = db;

			if (self.cachedQueries.length) {
				self.runQueries();
			}
		} else {
			console.log('Error connecting to the db', err);
		}
	});
}

MongoDB.prototype.query = function(qry) {
	var self = this;

	self.cachedQueries.push(qry);
	if (self.db) {
		self.runQueries();
	}
}

MongoDB.prototype.runQueries = function() {
	var self = this;

	// console.log('runQueries', self.cachedQueries);

	for (var i = 0; i < self.cachedQueries.length; i++) {
		var query = self.cachedQueries[i];

		switch(query.action) {
			case 'find':

				// Lookup layers by drawingId
				if (query.collection == 'layers' && self.drawingId) {
					var ObjectId = require('mongodb').ObjectID;

					console.log('find drawingId', self.drawingId);
					query.data.drawingId = self.drawingId;
				}
				
				self.db.collection(query.collection).find(query.data, function(err, dbRes) {
					dbRes.toArray(function(err, items) {
						// Replace _id with id
						for (var i=0; i<items.length; i++) {
							var item = items[i];
							if(item._id) {
								item.id = item._id;
								delete(item._id);
							}							
						}
						query.res.send(items);
					});
				});
				break;
			case 'insert':
				console.log('insert', query.data);
				self.db.collection(query.collection).insert(query.data, function(err, dbRes) {
					var item = dbRes[0];

					// Replace _id with id
					if(item._id) {
						item.id = item._id;
						delete(item._id);
					}
					query.res.send(item);
				});
				break;
			case 'update':
				self.db.collection(query.collection).update({
					_id: query.id
				}, query.data, function(err, dbRes) {
					// dbRes == 1 if OK
					query.res.send(query.data);
				});
				break;
			case 'remove':
				self.db.collection(query.collection).remove({
					_id: query.id
				}, function(err, dbRes) {
					// dbRes == 1 if OK
					query.res.send({
						id: query.id
					});
				});
				break;
		}
	}
	self.cachedQueries.length = 0;
}