/**
 * Created by JGB on 10/09/16.
 */
var botTelegram = require("./botTelegram");
var pass = require("./password");
var alarm = require("./alarm");
var config = require("./config");

//alarm.initAlarm(0.25);
config.loadConfig();
pass.init();
botTelegram.init();