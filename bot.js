/**
 * Created by JGB on 9/09/16.
 */
var TelegramBot = require('node-telegram-bot-api');

var token = '221791769:AAGrGoOSc_dOegZLwaSsQq40C6XUrqiLfSY';
// Setup polling way
var bot = new TelegramBot(token, {polling: true});
bot.onText(/\/echo (.+)/, function (msg, match) {
    var fromId = msg.from.id;
    var resp = match[1];
    bot.sendMessage(fromId, resp);
});

// Matches /love
bot.onText(/\/love/, function (msg, match) {
    var chatId = msg.chat.id;
    var opts = {
        //reply_to_message_id: msg.message_id,
        reply_markup: JSON.stringify({
            keyboard: [
                ['Yes, you are the bot of my life ❤'],
                ['No, sorry there is another one...']]
        })
    };
    bot.sendMessage(chatId, 'Do you love me?', opts);
});