# Draw

This is a kick-butt app that uses SVG + AngularJS.

***

## Setup

- Install Node.js
- Add your SSH key to this repo on GitHub
- In terminal, clone the repo
```sh
$ git clone git@github.com:timperkins/draw.git
```
- initialize/start the node server:
```sh
$ cd draw/server
$ npm install
$ node server.js
```

- Open another terminal, initialize the client:

```sh
$ cd draw/client
$ sudo npm -g install grunt-cli bower
$ npm install
$ bower install
$ grunt watch
```

- Open up localhost:3000

## TODO
- ~~~remove toolbar on drawings panel~~~
- fix background edit
- delete Drawing
- disable Drawing sort
- better icon for Drawing
- save color in Drawing
- create new Drawing on load if no Drawings exist
- rotation
- text
- triangles
- pen tool + dynamic # of shape sides
- folders
- users
