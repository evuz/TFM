var actions = {
    start: "start",
    password: "password",
    addUserTemp: "addUserTemp",
    server: "server"
};

var user = {
    /**
     *  alias = {
     *      id:
     *      name:
     *      mac:
     *      isAdmin:
     *      registered:
     *      currentState: {
     *          action:
     *          state:
     *      }
     *  }
     */
    users: {},
    newUser: function (username) {
        this.users[username] = {id: null, name: null, mac: null, isAdmin: false,
            registered: false, currentState: {action: null, state: null}};
    },
    editUser: function (username, p) {
        var user = this.users[username];

        for (var attr in p) {
            user[attr] = p[attr];
        }
    },
    isUser: function (username) {
        var users = this.users;
        if (users[username]) {
            return true;
        }
        return false;
    },
    setCurrentState: function (username, state, action) {
        var user = this.users[username];

        user['currentState'] = {action: action, state: state};
    },
    getCurrentState: function (username) {
        var user = this.users[username];

        return user['currentState'];
    },
    getUserProperties: function (username, p) {
        var user = this.users[username];
        var prop = {};

        for(var i in p) {
            prop[i] = user[i];
        }
        return prop;
    },
    isAction: function (p) {
        for(var action in actions) {
            if (actions[action] == p)
                return true;
        }
        return false;
    },
    getAction: function (p) {
        return actions[p];
    }
};

module.exports = user;

