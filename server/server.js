var http = require('http');
var express = require('express');
var path = require('path');
var config = {
  listenPort: 3000,
  distFolder: path.resolve(__dirname, '../client/build'),
  staticUrl: '/static',
}

var app = express();
var server = http.createServer(app);

// app.use(express.logger());


// app.use(express.static(__dirname + '/public'));
// app.use('/bower_components',  express.static(__dirname + '/bower_components'));

var buildFolder = path.resolve(__dirname, '../client/build');

// console.log('bf', buildFolder);

// app.use(express.static(buildFolder));
// app.use('*.woff', function(req, res, next) {
// 	res.contentType('font/opentype');
// 	next();
// });
// app.use(function(req, res, next) {
// 	console.log('use');
// })
app.use('/static/', express.static(buildFolder));

app.all('/*', function(req, res) {
  // Just send the index.html for other files to support HTML5Mode
  res.sendfile('index.html', { root: config.distFolder });
});

// Start up the server on the port specified in the config
server.listen(config.listenPort, '0.0.0.0', 511, function() {
  // // Once the server is listening we automatically open up a browser
  // var open = require('open');
  // open('http://localhost:' + config.listenPort + '/');
});
console.log('Listening on port: ' + config.listenPort);
// console.log('static', express.static(__dirname + '/public'));