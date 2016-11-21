var botTelegram = require('../botTelegram');
var date = require('./date');
// var config = require('../app/config');

utils = {
    talk: function (chatId, msg) {
        botTelegram.bot.sendMessage(chatId, msg);
    },
    photo: function (ID, filename) {
        botTelegram.sendPhoto(ID, filename, {caption: date.getHour()});
    }
};

module.exports = utils;
