var socket = io();

socket.on('connected', function() {
    console.log('connected to backend');

    socket.emit('command', 'news.getList', {items: 10, page: 0});
});
socket.on('socketError', function(error) {
    console.log('socketError: ', error);
});
socket.on('invalidRequest', function(error) {
    console.log('invalidRequest: ', error);
});

socket.on('user.ownDetails', function(data) {
    $('#navUser').text('Logged in as ' + data.displayName)
        .attr('data-userid', data.id);
});

socket.on('news.list', function(data) {
    console.log("News: ", data);
});