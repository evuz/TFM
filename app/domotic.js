var gpio = require('rpi-gpio');
var admin = require('./admin');
var botTelegram = require('../botTelegram');

var busy = false;

var pinName = {
    hallLight: 7,
    alarmAlert: 21,
    doorDown: 11,
    doorUp: 13,
    bell: 15,
    alarmDetect: 23
};

var peepHolderEn = true;

var domotic = {
    photo: false,
    alarm: false,
    init: function () {
        var self = this;
        // for(var pin in pinName)
        gpio.setup(7, gpio.DIR_OUT);
        gpio.setup(21, gpio.DIR_OUT);
        gpio.setup(11, gpio.DIR_OUT);
        gpio.setup(13, gpio.DIR_IN, gpio.EDGE_RISING);
        gpio.setup(15, gpio.DIR_IN, gpio.EDGE_RISING);
        gpio.setup(23, gpio.DIR_IN, gpio.EDGE_RISING);

        gpio.on('change', function(channel) {
            switch (channel) {
                case pinName['doorDown']:
                    console.log(channel);
                    break;
                case pinName['doorUp']:
                    console.log(channel);
                    break;
                case pinName['bell']:
                    if(!self.photo && peepHolderEn)
                        self.photo = true;
                    break;
                case pinName['alarmDetect']:
                    if(!self.alarm)
                        self.alarm = true;
                    break;
            }
        });
    },
    writePin: function (pinN, value, callback) {
        var cb = callback || function () {};
        var pin = pinName[pinN];
        gpio.write(pin, value, function(err) {
            if (err) throw err;
            console.log('Written to pin');
            cb();
        });
    },
    peepHolderState: function (state) {
        peepHolderEn = state;
    }
};

module.exports = domotic;
