var gpio = require('rpi-gpio');
var admin = require('./admin');
var photo = require('../helpers/photo');
var botTalk = require('../helpers/utils');

var filename = "peepholder.png";

var pinName = {
    hallLight: 7,
    alarmAlert: 21,
    doorDown: 11,
    doorUp: 13,
    bell: 15,
    alarmDetect: 19
};

var domotic = {
    init: function () {
        // for(var pin in pinName)
        gpio.setup(7, gpio.DIR_OUT);
        gpio.setup(19, gpio.DIR_OUT);
        gpio.setup(21, gpio.DIR_OUT);
        gpio.setup(11, gpio.DIR_IN, gpio.EDGE_RISING);
        gpio.setup(13, gpio.DIR_IN, gpio.EDGE_RISING);
        gpio.setup(15, gpio.DIR_IN, gpio.EDGE_RISING);

        gpio.on('change', function(channel, value) {
            switch (channel) {
                case pinName['doorDown']:
                    break;
                case pinName['doorUp']:
                    break;
                case pinName['bell']:
                    photo.takePhoto(filename, function () {
                        var admins = admin.getAdminId();
                        for (var adm in admins) {
                            botTalk.photo(admins[adm], filename);
                        }
                    });
                    break;
                case pinName['alarmDetect']:
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
    }
};

module.exports = domotic;