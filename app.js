/**
 * Created by JGB on 10/09/16.
 */
var botTelegram = require("./botTelegram");
var pass = require("./password");
var alarm = require("./alarm")

alarm.initAlarm(0.25);
pass.init();
botTelegram.init();