var http = require('http'),
	express = require('express'),
	path = require('path'),
	config = {
	  listenPort: 3000,
	  distFolder: path.resolve(__dirname, '../client/build'),
	  staticUrl: '/static',
	},
	app = express(),
	bodyParser = require('body-parser'),
	server = http.createServer(app),
	buildFolder = path.resolve(__dirname, '../client/build'),
	storage = require('./storage');

app.use(bodyParser.json()); // to support JSON-encoded bodies

storage.addCollection(app, {
	endpoint: 'layer',
	collection: 'layers',
	parent: 'drawing',
	parentCollection: 'drawings',
	fields: ['width', 'height', 'x', 'y', 'color', 'fillOpacity', 'radius', 'title', 'type', 'prev'] // missing stroke.color and stroke.width (cannot contain ".")
});
storage.addCollection(app, {
	endpoint: 'drawing',
	collection: 'drawings',
	fields: ['title']
});


// a middleware with no mount path; gets executed for every request to the app
app.use(function (req, res, next) {
  console.log('Time:', Date.now());
  next();
});


app.use('/static/', express.static(buildFolder));

app.all('/*', function(req, res) {
  // Just send the index.html for other files to support HTML5Mode
  res.sendfile('index.html', { root: config.distFolder });
});

// Start up the server on the port specified in the config
server.listen(config.listenPort, '0.0.0.0', 511, function() {
  
});
console.log('Listening on port: ' + config.listenPort);
