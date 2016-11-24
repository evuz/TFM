var openWeather = require('../helpers/openWeather');

var temp = null;
var conditions = null;
var coordinates = [];

var weather = {
    init: function (T) {
        openWeather.init('7f2ae1ed0f60a02c0eb752936304f2b9', 'sp', 'daily');
        this.setTemp();
        setInterval(function () {
            this.setTemp();
        }, T*60*1000);
    },
    setTemp: function () {
        if(coordinates[0]) {
            openWeather.getWeather([coordinates], function (obj) {
                if(obj.err) {

                } else {
                    temp = obj.temp;
                    conditions = obj.weather;
                }
            });
        }
    },
    getTemp: function () {
        return temp;
    },
    setCoordinates: function (lat, long) {
        coordinates[0] = lat;
        coordinates[1] = long;
        this.setTemp();
    },
    getCoordiantes: function () {
        return coordinates;
    }
};

module.exports = weather;
