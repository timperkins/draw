var validLayerFields = {
	width: function(width) {
		return isInt(width);
	},
	height: function(height) {
		return isInt(height);
	},
	color: function(color) {
		return isString(color);
	},
	fillOpacity: function(fillOpacity) {
		return isInt(fillOpacity);
	},
	radius: function(radius) {
		return isInt(radius);
	},
	title: function(title) {
		return isString(title); 
	},
	stroke: function(stroke) {
		return isInt(stroke.width) && isString(stroke.color);
	},
	type: function(type) {
		return isString(type);
	},
	x: function(x) {
		return isInt(x);
	},
	y: function(y) {
		return isInt(y);
	},
	content: function(content) {
		return isString(content);
	},
	fontSize: function(fontSize) {
		return isInt(fontSize) && isPositive(fontSize);
	},
	src: function(src) {
		return isLink(src);
	}
};

var validStateFields = {
	color: function(color) {
		return isColor(color);
	},
	tool: function(tool) {
		return isString(tool);
	},
	fontSize: function(fontSize) {
		return isInt(fontSize) && isPositive(fontSize);
	}
};

var validPhotoGalleryFields = {
	src: function(src) {
		return isLink(src);
	}
};

exports.init = function(app, mongoDB) {
	
	// CREATE
	app.post('/drawing', function(req, res) {
		// TODO: validate all of these
		var dbData = {
			title: req.body['title'],
			layers: getValidLayers(req.body.layers),
			state: getValidState(req.body.state),
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
				layers: getValidLayers(req.body.layers),
				state: getValidState(req.body.state),
				photoGallery: getValidPhotoGallery(req.body.photoGallery),
				background: req.body['background']
			},
			id = ObjectId(req.params.id);

		mongoDB.db.collection('drawings').update({
			_id: id
		}, dbData, function(err, dbRes) {
			// dbRes == 1 if OK
			res.send(dbData);
		});
	});

	// DELETE
	app.delete('/drawing/:id', function(req, res) {
		var ObjectId = require('mongodb').ObjectID;

		mongoDB.db.collection('drawings').remove({
			_id: ObjectId(req.params.id)
		}, function(err, dbRes) {
			// dbRes == 1 if OK
			res.send({
				id: ObjectId(req.params.id)
			});
		});
	});
};

function getValidLayers(dirtyLayers) {
	var validLayers = [];
	if (dirtyLayers) {
		for (var i=0; i<dirtyLayers.length; i++) {
			var layer = dirtyLayers[i],
				validLayer = {};

			for (var validField in validLayerFields) {
				if (layer[validField]) {
					if (validLayerFields[validField](layer[validField])) {
						validLayer[validField] = layer[validField];
					}
				}
			}

			validLayers.push(validLayer);
		}
	}
	return validLayers;
}

function getValidState(dirtyState) {
	var validState = {};
	for (var validField in validStateFields) {
		if (dirtyState[validField]) {
			if (validStateFields[validField](dirtyState[validField])) {
				validState[validField] = dirtyState[validField];
			}
		}
	}
	return validState;
}

function getValidPhotoGallery(dirtyPhotoGallery) {
	var validPhotoGallery = [];
	if (dirtyPhotoGallery) {
		for (var i=0; i<dirtyPhotoGallery.length; i++) {
			var photo = dirtyPhotoGallery[i],
				validPhoto = {};

			for (var validField in validPhotoGalleryFields) {
				if (photo[validField]) {
					if (validPhotoGalleryFields[validField](photo[validField])) {
						validPhoto[validField] = photo[validField];
					}
				}
			}

			validPhotoGallery.push(validPhoto);
		}
	}
	return validPhotoGallery;
}

function isInt(value) {
	return !isNaN(value) && 
		parseInt(Number(value)) == value && 
		!isNaN(parseInt(value, 10));
}

function isPositive(value) {
	return value > 0;
}

function isString(value) {
	return typeof value == 'string';
}

function isColor(value) {
	return value.charAt(0) == '#' && (value.length == 7 || value.length == 4);
}

function isLink(value) {
	return typeof value == 'string';
}