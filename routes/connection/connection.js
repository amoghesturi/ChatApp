/**
 * Module related to socket.io methods
 * Initilization, event emitters etc.
 * Created by amoghesturi on 11/4/16.
 */
var io = require('socket.io');
var list = require('../userList'); // Global list of users (works with only one instance)

/**
 * Initilaizes the socket.io for the application
 * @param server
 */
module.exports.init = function(server) {
    io = io.listen(server);
    io.on('connection', ioConnection);
};

/**
 * Event emitters for the socket actions
 */
function ioConnection(socket) {
    console.log("User connected");
    console.log(socket.id);
    socket.on('chat message', onChatMessage);
    socket.on('users', onNewUser);
    socket.on('disconnect', onDisconnect);
}

/**
 * Called upon receiving new chat
 * @param message
 */
function onChatMessage(message) {
    console.log('message: ' + message.message);
    this.broadcast.emit('chat message', message);
}

/**
 * Called when a user disconnects
 */
function onDisconnect() {
    console.log(this.id + ' disconnects');
    var activeUsers = list.removeUser(this.id);
    io.emit('users', activeUsers);
}

/**
 * Called when a new user joins
 * @param request
 */
function onNewUser(request) {
    var userAdded = list.addUser(request.name, this.id);
    io.emit('users', userAdded);
}