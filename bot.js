/**
 * Created by JGB on 9/09/16.
 */
var TelegramBot = require('node-telegram-bot-api');
var server = require("./server");
var photoCam = require("./photo");

var token = '221791769:AAGrGoOSc_dOegZLwaSsQq40C6XUrqiLfSY';
// Setup polling way
var bot = new TelegramBot(token, {polling: true});
bot.onText(/\/server (.+)/, function (msg, match) {
    var fromId = msg.from.id;
    var port = match[1];
    var s = server.iniciar(port);
    bot.sendMessage(fromId, s);
});

bot.onText(/\/echo (.+)/, function (msg, match) {
    var fromId = msg.from.id;
    var resp = match[1];
    bot.sendMessage(fromId, resp);
});

bot.onText(/\/photo/, function (msg) {
    var fromId = msg.from.id;
    var fs = require("fs");
    photoCam.takePhoto(fromId, function (filename) {
        bot.sendPhoto(fromId, filename, {caption: "Foto tomada!"});
    });
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