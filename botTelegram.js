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

        bot.on('document', function (doc) {
            var filename = doc.document.file_name;

            switch (filename) {
                case "config.csv":
                    break;
                case "users.csv":
                    break;
                default:
                    break;
            }
        });

        /* Máquina de estados */
        bot.on('text', function (msg) {
            var fromId = msg.from.id;
            var strArray = msg.text.split(" ");
            var isAction = strArray[0].substring(0, 1);

            if (!config.initConfig || config.users[fromId]) {
                /* Diferencia si es una acción o no lo es, esto servirá luego
                 cuando queramos interacción con el usuario */
                if (isAction == config.actionBot.isAction) {
                    var action = strArray[0].split(config.actionBot.isAction)[1];
                    /* Mira si es una acción conocida */
                    if (fromId.toString() == config.adminId &&
                        config.actionAdmin[action]) {
                        switch (action) {
                            case config.actionAdmin.addUser:
                                bot.sendMessage(fromId, "Introduce el id del usuario");
                                config.currentState[fromId] = {
                                    action: config.actionAdmin.addUser,
                                    state: 1
                                };
                                break;
                            case config.actionAdmin.csvConfigExample:
                                bot.sendDocument(fromId, "initConfig.csv");
                                break;
                            default:
                                break;
                        }
                    } else if (action == config.actionBot[action]) {
                        if (action == config.actionBot.start) {
                            if (config.initConfig) {
                                bot.sendMessage(fromId, "Vamos a configurar la cuenta, " +
                                    "para comenzar introduzca su nombre");
                                config.currentState[fromId] = {action: config.actionBot.start, state: 4};
                            } else {
                                bot.sendMessage(fromId, "Este es el primer inicio del bot, " +
                                    "usted va a ser el usuario administrador.\n" +
                                    "Por favor, introduzca la contraseña de administrador.");
                                config.currentState[fromId] = {action: config.actionBot.start, state: 1};
                            }
                        } else if (action == config.actionBot.passwd) {
                            config.currentState[fromId] = {kb: pass.getKeyboard(false, function (kb) {
                                bot.sendMessage(fromId, "Introduzca la contraseña", kb);
                            })};
                            config.currentState[fromId].action = config.actionBot.passwd;
                            config.currentState[fromId].state = "";
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
                                config.currentState[fromId].state = 2;
                                break;
                            case 2:
                                password = strArray[0];
                                pass.setPasswd(password);
                                bot.sendMessage(fromId, "Contraseña establecida." +
                                    "\n\nIntroduza su nombre");
                                config.currentState[fromId].state = 4;
                                pass.addUser(fromId);
                                break;
                            case 3:
                                password = strArray[0];
                                if (pass.isPasswd(password)) {
                                    bot.sendMessage(fromId, "Contraseña correcta." +
                                        "\n\nIntroduza su nombre");
                                    config.currentState[fromId].state = 4;
                                    pass.addUser(fromId);
                                } else {
                                    bot.sendMessage(fromId, "Contraseña incorrecta");
                                    config.currentState[fromId].action = null;
                                }
                                break;
                            case 4:
                                var name = msg.text;
                                config.addUser(fromId, name);
                                // config.users[fromId] = {name: name};
                                bot.sendMessage(fromId, "Si estás conectado a la red de la central domótica " +
                                    "introduce tu MAC" +
                                    "\n Si no estás en tu red, introduce 'fin'");
                                config.currentState[fromId].state = 5;
                                break;
                            case 5:
                                var ip = strArray[0];
                                if (ip == "no") {
                                    bot.sendMessage("Hemos terminado la configuración de su usuario" +
                                        "\n recuerde introducir su IP cuando esté en casa con el comando" +
                                        "/myMAC < suMAC >." +
                                        "\n Para conocer todas las funciones de su central domótica introduzca " +
                                        "el comando /help");
                                } else {
                                    config.addUser(fromId, null, ip);
                                    // config.users[fromId].ip = ip;
                                    bot.sendMessage(fromId, "Hemos terminado la configuración de su usuario." +
                                        "\nPara conocer todas las funciones de su central domótica " +
                                        "introduzca el comando /help");
                                }
                                config.currentState[fromId].action = null;
                                config.currentState[fromId].state = null;
                                if (!config.initConfig)
                                    config.initConfig = true;
                                config.saveConfig();
                        }
                    } else if (config.currentState[fromId].action == config.actionAdmin.addUser) {
                        switch (config.currentState[fromId].state) {
                            case 1:
                                var userId = strArray[0];
                                config.addUser(userId, null, null);
                                // config.users[userId] = {name: null, ip: null};
                                bot.sendMessage(fromId, "Has añadido al usuario con ID " + userId);
                                break;
                            default:
                                break;
                        }
                    } else if (config.currentState[fromId].action == config.actionBot.passwd) {
                        if (config.currentState[fromId].state.length == 3) {
                            config.currentState[fromId].state += msg.text;
                            if (pass.isPasswd(config.currentState[fromId].state,
                                    config.currentState[fromId].kb)) {
                                pass.getKeyboard(true, function (kb) {
                                    bot.sendMessage(fromId, "Contraseña correcta, usuario " + fromId
                                        + " añadido", kb)
                                });
                                pass.addUser(fromId);
                            } else {
                                pass.getKeyboard(true, function (kb) {
                                    bot.sendMessage(fromId, "Contraseña incorrecta")
                                });
                            }
                        } else {
                            config.currentState[fromId].state += msg.text;
                        }
                    } else {
                        bot.sendMessage(fromId, "No has ejecutado una acción");
                    }
                }
            } else if (msg.text == "prueba") {
                pass.getKeyboard(false, function (kb) {
                    bot.sendMessage(fromId, "Prueba", kb)
                })
            } else {
                bot.sendMessage(fromId, "Usted no es un usuario autorizado, " +
                    "contacte con el administrador." +
                    "\n Su id es " + fromId);
            }
        });
    },
    talk: function (chatId, msg) {
        bot.sendMessage(chatId, msg);
    }
};
module.exports = botTelegram;