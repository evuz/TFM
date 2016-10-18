var config = require("./config");
var keys = ['0', '1', '2', '3', '4', '5' , '6', '7', '8', '9'];

function isUser(userID) {
    for(var i = 0; i < config.usersReg.length; i++) {
        if (config.usersReg[i].id == userID)
            return true;
    }
    return false;
}

function addUser (userID) {
    config.usersReg.push({id: userID, hour: Date.now()});
}

function isPasswd(str, kb) {
    var newPass = "";
    var p = true;
    if (kb == undefined) {
        newPass = config.passwd;
        p = false;
    }

    if (p) {
        for (var i = 0; i < config.passwd.length; i++) {
            var l = config.passwd.substring(i, i + 1);
            newPass += kb[l];
        }
    }

    return str === newPass;
}

function rmUser(userId) {
    for(var i = 0; i < config.usersReg.length; i++) {
        if (config.usersReg[i].id == userId)
            config.usersReg.splice(i,1);
    }
}

function setPasswd(newPass) {
    config.passwd = newPass;
}

function setAdminPasswd(newPass) {
    config.adminPass = newPass;
}

function setAdminId(adminId) {
    config.adminId = adminId;
}

function init() {
    setInterval(checkUserTime, 5*60*1000);
}

function checkUserTime() {
    for(var i = 0; i < config.usersReg.length; i++) {
        var oneHour = 60*60*1000;
        var time = Date.now() - config.usersReg[i].hour;
        if (oneHour < time) {
            config.usersReg.splice(i,1);
        }
    }
}

function getKeyboard(oneTime, callback) {
    var keysB = [];
    var keysRamdon = [];

    for (var i = 0; i < keys.length; i++) {
        keysB[i] = keys[i];
    }

    nKeys = keysB.length;
    for (var i = 0; i < nKeys; i++) {
        var ramdon = Math.floor(Math.random()*keysB.length);
        keysRamdon[i] = keysB[ramdon];
        keysB.splice(ramdon, 1);
    }

    var kb = {
        reply_markup: JSON.stringify({
            one_time_keyboard: oneTime,
            keyboard: [
                [
                    {
                        text: keysRamdon[1],
                        callback_data: '1'
                    },
                    {
                        text: keysRamdon[2],
                        callback_data: '2'
                    },
                    {
                        text: keysRamdon[3],
                        callback_data: '3'
                    }
                ],
                [
                    {
                        text: keysRamdon[4],
                        callback_data: '4'
                    },
                    {
                        text: keysRamdon[5],
                        callback_data: '5'
                    },
                    {
                        text: keysRamdon[6],
                        callback_data: '6'
                    }
                ],
                [
                    {
                        text: keysRamdon[7],
                        callback_data: '7'
                    },
                    {
                        text: keysRamdon[8],
                        callback_data: '2'
                    },
                    {
                        text: keysRamdon[9],
                        callback_data: '9'
                    }
                ],
                [
                    {
                        text: keysRamdon[0],
                        callback_data: '0'
                    }
                ]
            ]
        })
    };
    callback(kb);
    return keysRamdon;
}

exports.isUser = isUser;
exports.addUser = addUser;
exports.isPasswd = isPasswd;
exports.setPasswd = setPasswd;
exports.setAdminPasswd = setAdminPasswd;
exports.setAdminId = setAdminId;
exports.getKeyboard = getKeyboard;
exports.init = init;

