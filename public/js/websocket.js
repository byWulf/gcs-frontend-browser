var socket = io();

socket.on('connected', function() {
    console.log('connected to backend');

    socket.emit('command', 'newsGetList', {items: 10, page: 0});
});
socket.on('socketError', function(error) {
    console.log('socketError: ', error);
});
socket.on('invalidRequest', function(error) {
    console.log('invalidRequest: ', error);
});

socket.on('ownUser', function(data) {
    $('#navUser').text('Logged in as ' + data.displayName)
        .attr('data-userid', data.id);
});

socket.on('newsList', function(data) {
    console.log("News: ", data);
});