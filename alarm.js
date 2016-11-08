/**
 * Created by evuz on 22/09/16.
 */
var arp = require("./helpers/macDiscover");
var botTelegram = require("./botTelegram");
var config = require("./app/config");

var usersByMAC = {};
var advise = false;
var alarmActive = true;

function initAlarm(T) {

    setInterval(function () {
        arp.getAllMAC("192.168.1.", function (mac) {
            if(lengthObject(config.users) != lengthObject(usersByMAC)) {
                setUsers();
            }
            config.nUsersAtHome = 0;
            mac.forEach(function (mac) {
                if (usersByMAC[mac] != undefined) {
                    config.usersAtHome[mac] = usersByMAC[mac];
                    advise = true;
                    config.nUsersAtHome++;
                }
            });
            if(config.nUsersAtHome == 0 && alarmActive && advise) {
                botTelegram.talk(config.adminId, "No hay nadie en casa\n " +
                    "Si quieres activar la alarma usa el comando /activarAlarma");
                advise = false;
            }
        })
    }, T*60*1000);
}

function lengthObject(obj) {
    var count = 0;
    for (var n in obj) {
        count++;
    }

    return count;
}

function setUsers() {
    for(var user in config.users) {
        usersByMAC[config.users[user].mac] = {name: config.users[user].name};
    }
}

function setAlarm(state) {
    alarmActive = state;
}

exports.initAlarm = initAlarm;