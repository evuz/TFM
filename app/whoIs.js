var arp = require("../helpers/macDiscover");
var user = require('./user');
var date = require('../helpers/date');

var whoIs = {
    advise: true,
    init: function (T) {
        var self = this;
        setInterval(function () {
            arp.getAllMAC("192.168.1.", function (mac) {
                var nAtHome = 0;
                var nWhoAtHome = user.getUserByMAC(mac); // whoAtHome
                var whoAtHome = user.getUserAtHome(); // whoAtHome - 1
                for (var u in whoAtHome) {
                    var nState = nWhoAtHome[u].atHome;
                    var state = whoAtHome[u].atHome;
                    if(nState && state) {
                        nAtHome++;
                        console.log(u + ' sigue dentro');
                    } else if (nState && !state) {
                        user.editUser(u, {atHome: date.getHour()});
                        nAtHome++;
                        console.log(u + ' ha entrado');
                    } else if (!nState && state) {
                        user.editUser(u, {atHome: null});
                        console.log(u + ' ha salido');
                    } else {
                        console.log(u + ' sigue fuera');
                    }
                }
                if (!nAtHome && advise) {
                    console.log('No hay nadie en casa!')
                    advise = false;
                } else if (nAtHome){
                    advise = true;
                }
            })
        }, T * 60 * 1000);
    }
};

module.exports = whoIs;