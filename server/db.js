exports.init = function(dbName) {
	return new MongoDB(dbName);
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
				// if (query.collection == 'layers' && self.drawingId) {

				// 	console.log('find drawingId', self.drawingId);
				// 	query.data.drawingId = self.drawingId;
				// }
				
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

					// Callback
					if (query.cb) {
						query.cb(item);
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