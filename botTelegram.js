/**
 * Created by JGB on 9/09/16.
 */

function botTelegram () {
    var TelegramBot = require('node-telegram-bot-api');
    var server = require("./server");
    var pass = require("./password");
    //var photoCam = require("./photo");

    var token = '221791769:AAGrGoOSc_dOegZLwaSsQq40C6XUrqiLfSY';

    // Setup polling way
    var bot = new TelegramBot(token, {polling: true});

    /*
     * Función para el servidor
     */
    bot.onText(/\/server (.+)/, function (msg, match) {
        var fromId = msg.from.id;
        if(pass.isUser(fromId)) {
            var port = match[1];
            var s = server.iniciar(port);
            bot.sendMessage(fromId, s);
        } else {
            answerPassword(fromId);
        }
    });

    /*
     * Funciones manejo de Password
     */
    bot.onText(/\/passwd (.+)/, function (msg, match) {
        var fromId = msg.from.id;
        var str = match[1];
        pass.isPasswd(str, function () {
            pass.addUser(fromId);
            bot.sendMessage(fromId, "Contraseña correcta, usuario " +
                fromId + " autorizado");
        }, function () {
            bot.sendMessage(fromId, "Contraseña incorrecta");
        })
    });

    bot.onText(/\/setpasswd (.+)/, function (msg, match) {
        var fromId = msg.from.id;
        var strArray = match[1].split(" ");
        var currentPass = strArray[0];
        var newPass = strArray[1];
        pass.isPasswd(currentPass, function () {
            pass.setPasswd(newPass);
            bot.sendMessage(fromId, "Contraseña cambiada");
        }, function () {
            bot.sendMessage(fromId, "Contraseña incorrecta");
        });
    });

    /*
     * Función para hacer foto desde webcam
     */
    // bot.onText(/\/photo/, function (msg) {
    //     var fromId = msg.from.id;
    //     var fs = require("fs");
    //     photoCam.takePhoto(fromId, function (filename) {
    //         bot.sendPhoto(fromId, filename, {caption: "Foto tomada!"});
    //     });
    // });

    /*
     * Funciones de prueba/ejemplo
     */
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

    function answerPassword(userID) {
        bot.sendMessage(userID, "No eres un usuario autorizado" +
            "\nIntroduce /passwd seguido de la contraseña");
    }
}

exports.init = botTelegram;