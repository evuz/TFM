/**
 * Created by JGB on 10/09/16.
 */
var botTelegram = require("./botTelegram");
var pass = require("./app/password");
var config = require("./app/config");
var user = require("./app/user");
var whoIs = require("./app/whoIs");
var weather = require("./app/weather");
var domotic = require("./app/domotic");

config.loadInitConfig();
setTimeout(function () {
    whoIs.init(1);
    domotic.init();
    weather.init(60);
    user.init(1);
    pass.init(10);
    botTelegram.wathDog(1);
    botTelegram.init();
}, 5*1000);