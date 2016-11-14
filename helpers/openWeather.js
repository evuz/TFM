var weather = require("openweather-node");

var openWeather= {
    init: function (apiId, cult, type) {
        weather.setAPPID(apiId);
        weather.setCulture(cult);
        weather.setForecastType(type);
    },
    getWeather: function (location, callback) {
        var ret = {};
        weather.now(location,function(err, datas) {
            if(err) ret.err = err;
            else
            {
                datas.forEach(function(aData)
                {
                    ret.temp = aData.getDegreeTemp().temp;
                    ret.weather = aData.values.weather[0].main;
                })
            }
            callback(ret);
        })

    }
};

module.exports = openWeather;
