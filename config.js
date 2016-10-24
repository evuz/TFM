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
        addUser: "addUser"
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
    loadConfig: function () {
        var self = this;
        csv.readCSV("config.csv", function (data) {
            if (data[0].initConfig == "true") {
                self.initConfig = true;
            } else {
                self.initConfig = false;
            }
            if(data[0].adminPass)
                self.adminPass = data[0].adminPass;
            if(data[0].passwd)
                self.passwd = data[0].passwd;
            if (data[0].adminPass)
                self.adminPass = data[0].adminPass;
            if (data[0].adminId)
                self.adminId = data[0].adminId;
        });
        csv.readCSV("users.csv", function (data) {
            for(var i = 0; i < data.length; i++) {
                self.users[data[i].id] = {name: data[i].name, mac: data[i].mac}
            }
        })
    },
    saveConfig: function () {
        var data = [];
        data[0] = {initConfig: this.initConfig, passwd: this.passwd,
        adminPass: this.adminPass, adminId: this.adminId};
        csv.writeCSV("config.csv", data);
    },
    saveUsers: function () {
        var self = this;
        var data = [];
        var i = 0;

        for(var user in self.users) {
            data[i] = {id: user, name: self.users[user].name, mac: self.users[user].mac};
            i++;
        }

        csv.writeCSV("users.csv", data);
    }
};

module.exports = config;
