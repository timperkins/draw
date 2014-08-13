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
var buildFolder = path.resolve(__dirname, '../client/build');
app.use('/static/', express.static(buildFolder));

app.all('/*', function(req, res) {
  // Just send the index.html for other files to support HTML5Mode
  res.sendfile('index.html', { root: config.distFolder });
});

// Start up the server on the port specified in the config
server.listen(config.listenPort, '0.0.0.0', 511, function() {
  
});
console.log('Listening on port: ' + config.listenPort);
