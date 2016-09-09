/**
 * Created by JGB on 9/09/16.
 */
var TelegramBot = require('node-telegram-bot-api');

var token = '221791769:AAGrGoOSc_dOegZLwaSsQq40C6XUrqiLfSY';
// Setup polling way
var bot = new TelegramBot(token, {polling: true});
bot.on('text', function (msg) {
    var chatId = msg.chat.id;
    bot.sendMessage(chatId, msg.from.first_name + " ha enviado " + msg.text);
});