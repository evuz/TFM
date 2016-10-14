/**
 * Created by JGB on 9/09/16.
 */
var TelegramBot = require('node-telegram-bot-api');
var server = require("./server");
var config = require("./config");
var pass = require("./password");
//var photoCam = require("./photo");
var bot;

var botTelegram = {
    init: function () {

        var token = '221791769:AAGrGoOSc_dOegZLwaSsQq40C6XUrqiLfSY';

        // Setup polling way
        bot = new TelegramBot(token, {polling: true});

        /* Máquina de estados */
        bot.on('text', function (msg) {
            var fromId = msg.from.id;
            var strArray = msg.text.split(" ");
            var isAction = strArray[0].substring(0, 1);

            /* Diferencia si es una acción o no lo es, esto servirá luego
             cuando queramos interacción con el usuario */
            if (isAction == config.actionBot.isAction) {
                var action = strArray[0].split(config.actionBot.isAction)[1];
                /* Mira si es una acción conocida */
                if (action == config.actionBot[action]) {
                    if (action == config.actionBot.start) {
                        if (config.initConfig) {
                            bot.sendMessage(fromId, "Vamos a configurar la cuenta, " +
                            "para comenzar introduzca la contraseña");
                            config.currentState[fromId] = {action: config.actionBot.start, state: 3};
                        } else {
                            bot.sendMessage(fromId, "Este es el primer inicio del bot, " +
                                "usted va a ser el usuario administrador.\n" +
                                "Por favor, introduzca la contraseña de administrador.");
                            config.currentState[fromId] = {action: config.actionBot.start, state: 1};
                        }
                    } else if (action == config.actionBot.passwd) {
                        var passwd = strArray[1];
                        if (pass.isPasswd(passwd)) {
                            pass.addUser(fromId);
                            bot.sendMessage(fromId, "Contraseña correcta, usuario " +
                                fromId + " autorizado");
                        } else {
                            bot.sendMessage(fromId, "Contraseña incorrecta");
                        }
                    } else if (pass.isUser(fromId)) {
                        switch (action) {
                            case config.actionBot.server:
                                var port = strArray[1];
                                if (port) {
                                    var s = server.iniciar(port);
                                    bot.sendMessage(fromId, s);
                                } else {
                                    bot.sendMessage(fromId, "No has introducido el formato correcto:\n" +
                                        "/server <port>");
                                }
                                break;
                            default:
                                break;
                        }
                    } else {
                        bot.sendMessage(fromId, "No eres un usuario autorizado" +
                            "\nIntroduce /passwd seguido de la contraseña");
                    }
                } else {
                    bot.sendMessage(fromId, action + " no es una acción válida." +
                        "\nIntroduzca /help para ver las acciones válidas.");
                }
            } else {
                if (config.currentState[fromId].action == config.actionBot.start) {
                    // TODO: no está bien planteado, la primera debería pedir la contraseña de admin
                    // la segunda pedir la contraseña de usuarios. A partir de ahí ya seria configuración normal.
                    switch (config.currentState[fromId].state) {
                        case 1:
                            var password = strArray[0];
                            pass.setAdminPasswd(password);
                            pass.setAdminId(fromId);
                            bot.sendMessage(fromId, "Contraseña de administrador establecida." +
                            "\n Usted ahora es el administrador de la central domótica." +
                            "\n Estas son las acciones especiales que sólo usted puede realizar." +
                            "\n /setPasswd < newPassword > -> Cambia la contraseña del sistema" +
                            "\n /newUser < userId > -> Añade un usuario" +
                            "\n /rmUser < userId > -> Elimina a un usuario" +
                            "\n /showUser -> Muestra a todos los usuarios" +
                            "\n\nAhora introduzca la contraseña de usuario");
                            config.initConfig = true;
                            config.currentState[fromId].state = 2;
                            break;
                        case 2:
                            var password = strArray[0];
                            pass.setPasswd(password);
                            bot.sendMessage(fromId, "Contraseña establecida." +
                            "\n\nIntroduza su nombre");
                            config.currentState[fromId].state = 4;
                            break;
                        case 3:
                            var password = strArray[0];
                            if(pass.isPasswd(password)) {
                                bot.sendMessage(fromId, "Contraseña correcta." +
                                "\n\nIntroduza su nombre");
                                config.currentState[fromId].state = 4;
                            } else {
                                bot.sendMessage(fromId, "Contraseña incorrecta");
                                config.currentState[fromId].action = null;
                            }
                            break;
                        case 4:
                            var name = msg.text;
                            config.users[fromId] = {name: name};
                            bot.sendMessage(fromId, "Si estás conectado a la red de la central domótica introduce tu IP" +
                                "\n Si no estás en tu red, introduce 'fin'");
                            config.currentState[fromId].state = 5;
                            break;
                        case 5:
                            var ip = strArray[0];
                            if(ip == "no") {
                                bot.sendMessage("Hemos terminado la configuración de su usuario" +
                                    "\n recuerde introducir su IP cuando esté en casa con el comando" +
                                    "/myIP < suIP >." +
                                    "\n Para conocer todas las funciones de su central domótica introduzca el comando" +
                                    "/help");
                            } else {
                                config.users[fromId].ip = ip;
                                bot.sendMessage(fromId, "Hemos terminado la configuración de su usuario." +
                                    "\nPara conocer todas las funciones de su central domótica introduzca el comando " +
                                    "/help");
                            }
                    }
                } else {
                    bot.sendMessage(fromId, "No has ejecutado una acción");
                }
            }
        });
    },
    talk: function (chatId, msg) {
        bot.sendMessage(chatId, msg);
    }
    //         var action = strArray[0];
    //         if (action == actionBot.passwd) {
    //             var passwd = strArray[1];
    //             if (pass.isPasswd(passwd)) {
    //                 pass.addUser(fromId);
    //                 bot.sendMessage(fromId, "Contraseña correcta, usuario " +
    //                     fromId + " autorizado");
    //             } else {
    //                 bot.sendMessage(fromId, "Contraseña incorrecta");
    //             }
    //         } else if (action == actionBot.config){
    //             bot.sendMessage(fromId, "Introduce la contraseña");
    //             currentState[fromId] = {action: actionBot.config, state: "pass"};
    //         } else if (actionBot[action]) {
    //             console.log(actionBot[action]);
    //             if (action == actionBot.server) {
    //                 var port = strArray[1];
    //                 if (port) {
    //                     var s = server.iniciar(port);
    //                     bot.sendMessage(fromId, s);
    //                 } else {
    //                     bot.sendMessage(fromId, "No has introducido el formato correcto:\n" +
    //                         "/server <port>");
    //                 }
    //             }
    //         } else if (currentState[fromId] && currentState[fromId].action) {
    //             if (currentState[fromId].action == actionBot.config) {
    //                 var passwd = action;
    //                 if (pass.isPasswd(passwd)) {
    //                     bot.sendMessage(fromId, "Contraseña correcta, usuario " +
    //                         fromId + " autorizado");
    //                 } else {
    //                     bot.sendMessage(fromId, "Contraseña incorrecta");
    //                 }
    //             }
    //             currentState[fromId].action = "";
    //         } else {
    //             bot.sendMessage(fromId, "No eres un usuario autorizado" +
    //                 "\nIntroduce /passwd seguido de la contraseña");
    //         }
    //     });
    //
    //     /**
    //      * Función para el servidor
    //      */
    //     bot.onText(/\/server (.+)/, function (msg, match) {
    //         var fromId = msg.from.id;
    //         if (pass.isUser(fromId)) {
    //             var port = match[1];
    //             var s = server.iniciar(port);
    //             bot.sendMessage(fromId, s);
    //         } else {
    //             answerPassword(fromId);
    //         }
    //     });
    //
    //     /**
    //      * Funciones manejo de Password
    //      */
    //     bot.onText(/\/passwd (.+)/, function (msg, match) {
    //         var fromId = msg.from.id;
    //         var str = match[1];
    //         if (pass.isPasswd(str)) {
    //             pass.addUser(fromId);
    //             bot.sendMessage(fromId, "Contraseña correcta, usuario " +
    //                 fromId + " autorizado");
    //         } else {
    //             bot.sendMessage(fromId, "Contraseña incorrecta");
    //         }
    //     });
    //
    //     bot.onText(/\/setpasswd (.+)/, function (msg, match) {
    //         var fromId = msg.from.id;
    //         var strArray = match[1].split(" ");
    //         var currentPass = strArray[0];
    //         var newPass = strArray[1];
    //         pass.isPasswd(currentPass, function () {
    //             pass.setPasswd(newPass);
    //             bot.sendMessage(fromId, "Contraseña cambiada");
    //         }, function () {
    //             bot.sendMessage(fromId, "Contraseña incorrecta");
    //         });
    //     });
    //
    //     /**
    //      * Función para hacer foto desde webcam
    //      */
    //     // bot.onText(/\/photo/, function (msg) {
    //     //     var fromId = msg.from.id;
    //     //     var fs = require("fs");
    //     //     photoCam.takePhoto(fromId, function (filename) {
    //     //         bot.sendPhoto(fromId, filename, {caption: "Foto tomada!"});
    //     //     });
    //     // });
    //
    //     /*
    //      * Funciones de prueba/ejemplo
    //      */
    //     bot.onText(/\/echo (.+)/, function (msg, match) {
    //         var fromId = msg.from.id;
    //         var resp = match[1];
    //         bot.sendMessage(fromId, resp);
    //     });
    //
    //     // Matches /love
    //     bot.onText(/\/love/, function (msg, match) {
    //         var chatId = msg.chat.id;
    //         var opts = {
    //             //reply_to_message_id: msg.message_id,
    //             reply_markup: JSON.stringify({
    //                 keyboard: [
    //                     ['Yes, you are the bot of my life ❤'],
    //                     ['No, sorry there is another one...']]
    //             })
    //         };
    //         bot.sendMessage(chatId, 'Do you love me?', opts);
    //     });
    //
    //     function answerPassword(userID) {
    //         bot.sendMessage(userID, "No eres un usuario autorizado" +
    //             "\nIntroduce /passwd seguido de la contraseña");
    //     }
    // },
};
module.exports = botTelegram;