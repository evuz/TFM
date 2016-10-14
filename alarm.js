/**
 * Created by evuz on 22/09/16.
 */
var arp = require("./macDiscover");
var botTelegram = require("./botTelegram");
var config = require("./config");

var mainUserId = 952738;
var usersByMAC = {};
var advise = false;
var alarmActive = true;

function initAlarm(T) {
    usersByMAC["64:cc:2e:d9:bf:27"] = {name:"JGB"};
    setInterval(function () {
        arp.getAllMAC("192.168.1.", function (mac) {
            config.nUsersAtHome = 0;
            mac.forEach(function (mac) {
                if (usersByMAC[mac] != undefined) {
                    config.usersAtHome[mac] = usersByMAC[mac];
                    advise = true;
                    config.nUsersAtHome++;
                }
            });
            if(config.nUsersAtHome == 0 && alarmActive && advise) {
                botTelegram.talk(mainUserId, "No hay nadie en casa\n " +
                    "Si quieres activar la alarma usa el comando /activarAlarma");
                advise = false;
            }
        })
    }, T*60*1000);
}

function setAlarm(state) {
    alarmActive = state;
}

exports.initAlarm = initAlarm;