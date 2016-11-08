var user = require ('./user');
var config = require("./config");

var password = {
    init: function (t) {
        setInterval(this.checkUserTime, t*60*1000);
    },
    checkUserTime: function() {
        var users = user.users;

        for (var u in users) {
            var us = users[u];
            if(!us.registered) {
                continue;
            }

            var oneHour = 60*60*1000;
            var time = Date.now() - us.registered;
            if (oneHour < time) {
                this.UnRegUser(u);
            }
        }
    },
    regUser: function (username) {
        user.editUser(username, {registered: Date.now()})
    },
    UnRegUser: function (username) {
        user.editUser(username, {registered: false})
    },
    isReg: function(username) {
        var u = user.users[username];

        if (u.registered) {
            return true
        } else {
            return false;
        }
    },
    checkPass:function (pass) {
        if(pass.length != 4)
            return false;

        for (var i = 0; i < pass.length; i++) {
            var n = pass.substring(i, i + 1);
            if(isNaN(n))
                return false;
        }
        return true;
    },
    setPassword: function(newPass, key) {
        var pass = this.decodePass(newPass, key);

        config.passwd = pass;
        config.saveConfig();
        return pass;
    },
    setAdminPasswd: function (newPass) {
        config.adminPass = newPass;
        config.saveConfig();
    },
    isPassword: function (pass, key) {
        var decPass = this.decodePass(pass,key);

        return decPass == config.passwd;
    },
    generatePass: function () {
        var length = 4;
        if(config.passwd)
            length = config.passwd.length;
        var key = "";
        for (var i = 0; i < length; i++) {
            var aux = Math.floor(Math.random()*9);
            key += aux.toString() + " ";
        }
        return key;
    },
    decodePass: function (encPass, key) {
        var aux;
        var auxKey;
        var auxPass;
        var pass = "";

        for (var i = 0; i < encPass.length; i++) {
            aux = encPass.substring(i, i+1);
            aux = parseInt(aux);
            auxKey = key.substring(i*2, i*2 + 1);
            auxKey = parseInt(auxKey);

            auxPass = aux - auxKey;

            if(auxPass < 0) {
                aux += 10;
                auxPass = aux - auxKey;
            }

            pass += auxPass.toString();
        }
        return pass;
    }
};

module.exports = password;

// function isUser(userID) {
//     for(var i = 0; i < config.usersReg.length; i++) {
//         if (config.usersReg[i].id == userID)
//             return true;
//     }
//     return false;
// }

// function addUser (userID) {
//     config.usersReg.push({id: userID, hour: Date.now()});
// }

// function isPasswd(str, kb) {
//     var newPass = "";
//     var p = true;
//     if (kb == undefined) {
//         newPass = config.passwd;
//         p = false;
//     }
//
//     if (p) {
//         for (var i = 0; i < config.passwd.length; i++) {
//             var l = config.passwd.substring(i, i + 1);
//             newPass += kb[l];
//         }
//     }
//
//     return str === newPass;
// }

// function rmUser(userId) {
//     for(var i = 0; i < config.usersReg.length; i++) {
//         if (config.usersReg[i].id == userId)
//             config.usersReg.splice(i,1);
//     }
// }

// function setPassword(newPass) {
//     config.passwd = newPass;
//     config.saveConfig();
// }
//
// function setAdminPasswd(newPass) {
//     config.adminPass = newPass;
//     config.saveConfig();
// }

// function setAdminId(adminId) {
//     config.adminId = adminId;
//     config.saveConfig();
// }

// function init(t) {
//     setInterval(checkUserTime, t*60*1000);
// }


// exports.isUser = isUser;
// exports.addUser = addUser;
// exports.isPasswd = isPasswd;
// exports.setPassword = setPassword;
// exports.setAdminPasswd = setAdminPasswd;
// exports.setAdminId = setAdminId;
// exports.getKeyboard = getKeyboard;
// exports.init = init;


// function getKeyboard(oneTime, callback) {
//     var keysB = [];
//     var keysRamdon = [];
//
//     for (var i = 0; i < keys.length; i++) {
//         keysB[i] = keys[i];
//     }
//
//     nKeys = keysB.length;
//     for (var i = 0; i < nKeys; i++) {
//         var ramdon = Math.floor(Math.random()*keysB.length);
//         keysRamdon[i] = keysB[ramdon];
//         keysB.splice(ramdon, 1);
//     }
//
//     var kb = {
//         reply_markup: JSON.stringify({
//             one_time_keyboard: oneTime,
//             keyboard: [
//                 [
//                     {
//                         text: keysRamdon[1],
//                         callback_data: '1'
//                     },
//                     {
//                         text: keysRamdon[2],
//                         callback_data: '2'
//                     },
//                     {
//                         text: keysRamdon[3],
//                         callback_data: '3'
//                     }
//                 ],
//                 [
//                     {
//                         text: keysRamdon[4],
//                         callback_data: '4'
//                     },
//                     {
//                         text: keysRamdon[5],
//                         callback_data: '5'
//                     },
//                     {
//                         text: keysRamdon[6],
//                         callback_data: '6'
//                     }
//                 ],
//                 [
//                     {
//                         text: keysRamdon[7],
//                         callback_data: '7'
//                     },
//                     {
//                         text: keysRamdon[8],
//                         callback_data: '2'
//                     },
//                     {
//                         text: keysRamdon[9],
//                         callback_data: '9'
//                     }
//                 ],
//                 [
//                     {
//                         text: keysRamdon[0],
//                         callback_data: '0'
//                     }
//                 ]
//             ]
//         })
//     };
//     callback(kb);
//     return keysRamdon;
// }

