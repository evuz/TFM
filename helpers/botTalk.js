var botTelegram = require('../botTelegram');

botTalk = {
    talk: function (chatId, msg) {
        botTelegram.bot.sendMessage(chatId, msg);
    }
};

module.exports = botTalk;
