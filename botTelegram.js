/**
 * Created by JGB on 9/09/16.
 */
var TelegramBot = require('node-telegram-bot-api');
var admin = require("./app/admin");
var user = require("./app/user");

var server = require("./helpers/server");
// var photoCam = require("./helpers/photo");

var config = require("./config");
var pass = require("./password");

var bot;
var botTelegram = {
    init: function () {
        var token = '221791769:AAGrGoOSc_dOegZLwaSsQq40C6XUrqiLfSY';
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
            var username = msg.from.username;
            var strArray = msg.text.split(" ");
            var isAction = strArray[0].substring(0, 1) == '/';

            if(!config.initConfig) {
                // bot.sendMessage(fromId, "Este es el primer inicio del bot, " +
                //     "usted va a ser el usuario administrador.\n" +
                //     "Por favor, introduzca la contraseña de administrador.");
                // user.newUser(username);
                // user.setCurrentState(username, , user.getAction('start'));
                bot.sendMessage(fromId, "Este es el primer inicio del bot, " +
                    "usted va a ser el usuario administrador.\n" +
                    "Por favor, introduzca la contraseña.");
                user.newUser(username);
                user.setCurrentState(username, 2, user.getAction('start'));
                config.initConfig = true;
                config.saveUsers();
            }else if (user.isUser(username)) {
                /* Diferencia si es una acción o no lo es, esto servirá luego
                 cuando queramos interacción con el usuario */
                if (isAction) {
                    var action = strArray[0].split('/')[1];
                    // Acciones del administrador
                    if (admin.isAdmin(username) &&
                        admin.isAction(action)) {
                        switch (action) {
                            case admin.getAction('addUser'):
                                bot.sendMessage(fromId, 'Introduzca el alias del usuario sin @.' +
                                    '\n Puedes encontrar tu alias en Ajustes.');
                                user.setCurrentState(username, 1, admin.getAction('addUser'));
                                break;
                            case admin.getAction('addUsersCSV'):
                                break;
                            case admin.getAction('changePass'):
                                bot.sendMessage(fromId, 'Introduzca la contraseña nueva');
                                user.setCurrentState(username, 1, admin.getAction('changePass'));
                                break;
                            case admin.getAction('whoAtHome'):
                                break;
                            case admin.getAction('showReg'):
                                break;
                        }
                        // Acciones de los usuarios
                    } else if (user.isAction(action)) {
                        if (action == user.getAction('start')) {
                            bot.sendMessage(fromId, "Vamos a configurar la cuenta, " +
                                "para comenzar introduzca su nombre");
                            user.setCurrentState(username, 3, user.getAction('start'));
                        } else if (action == user.getAction('password')) {
                            bot.sendMessage(fromId, "Introduzca la contraseña");
                            user.setCurrentState(username, 1, user.getAction('password'));
                        } else if (pass.isReg(username)) {
                            switch (action) {
                                case user.getAction('server'):
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
                                "\nIntroduce /password para loguearte");
                        }
                    } else {
                        bot.sendMessage(fromId, action + " no es una acción válida." +
                            "\nIntroduzca /help para ver las acciones válidas.");
                    }
                } else {
                    var currentState = user.getCurrentState(username);
                    switch (currentState.action) {
                        case user.getAction('start'):
                            switch (currentState.state) {
                                case 1:
                                    var password = strArray[0];
                                    pass.setAdminPasswd(password);
                                    admin.setAdmin(username, true)
                                    bot.sendMessage(fromId, "Contraseña de administrador establecida." +
                                        "\n\nAhora introduzca la contraseña de usuario");
                                    user.editUser(username, {isAdmin: true});
                                    user.setCurrentState(username, 2, user.getAction('start'));
                                    break;
                                case 2:
                                    password = strArray[0];
                                    pass.setPasswd(password);
                                    bot.sendMessage(fromId, "Contraseña establecida." +
                                        "\n\nIntroduza su nombre");
                                    user.editUser(username, {isAdmin: true});
                                    user.setCurrentState(username, 3, user.getAction('start'));
                                    pass.regUser(username);
                                    break;
                                case 3:
                                    var name = msg.text;
                                    user.editUser(username, {id: fromId, name: name});
                                    bot.sendMessage(fromId, "Si estás conectado a la red de la central domótica " +
                                        "introduce tu MAC" +
                                        "\n Si no estás en tu red, introduce 'fin'");
                                    user.setCurrentState(username, 4, user.getAction('start'));
                                    break;
                                case 4:
                                    var mac = strArray[0];
                                    if (mac == "fin") {
                                        bot.sendMessage(fromId, "Hemos terminado la configuración de su usuario" +
                                            "\n recuerde introducir su IP cuando esté en casa con el comando" +
                                            "/myMAC < suMAC >." +
                                            "\n Para conocer todas las funciones de su central domótica introduzca " +
                                            "el comando /help");
                                    } else {
                                        // config.addUser(fromId, null, ip);
                                        // config.users[fromId].ip = ip;
                                        user.editUser(username, {mac: mac});
                                        bot.sendMessage(fromId, "Hemos terminado la configuración de su usuario." +
                                            "\nPara conocer todas las funciones de su central domótica " +
                                            "introduzca el comando /help");
                                    }
                                    user.setCurrentState(username, null, null);
                                    config.saveUsers();
                            }
                            break;
                        case admin.getAction('addUser'):
                            switch (currentState.state) {
                                case 1:
                                    var nUser = strArray[0];
                                    user.newUser(nUser);
                                    bot.sendMessage(fromId, "Usuario @" + nUser + " añadido");
                                    config.saveUsers();
                                    break;
                            }
                            break;
                        case admin.getAction('changePass'):
                            switch (currentState.state) {
                                case 1:
                                    var password = strArray[0];
                                    pass.setPasswd(password);
                                    bot.sendMessage(fromId, 'Contraseña cambiada');
                                    break;
                            }
                            break;
                        case user.getAction('password'):
                            switch (currentState.state) {
                                case 1:
                                    var password = strArray[0];
                                    if(pass.isPassword(password)) {
                                        bot.sendMessage(fromId, 'Contraseña correcta');
                                        pass.regUser(username);
                                    } else {
                                        bot.sendMessage(fromId, 'Contraseña incorrecta')
                                    }
                                    break;
                            }
                            break;
                        default:
                            bot.sendMessage(fromId, "No has ejecutado una acción");
                            break
                    }
                }
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