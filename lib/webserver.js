var express = require('express');
var http = require('http');
var Websocket = require('./websocket');

module.exports = Webserver;

function Webserver(port) {
    this.app = express();

    this.app.use(express.static('public'));
    this.app.use('/bower_components', express.static('bower_components'));

    this.http = http.Server(this.app);
    this.http.listen(port);
    console.log('Listening on port ' + port);

    this.io = new Websocket(this.http);
}