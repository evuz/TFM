var config = require("./config");

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

function isPasswd(str) {
    return str === config.passwd;
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
        var time = Date.now() - config.users[i].hour;
        if (oneHour < time) {
            config.usersReg.splice(i,1);
        }
    }
}

exports.isUser = isUser;
exports.addUser = addUser;
exports.isPasswd = isPasswd;
exports.setPasswd = setPasswd;
exports.setAdminPasswd = setAdminPasswd;
exports.setAdminId = setAdminId
exports.init = init;

