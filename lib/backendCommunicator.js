const net = require('net');
const EventEmitter = require('events');

module.exports = function(host, port) {
    var self = this;

    this.client = null;
    this.eventEmitter = null;

    this.init = function(host, port) {
        this.client = new net.Socket();

        var puffer = '';
        this.client.on('data', function(data) {
            puffer += data;

            var dataArray = puffer.split(String.fromCharCode(0));
            for (var i = 0; i < dataArray.length - 1; i++) {
                try {
                    var object = JSON.parse(dataArray[i]);
                    if (typeof object.action === 'undefined') {
                        throw new Error('Data has no "action" field.');
                    }

                    self.eventEmitter.emit('command', object.action, object.data);
                } catch (e) {
                    self.eventEmitter.emit('invalidRequest', dataArray[i]);
                }
            }
            puffer = dataArray[dataArray.length - 1];
        });

        this.client.on('error', function(error) {
            self.eventEmitter.emit('socketError', error);
        });

        this.client.connect(port, host, function() {
            self.eventEmitter.emit('connected');
        });

        this.eventEmitter = new EventEmitter();
        this.eventEmitter.on('error', function(a) { });
    };
    this.init(host, port);

    this.sendCommand = function(action, data) {
        this.client.write(JSON.stringify({action: action, data: data}) + String.fromCharCode(0));
    };
};