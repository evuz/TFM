var csv = require("./csv");

var config = {
    initConfig: false,
    passwd: "1234",
    adminPass: ",.,ñpqei",
    adminId: 0,
    users: {},
    usersReg: [],
    usersAtHome: {},
    nUsersAtHome: {},
    actionAdmin: {
        addUser: "addUser",
        csvConfigExample: "csvConfigExample"
    },
    actionBot: {
        isAction: "/",
        start: "start",
        config: "config",
        passwd: "passwd",
        server:"server",
        photo:"photo"
    },
    currentState: {},
    addUser: function (userId, name, mac) {
        var self = this;
        if (!userId)
            return;
        if(!name) name = self.users[userId].name;
        if(!mac) mac = self.users[userId].mac;

        if(!self.users[userId]) {
            self.users[userId] = {};
        }

        self.users[userId].name = name;
        self.users[userId].mac = mac;

        self.saveUsers();
    },
    loadInitConfig: function () {
        var self = this;
        self.loadConfig("initConfig.csv");
        self.loadUsers("initUsers.csv");
    },
    loadConfig: function (filename) {
        var self = this;
        csv.readCSV(filename, function (data) {
            if (data[0].initConfig == "true") {
                self.initConfig = true;
            } else {
                self.initConfig = false;
            }
            if(data[0].passwd)
                self.passwd = data[0].passwd;
            if (data[0].adminPass)
                self.adminPass = data[0].adminPass;
            if (data[0].adminId)
                self.adminId = data[0].adminId;
        });
    },
    loadUsers: function (filename) {
        var self = this;
        csv.readCSV(filename, function (data) {
            for(var i = 0; i < data.length; i++) {
                if (data[i].name == "null")
                    data[i].name = null;
                if (data[i].mac == "null")
                    data[i].mac = null;
                self.addUser(data[i].id, data[i].name, data[i].mac);
            }
        })
    },
    saveConfig: function () {
        var data = [];
        data[0] = {initConfig: this.initConfig, passwd: this.passwd,
        adminPass: this.adminPass, adminId: this.adminId};
        csv.writeCSV("initConfig.csv", data);
    },
    saveUsers: function () {
        var self = this;
        var data = [];
        var i = 0;

        for(var user in self.users) {
            data[i] = {id: user, name: self.users[user].name, mac: self.users[user].mac};
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
