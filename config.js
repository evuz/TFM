var csv = require('./helpers/csv');
var user = require('./app/user');

var config = {
    initConfig: false,
    passwd: null,
    adminPass: null,
    loadInitConfig: function () {
        var self = this;
        self.loadConfig("initConfig.csv");
        self.loadUsers("initUsers.csv");
    },
    loadConfig: function (filename) {
        var self = this;
        csv.readCSV(filename, function (data) {
            if(!data[0])
                return;
            if (data[0].initConfig)
                self.initConfig = (data[0].initConfig == 'true');
            if(data[0].passwd)
                self.passwd = data[0].passwd;
            if (data[0].adminPass)
                self.adminPass = data[0].adminPass;
        });
    },
    loadUsers: function (filename) {
        var self = this;
        csv.readCSV(filename, function (data) {
            for(var i = 0; i < data.length; i++) {
                user.newUser(data[i].username);
                var p = {};
                if (data[i].id)
                    p.id = data[i].id;
                if (data[i].name)
                    p.name = data[i].name;
                if (data[i].mac)
                    p.mac = data[i].mac;
                if (data[i].isAdmin)
                    p.isAdmin = (data[i].isAdmin == 'true');
                user.editUser(data[i].username, p);
            }
        })
    },
    saveConfig: function () {
        var data = [];
        data[0] = {initConfig: this.initConfig, passwd: this.passwd,
        adminPass: this.adminPass};
        csv.writeCSV("initConfig.csv", data);
    },
    saveUsers: function () {
        var users = user.users;
        var data = [];
        var i = 0;

        for(var u in users) {
            data[i] = {username: u ,id: users[u].id, name: users[u].name, mac: users[u].mac
                , isAdmin: users[u].isAdmin};
            i++;
        }

        csv.writeCSV("initUsers.csv", data);
    },
    rooms: {
        salon: {
            luz: {state: false, value: false},
            persiana: {state: false, value: false},
            aire: {state: false, value: false}
        },
        patio: {
            puerta: {state: false, value: false},
            luz: {state: false, value: false},
            alarma: {state: false, value: false},
            timbre: {state: false, value: false}
        },
        habitacion: {
            luz: {state: false, value: false},
            persiana: {state: false, value: false},
            aire: {state: false, value: false}
        },
        cocina:{
            luz: {state: false, value: false},
            persiana: {state: false, value: false},
            vitro: {state: false, value: false}
        }
    },
    showRooms: function () {
        self = this;
        for(var room in self.rooms) {
            var p = self.rooms[room];
            console.log("** " + room + " **");
            for(var a in p) {
                console.log(a + ": state -> " + p[a].state +
                    " value -> " + p[a].value);
            }
        }
    }
};

module.exports = config;
