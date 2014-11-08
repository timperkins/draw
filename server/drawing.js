// var fields = {
// 	title: 'string',
// 	layers: [

// 	]
// };

exports.init = function(app, mongoDB) {
	
	// CREATE
	app.post('/drawing', function(req, res) {
		// TODO: validate all of these
		var dbData = {
			title: req.body['title'],
			layers: req.body['layers'],
			background: req.body['background']
		};

		mongoDB.db.collection('drawings').insert(dbData, function(err, dbRes) {
			var item = dbRes[0];

			// Replace _id with id
			if(item._id) {
				item.id = item._id;
				delete(item._id);
			}

			// Cache drawing id
			mongoDB.drawingId = item.id;

			res.send(item);
		});
	});

	// READ (bulk)
	app.get('/drawing', function(req, res) {
		mongoDB.db.collection('drawings').find({}, function(err, dbRes) {
			dbRes.toArray(function(err, items) {
				// Replace _id with id
				for (var i=0; i<items.length; i++) {
					var item = items[i];
					if(item._id) {
						item.id = item._id;
						delete(item._id);
					}							
				}

				res.send(items);
			});
		});
	});

	// UPDATE
	app.put('/drawing/:id', function(req, res) {
		var ObjectId = require('mongodb').ObjectID,
			dbData = {
				title: req.body['title'],
				layers: req.body['layers'],
				background: req.body['background']
			},
			id = ObjectId(req.params.id);

		// for (var i=0; i<fields.length; i++) {
		// 	var field = fields[i];
		// 	data[field] = req.body[field];
		// }

		mongoDB.db.collection('drawings').update({
			_id: id
		}, dbData, function(err, dbRes) {
			// dbRes == 1 if OK
			res.send(dbData);
		});
	});


};