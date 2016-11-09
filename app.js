/**
 * Created by JGB on 10/09/16.
 */
var botTelegram = require("./botTelegram");
var pass = require("./app/password");
var config = require("./app/config");
var whoIs = require("./app/whoIs");
// var alarm = require("./alarm");
//alarm.initAlarm(0.25);

whoIs.init(1);
pass.init(10);
config.loadInitConfig();
botTelegram.init();