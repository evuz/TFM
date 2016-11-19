var gpio = require('rpi-gpio');

var pinName = {
    hallLight: 7,
    gardenAwning: 19,
    gardenDoor: 21,
    doorDown: 11,
    doorUp: 13,
    bell: 15
};

var domotic = {
    init: function () {
        gpio.setup(7, gpio.DIR_OUT);
        gpio.setup(19, gpio.DIR_OUT);
        gpio.setup(21, gpio.DIR_OUT);
        gpio.setup(11, gpio.DIR_IN);
        gpio.setup(13, gpio.DIR_IN);
        gpio.setup(15, gpio.DIR_IN);
    },
    writePin: function (pinN, value) {
        var pin = pinName[pinN];
        gpio.write(pin, value, function(err) {
            if (err) throw err;
            console.log('Written to pin');
        });
    }
};

module.exports = domotic;