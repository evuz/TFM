var utils = require('../helpers/utils');

var actions = {
    help: {action: "help", description: "Muestra todas las acciones del bot"},
    start: {action: "start", description: ""},
    admin: {action: "admin", description: ""},
    password: {action: "password", description: "Introduce la contraseña de usuario"},
    addUserTemp: {action: "addUser", description: "Añade un usuario temporalmente"},
    // server: {action: "server", description: ""},
    myMAC: {action: "myMAC", description: "Añada su MAC al sistema"},
    getTemp: {action: "temp", description: "Muestra la temperatura que hay en casa"},
    alarmAct: {action: "alarmAct", description: "Activa la alarma"},
    alarmDes: {action: "alarmDes", description: "Desactiva la alarma"},
    hallLightOn: {action: "salonLuzOn", description: "Enciende la luz del salón"},
    hallLightOff: {action: "salonLuzOff", description: "Apaga la luz del salón"},
    peepHolderOn: {action: "mirillaOn", description: "Habilita la opción de mirilla (activo por defecto)"},
    peepHolderOff: {action: "mirillaOff", description: "Deshabilita la opción de mirilla"}
};

var user = {
    /**
     *  alias = {
     *      id:
     *      name:
     *      mac:
     *      isAdmin:
     *      adminReg:
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
    init: function (T) {
        var self = this;
        setInterval(function () {
            for(var u in self.users) {
                var reg = self.users[u].add;
                if(reg) {
                    var t = (Date.now() - reg)*1000;
                    if (t > (self.timeProv*1000)) {
                        delete self.users[u];
                        // TODO: Eliminar el usuario del CSV
                        // utils.saveUsers();
                    }
                }
            }
            // console.log('Usuarios');
            for(var u in self.users) {
                // console.log('@' + u);
            }
            // console.log('\n');
        }, T*60*1000);
    },
    newUser: function (username) {
        this.users[username] = {id: null, name: null, mac: null, isAdmin: false,
            adminReg: false, registered: false, add: null, atHome:null, aux: null,
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
            if (actions[action].action == p)
                return true;
        }
        return false;
    },
    getAction: function (p) {
        return actions[p].action;
    },
    help: function () {
        var str = "Acciones de usuario: \n";
        for(var action in actions) {
            if(action == 'start' || action == 'admin'|| action == 'server') continue;
            str += '/' + actions[action].action + " - " + actions[action].description + "\n";
        }

        return str;
    }
};

module.exports = user;

