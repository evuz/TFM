/**
 * Created by evuz on 22/09/16.
 */
var arp = require("./macDiscover");
var botTelegram = require("./botTelegram");

var mainUserId = 952738;
var usersByMAC = {};
var userAtHome = {};
var nUserAtHome = 0;
var advise = false;
var alarmActive = true;

function initAlarm(T) {
    usersByMAC["64:cc:2e:d9:bf:27"] = {name:"JGB"};
    setInterval(function () {
        arp.getAllMAC("192.168.1.", function (mac) {
            nUserAtHome = 0;
            mac.forEach(function (mac) {
                if (usersByMAC[mac] != undefined) {
                    userAtHome[mac] = usersByMAC[mac];
                    advise = true;
                    nUserAtHome++;
                }
            });
            if(nUserAtHome == 0 && alarmActive && advise) {
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