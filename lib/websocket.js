const SocketIo = require('socket.io');
const BackendCommunicator = require('./backendCommunicator');

module.exports = Websocket;

function Websocket(http) {
    var self = this;

    this.http = http;

    this.io = SocketIo(this.http);

    this.io.on('connection', function(socket) {
        var backendCommunicator = new BackendCommunicator('127.0.0.1', 3701);

        backendCommunicator.eventEmitter.on('command', function(action, data) {
            socket.emit(action, data);
        });
        backendCommunicator.eventEmitter.on('connected', function() {
            socket.emit('connected');
        });
        backendCommunicator.eventEmitter.on('socketError', function(error) {
            socket.emit('socketError', error);
        });
        backendCommunicator.eventEmitter.on('invalidRequest', function(error) {
            socket.emit('invalidRequest', error);
        });

        socket.on('command', function(action, data) {
            backendCommunicator.sendCommand(action, data);
        });

        socket.on('disconnect', function() {
            backendCommunicator.client.destroy();
        });
    });
}