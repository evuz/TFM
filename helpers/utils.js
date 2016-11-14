var botTelegram = require('../botTelegram');
// var config = require('../app/config');

utils = {
    talk: function (chatId, msg) {
        botTelegram.bot.sendMessage(chatId, msg);
    }
};

module.exports = utils;
