var date = {
    getHour: function () {
        var d = new Date();
        var date = this.pad(d.getHours()) + ':' +
            this.pad(9);
        return date;
    },
    pad: function (n) {
        if (n < 10) {
            n = '0' + n;
        }
        return n;
    }
};

module.exports = date;