# Draw

This is a kick-butt app that uses SVG + AngularJS.

***

## Setup

1. Install Node.js
2. Add your SSH key to this repo
3. In terminal, initialize/start the node server:

```sh
$ git clone git@github.com:timperkins/draw.git
$ cd draw/server
$ npm install
$ node server.js
```

4. Open another terminal, initialize the client:

```sh
$ cd draw/client
$ sudo npm -g install grunt-cli bower
$ npm install
$ bower install
$ grunt watch
```

5. Open up localhost:3000
