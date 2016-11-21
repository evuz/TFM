var gpio = require('rpi-gpio');
var admin = require('./admin');
var photo = require('../helpers/photo');
var botTelegram = require('../botTelegram');

var filename = "peepholder.png";
var busy = false;

var pinName = {
    hallLight: 7,
    alarmAlert: 21,
    doorDown: 11,
    doorUp: 13,
    bell: 15,
    alarmDetect: 23
};

var domotic = {
    init: function () {
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
                    if(!busy) {
                        busy = true;
                        photo.takePhoto(filename, function () {
                            var admins = admin.getAdminId();
                            for (var adm in admins) {
                                botTelegram.photo(admins[adm], filename);
                            }
                            busy = false;
                        });
                    }
                    break;
                case pinName['alarmDetect']:
                    console.log(channel);
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
