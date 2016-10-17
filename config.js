/**
 * Created by JGB on 08/10/2016.
 */
var config = {
    initConfig: false,
    passwd: "1234",
    adminPass: ",.,ñpqei",
    users: {},
    usersReg: [],
    usersAtHome: {},
    nUsersAtHome: {},
    adminId: 0,
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
    currentState: {}
};

module.exports = config;
