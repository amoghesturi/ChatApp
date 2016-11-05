/**
 * Created by amoghesturi on 11/4/16.
 */

$('document').ready(function () {
    var socket = io();

    // Get the current user's username
    var currentUser = $('#currentUser #name');
    // If the page was refreshed, close the chat sction and open the new user section
    if (!currentUser.val()) {
        closeChat();
    }
    else {
        openChat()
    }

    /**
     * Upon adding a new user, A welcome message is shown for 2 seconds
     * User is added into the userList and other users are notified
     */
    $('#nickName form').submit(function () {
        var nickname = $(this).children('input').val().trim();
        if (!nickname) {
            return false;
        }
        // Display welcome message and hide after 2 seconds
        $('#currentUser #name').text('Welcome ' + nickname);
        setTimeout(function () {
            $('#currentUser').hide();
        }, 2000);

        $('#currentUser #name').val(nickname);

        // send the new user to the server
        socket.emit('users', {name: nickname});
        return false;
    });

    /**
     * Upon entering a new chat (message), it is sent to the server
     * which broadcasts to all users in the namespace.
     * The message sent is directly displayed on the messages section
     */
    $('#chatInput form').submit(function () {
        var msg = $('#m').val().trim();
        var nickname = $('#currentUser #name').val();
        if (!msg) {
            return false;
        }
        // send the chat details to the server
        var chat = {message: msg, sender: nickname}
        socket.emit('chat message', chat);

        // clear chat typing section
        $('#m').val('');

        // Populate the chat in the messages section
        var message = '<li class="self"><strong>' + nickname + '</strong>' +
            '</br>' + msg + '</br>' + new Date().toLocaleTimeString() + '</li>';
        $('#messages').append(message);

        return false;
    });

    /**
     * On receiving the new chat message from other users.
     * Displays the message along with sender and timestamp
     */
    socket.on('chat message', function (chat) {
        var nickname = chat.sender;
        var message = '<li class="chat"><strong>' + nickname + '</strong>' +
            '</br>' + chat.message + '</br>' + new Date().toLocaleTimeString() + '</li>';
        $('#messages').append(message);
    });

    /**
     * Called when new users are added, or user disconnects etc.
     * Displays the new user and user left messages
     */
    socket.on('users', function (users) {
        // Notify the user is somethign goes worng
        if (!users.error) {
            openChat(users.activeUsers);
        }
        else {
            alert('Something went wrong');
            console.error(users.message);
            closeChat();
        }

        // Show user joined or user left messages appropriately
        var nickname = $('#currentUser #name').val();
        if(users.newUser && nickname !== users.newUser) {
            var message = '<li class="userNotofication"><strong>' + users.newUser + '</strong> joined </li>'
            $('#messages').append(message);
        }
        if(users.userLeft) {
            var message = '<li class="userNotofication"><strong>' + users.userLeft + '</strong> left </li>'
            $('#messages').append(message);
        }
    });
});

/**
 * Shows messages, message typing and active users section
 * Hides new user and currentuser section
 * @param activeusers
 */
function openChat(activeusers) {
    $('#messages').show();
    $('#chatInput').show();
    $('#currentUser').show();
    $('#newUser').hide();
    if (activeusers) {
        $('#activeUsers').empty();
        $('#activeUsers').append('<li style="text-align: center; font-weight: bold" > Active users </li>')
        $('#activeUsers').append('<li style="text-align: center; font-weight: bold" > </li>') // Left empty purposefully
        activeusers.forEach(function (user) {
            $('#activeUsers').append('<li>' + user + '</li>')
        });
    }
}

/**
 * Hides messages, message typing and active users section
 * Shows new user and currentuser section
 */
function closeChat() {
    $('#messages').hide();
    $('#chatInput').hide();
    $('#currentUser').hide();
    $('#newUser').show();
}