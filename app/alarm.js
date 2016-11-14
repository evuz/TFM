var alarm = {
    active: false,
    activate: function () {
        this.active = true;
    },
    deactivate: function () {
        this.active = false;
    },
    isActive: function () {
        return this.active;
    }
};

module.exports = alarm;
