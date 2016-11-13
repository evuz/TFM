var fs = require("fs");
var arp = require("../helpers/macDiscover");
var user = require('./user');
var admin = require('./admin');
var date = require('../helpers/date');
var botTalk = require('../helpers/botTalk');
var csv = require('../helpers/csv');
var alarm = require('../alarm');

var whoIs = {
    advise: false,
    filename: "",
    init: function (T) {
        var self = this;
        self.changeFilename();
        setInterval(function () {
            self.changeFilename();
        }, 60*1000);
        setInterval(function () {
            arp.getAllMAC("192.168.1.", function (mac) {
                var nAtHome = 0;
                var n = false;
                var nWhoAtHome = user.getUserByMAC(mac); // whoAtHome
                var whoAtHome = user.getUserAtHome(); // whoAtHome - 1
                for (var u in whoAtHome) {
                    var nState = nWhoAtHome[u].atHome;
                    var state = whoAtHome[u].atHome;
                    if(nState && state) {
                        nAtHome++;
                        // console.log(u + ' sigue dentro');
                    } else if (nState && !state) {
                        user.editUser(u, {atHome: date.getHour()});
                        nAtHome++;
                        n = true;
                        self.updateReg({name: whoAtHome[u].name, action: 'entra', hour: date.getHour()});
                        // console.log(u + ' ha entrado');
                    } else if (!nState && state) {
                        user.editUser(u, {atHome: null});
                        self.updateReg({name: whoAtHome[u].name, action: 'sale', hour: date.getHour()});
                        // console.log(u + ' ha salido');
                    } else {
                        // console.log(u + ' sigue fuera');
                    }
                }
                if (!nAtHome && self.advise) {
                    // console.log('No hay nadie en casa!');
                    var admins = admin.getAdminId();
                    for (var adm in admins) {
                        botTalk.talk(admins[adm], 'No hay nadie en casa.' +
                            '\n¿Desea activar la alarma?' +
                            '\n/' + user.getAction('alarmAct'));
                    }
                    self.advise = false;
                } else if(n && alarm.isActive()) {
                    for(var u in nWhoAtHome) {
                        if(nWhoAtHome[u].atHome) {
                            botTalk.talk(nWhoAtHome[u].id, "La alarma está activa." +
                                "\n¿Quieres desactivarla?" +
                                '\n/' + user.getAction('alarmDes'));
                        }
                    }
                } else if (nAtHome){
                    // console.log('Casa');
                    self.advise = true;
                }
            })
        }, T * 60 * 1000);
    },
    changeFilename: function () {
        var self = this;
        var today = date.getDay();
        if (today != this.filename) {
            self.filename = today;
            fs.readFile('files/reg/' + this.filename + '.csv', function (error) {
                if(error) {
                    console.log(error);
                    fs.writeFile('files/reg/' + self.filename + '.csv', "");
                }
            });
            csv.readCSV('reg.csv', function (reg) {
                reg.push({day: today});
                csv.writeCSV('reg.csv', reg);
            })
        }
    },
    updateReg: function (p) {
        var self = this;

        csv.readCSV('reg/' + self.filename + '.csv', function (reg) {
            reg.push(p);
            csv.writeCSV('reg/' + self.filename + '.csv', reg);
        })
    }
};

module.exports = whoIs;