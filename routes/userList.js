/**
 * Created by amoghesturi on 11/4/16.
 */

/**
 * Global list of users
 * @type {Array}
 */
module.exports.userList = {};

/**
 * Adds a new user to the global list given the nickname and socket id
 * @param user
 * @param socketId
 * @returns {*}
 */
module.exports.addUser = function(user, socketId) {
    if(user === undefined || socketId === undefined) {
        console.log('nickName: ' + user);
        console.log('socketId: ' + socketId);
        return {error: true, message: 'nickname or socket id missing' };
    }
    try {
        var contains = this.userList[socketId];
        if(contains === undefined) {
            this.userList[socketId] = user.trim();
            var activeUsers = getSortedUsers(this.userList);
            return { error: false, message: 'successfully addded', activeUsers: activeUsers, newUser: user};
        }
        else {
            var activeUsers = getSortedUsers(this.userList);
            return { error: false, message: 'already exists'};
        }
    }
    catch(err) {
        return {error: true, message: err.message };
    }
};

/**
 * Removes the user from the global list given the socketId
 * @param socketId
 * @returns {*}
 */
module.exports.removeUser = function(socketId) {
    try {
        var nickname = this.userList[socketId];
        var userDeleted = delete this.userList[socketId];
        if(userDeleted) {
            var activeUsers = getSortedUsers(this.userList);
            return { error: false, message: 'successfully removed', activeUsers: activeUsers, userLeft: nickname};
        }
        else {
            return { error: false, message: 'user does not exist' };
        }
    }
    catch(err) {
        return {error: true, message: err.message };
    }
};

/**
 * Returs list of all the nicknames
 */
module.exports.getUsers = function() {
    return getSortedUsers(this.userList);
};

/**
 * Returns list of nick names given hasmap of socketId:nickname
 * @param userList
 * @returns {Array.<*>}
 */
function getSortedUsers(userList) {
    var sortedUsers = [];
    for(var id in userList) {
        sortedUsers.push(userList[id]);
    }
    return sortedUsers.sort();
}