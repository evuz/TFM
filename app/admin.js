var user = require('./user');

var actions = {
    addUser: "addMember",
    addAdmin: "addAdmin",
    rmAdmin: "rmAdmin",
    addUsersCSV: "addUsersCSV",
    changePass: "changePass",
    whoAtHome: "whoAtHome",
    showReg: "showReg"
};

var admin = {
    isAction: function (p) {
        for(var action in actions) {
            if (actions[action] == p)
                return true;
        }
        return false;
    },
    getAction: function (p) {
        return actions[p];
    },
    isAdmin: function (username) {
        var u = user.users[username];
        return u.isAdmin;
    },
    setAdmin: function (username, isAdmin) {
        user.editUser(username, {isAdmin: isAdmin});
    },
    getAdminId: function () {
        var users = user.users;
        var adminId = [];
        for (var u in users) {
            if (users[u].isAdmin) {
                adminId.push(users[u].id);
            }
        }
        return adminId;
    }
};

module.exports = admin;

