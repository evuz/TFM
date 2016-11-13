var actions = {
    start: "start",
    password: "password",
    addUserTemp: "addUser",
    server: "server",
    alarmAct: "alarmAct",
    alarmDes: "alarmDes"
};

var user = {
    /**
     *  alias = {
     *      id:
     *      name:
     *      mac:
     *      isAdmin:
     *      registered:
     *      atHome:
     *      aux:
     *      reg:
     *      currentState: {
     *          action:
     *          state:
     *      }
     *  }
     */
    users: {},
    timeProv: 2,
    init: function () {
        var self = this;
        setInterval(function () {
            for(var u in self.users) {
                var reg = self.users[u].add;
                if(reg) {
                    var t = (Date.now() - reg)*1000;
                    if (t > (self.timeProv*1000)) {
                        delete self.users[u];
                        // Tiene que escribir en el CSV la nueva configuración
                    }
                }
            }
            console.log('Usuarios');
            for(var u in self.users) {
                console.log('@' + u);
            }
            console.log('\n');
        }, 15*1000);
    },
    newUser: function (username) {
        this.users[username] = {id: null, name: null, mac: null, isAdmin: false,
            registered: false, add: null, atHome:null, aux: null,
            currentState: {action: null, state: null}};
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
    getUserByMAC: function (arrayMAC) {
        var users = this.users;
        var usersByMAC = {};
        var m = {};

        for(var u in users) {
            usersByMAC[users[u].mac] = {username: u, id: users[u].id};
            m[u] = {atHome: false};
        }

        for (var i = 0; i < arrayMAC.length; i++) {
            if(usersByMAC[arrayMAC[i].mac]) {
                m[usersByMAC[arrayMAC[i].mac].username].atHome = true;
                m[usersByMAC[arrayMAC[i].mac].username].id = usersByMAC[arrayMAC[i].mac].id;
            }
        }
        return m;
    },
    getUserAtHome: function () {
        var users = this.users;
        var m = {};

        for (var u in users) {
            m[u] = {atHome: users[u].atHome, name: users[u].name};
        }

        return m;
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

