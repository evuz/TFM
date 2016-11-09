var date = {
    getHour: function () {
        var d = new Date();
        return this.pad(d.getHours()) + ':' +
            this.pad(d.getMinutes());
    },
    getDay: function () {
        var d = new Date();
        return  this.pad(d.getFullYear()) + '_' +
                this.pad(d.getMonth()) + '_' + this.pad(d.getDay());
    },
    pad: function (n) {
        if (n < 10) {
            n = '0' + n;
        }
        return n;
    }
};

module.exports = date;