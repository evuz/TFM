var user = require('./user');

var actions = {
    help: {action: "help", description: ""},
    addUser: {action: "addMember", description: "Añade un usuario permamentemente al sistema"},
    addAdmin: {action: "addAdmin", description: "Añade un administrador al sistema"},
    rmAdmin: {action: "rmAdmin", description: "Elimina un administrador"},
    // addUsersCSV: {action: "addUsersCSV", description: ""},
    changePass: {action: "changePass", description: "Cambia la contraseña de usuario"},
    // whoAtHome: {action: "whoAtHome", description: ""},
    showReg: {action: "showReg", description: "Muestra un informe de entrada y salida de la casa"}
};

var admin = {
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
    },
    help: function () {
        var str = "Acciones de administrador: \n";
        for(var action in actions) {
            if(action == 'help') continue;
            str += '/' + actions[action].action + " - " + actions[action].description + "\n";
        }
        str += '\n' + user.help();

        return str;
    }
};

module.exports = admin;

