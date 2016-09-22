var users = [];
var passwd = "1234";

function isUser(userID) {
    for(var i = 0; i < users.length; i++) {
        if (users[i].id == userID)
            return true;
    }
    return false;
}

function addUser (userID) {
    users.push({id: userID, hour: Date.now()});
}

function isPasswd(str) {
    return str === passwd;
}

function rmUser(userId) {
    for(var i = 0; i < users.length; i++) {
        if (users[i].id == userID)
            users.splice(i,1);
    }
}

function setPasswd(newPass) {
    passwd = newPass;
}

function init() {
    setInterval(checkUserTime, 5*60*1000);
}

function checkUserTime() {
    for(var i = 0; i < users.length; i++) {
        var oneHour = 60*60*1000;
        var time = Date.now() - users[i].hour;
        if (oneHour < time) {
            users.splice(i,1);
        }
    }
}

exports.isUser = isUser;
exports.addUser = addUser;
exports.isPasswd = isPasswd;
exports.setPasswd = setPasswd;
exports.init = init;

