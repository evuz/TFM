/**
 * Created by JGB on 9/09/16.
 */
var TelegramBot = require('node-telegram-bot-api');
var server = require("./server");
var pass = require("./password");
//var photoCam = require("./photo");
var actionBot = {
    config: "/config",
    passwd: "/passwd",
    server:"/server",
    photo:"/photo"
};
var currentState = {};
var bot;

var botTelegram = {
    init: function () {

        var token = '221791769:AAGrGoOSc_dOegZLwaSsQq40C6XUrqiLfSY';

        // Setup polling way
        bot = new TelegramBot(token, {polling: true});

        bot.on('text', function (msg) {
            var fromId = msg.from.id;
            var strArray = msg.text.split(" ");
            var action = strArray[0];
            if (action == actionBot.passwd) {
                var passwd = strArray[1];
                if (pass.isPasswd(passwd)) {
                    pass.addUser(fromId);
                    bot.sendMessage(fromId, "Contraseña correcta, usuario " +
                        fromId + " autorizado");
                } else {
                    bot.sendMessage(fromId, "Contraseña incorrecta");
                }
            } else if (action == actionBot.config){
                bot.sendMessage(fromId, "Introduce la contraseña");
                currentState[fromId] = {action: actionBot.config, state: "pass"};
            } else if (pass.isUser(fromId)) {
                if (action == actionBot.server) {
                    var port = strArray[1];
                    if (port) {
                        var s = server.iniciar(port);
                        bot.sendMessage(fromId, s);
                    } else {
                        bot.sendMessage(fromId, "No has introducido el formato correcto:\n" +
                            "/server <port>");
                    }
                }
            } else if (currentState[fromId]) {
                if (currentState[fromId].action == actionBot.config) {
                    var passwd = action;
                    if (pass.isPasswd(passwd)) {
                        bot.sendMessage(fromId, "Contraseña correcta, usuario " +
                            fromId + " autorizado");
                    } else {
                        bot.sendMessage(fromId, "Contraseña incorrecta");
                    }
                }
                currentState[fromId].action = "";
            } else {
                bot.sendMessage(fromId, "No eres un usuario autorizado" +
                    "\nIntroduce /passwd seguido de la contraseña");
            }
        });

        // /**
        //  * Función para el servidor
        //  */
        // bot.onText(/\/server (.+)/, function (msg, match) {
        //     var fromId = msg.from.id;
        //     if (pass.isUser(fromId)) {
        //         var port = match[1];
        //         var s = server.iniciar(port);
        //         bot.sendMessage(fromId, s);
        //     } else {
        //         answerPassword(fromId);
        //     }
        // });
        //
        // /**
        //  * Funciones manejo de Password
        //  */
        // bot.onText(/\/passwd (.+)/, function (msg, match) {
        //     var fromId = msg.from.id;
        //     var str = match[1];
        //     if (pass.isPasswd(str)) {
        //         pass.addUser(fromId);
        //         bot.sendMessage(fromId, "Contraseña correcta, usuario " +
        //             fromId + " autorizado");
        //     } else {
        //         bot.sendMessage(fromId, "Contraseña incorrecta");
        //     }
        // });
        //
        // bot.onText(/\/setpasswd (.+)/, function (msg, match) {
        //     var fromId = msg.from.id;
        //     var strArray = match[1].split(" ");
        //     var currentPass = strArray[0];
        //     var newPass = strArray[1];
        //     pass.isPasswd(currentPass, function () {
        //         pass.setPasswd(newPass);
        //         bot.sendMessage(fromId, "Contraseña cambiada");
        //     }, function () {
        //         bot.sendMessage(fromId, "Contraseña incorrecta");
        //     });
        // });
        //
        // /**
        //  * Función para hacer foto desde webcam
        //  */
        // // bot.onText(/\/photo/, function (msg) {
        // //     var fromId = msg.from.id;
        // //     var fs = require("fs");
        // //     photoCam.takePhoto(fromId, function (filename) {
        // //         bot.sendPhoto(fromId, filename, {caption: "Foto tomada!"});
        // //     });
        // // });
        //
        // /*
        //  * Funciones de prueba/ejemplo
        //  */
        // bot.onText(/\/echo (.+)/, function (msg, match) {
        //     var fromId = msg.from.id;
        //     var resp = match[1];
        //     bot.sendMessage(fromId, resp);
        // });
        //
        // // Matches /love
        // bot.onText(/\/love/, function (msg, match) {
        //     var chatId = msg.chat.id;
        //     var opts = {
        //         //reply_to_message_id: msg.message_id,
        //         reply_markup: JSON.stringify({
        //             keyboard: [
        //                 ['Yes, you are the bot of my life ❤'],
        //                 ['No, sorry there is another one...']]
        //         })
        //     };
        //     bot.sendMessage(chatId, 'Do you love me?', opts);
        // });
        //
        // function answerPassword(userID) {
        //     bot.sendMessage(userID, "No eres un usuario autorizado" +
        //         "\nIntroduce /passwd seguido de la contraseña");
        // }
    },
    talk: function (chatId, msg) {
        bot.sendMessage(chatId, msg);
    }
};
module.exports = botTelegram;