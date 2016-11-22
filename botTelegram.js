/**
 * Created by JGB on 9/09/16.
 */
var TelegramBot = require('node-telegram-bot-api');
var admin = require("./app/admin");
var user = require("./app/user");
var config = require("./app/config");
var pass = require("./app/password");
var alarm = require("./app/alarm");
var weather = require("./app/weather");
var domotic = require("./app/domotic");

var csv = require("./helpers/csv");
var date = require("./helpers/date");
var server = require("./helpers/server");
var photo = require('../helpers/photo');

var bot;
var botTelegram = {
    init: function () {
        var token = '221791769:AAGrGoOSc_dOegZLwaSsQq40C6XUrqiLfSY';
        var self = this;

        bot = new TelegramBot(token, {polling: true});

        console.log('Bot iniciado');

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

        bot.on('location', function (msg) {
            weather.setCoordinates(msg.location.latitude, msg.location.longitude);
            config.saveConfig();
        });

        bot.on('callback_query', function onCallbackQuery(callbackQuery) {
            var options = {
                chat_id: callbackQuery.message.chat.id,
                message_id: callbackQuery.message.message_id
            };

            bot.editMessageText('Mensaje editado', options);
        });

        /* Máquina de estados */
        bot.on('text', function (msg) {
            var fromId = msg.from.id;
            var username = msg.from.username;
            var strArray = msg.text.split(" ");
            var isAction = strArray[0].substring(0, 1) == '/';

            if(!config.initConfig) {
                var key = pass.generatePass();
                bot.sendMessage(fromId, "Este es el primer inicio del bot, " +
                    "usted va a ser el usuario administrador.\n" +
                    "Por favor, introduzca la contraseña de administrador.");
                // bot.sendMessage(fromId, "Este es el primer inicio del bot, " +
                //     "usted va a ser el usuario administrador.\n" +
                //     "Por favor, introduzca la contraseña." +
                //     "\nEsta contraseña debe ser un PIN de cuatro números");
                askPass(fromId,key, true);
                user.newUser(username);
                user.editUser(username,{aux: key});
                user.setCurrentState(username, 1, user.getAction('start'));
                config.initConfig = true;
                // config.saveUsers();
            }else if (user.isUser(username)) {
                /* Diferencia si es una acción o no lo es, esto servirá luego
                 cuando queramos interacción con el usuario */
                if (isAction) {
                    var action = strArray[0].split('/')[1];
                    // Acciones del administrador
                    if (pass.isAdminReg(username) &&
                        admin.isAction(action)) {
                        switch (action) {
                            case admin.getAction('addUser'):
                                bot.sendMessage(fromId, 'Introduzca el alias del usuario sin @.' +
                                    '\nPuedes encontrar tu alias en Ajustes.');
                                user.setCurrentState(username, 1, admin.getAction('addUser'));
                                break;
                            case admin.getAction('addAdmin'):
                                bot.sendMessage(fromId, 'Introduce al usuario que deseas' +
                                    ' agregar como administrador');
                                user.setCurrentState(username, 1, admin.getAction('addAdmin'));
                                break;
                            case admin.getAction('rmAdmin'):
                                bot.sendMessage(fromId, 'Introduce al usuario que deseas' +
                                    ' eliminarle los permisos de administrador');
                                user.setCurrentState(username, 1, admin.getAction('rmAdmin'));
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
                                csv.readCSV('reg.csv', function (reg) {
                                    var txt = "Pulsa el día que quieres recibir";
                                    for (var i in reg) {
                                        txt += '\n/' + reg[i].day;
                                    }
                                    bot.sendMessage(fromId, txt);
                                    user.setCurrentState(username, 1, admin.getAction('showReg'))
                                });
                                break;
                        }
                    } else if (user.isAction(action)) {
                        // Acciones de los usuarios
                        if (action == user.getAction('start')) {
                            bot.sendMessage(fromId, "Vamos a configurar la cuenta, " +
                                "para comenzar introduzca su nombre");
                            user.setCurrentState(username, 3, user.getAction('start'));
                        } else if (action == user.getAction('admin')) {
                            if(admin.isAdmin(username)) {
                                var key = pass.generatePass();
                                askPass(fromId, key, true);
                                user.editUser(username,{aux: key});
                                user.setCurrentState(username, 1, action);
                            } else {
                                bot.sendMessage(fromId, "Lo siento, usted no tiene permisos" +
                                    " de administrador");
                            }
                        } else if (action == user.getAction('password')) {
                            var key = pass.generatePass();
                            askPass(fromId, key);
                            user.editUser(username,{aux: key});
                            user.setCurrentState(username, 1, action);
                        } else if (action == user.getAction('alarmAct')) {
                            if(!alarm.isActive()) {
                                var key = pass.generatePass();
                                self.askPass(fromId, key);
                                user.editUser(username,{aux: key});
                                user.setCurrentState(username, 1, action);
                            } else {
                                bot.sendMessage(fromId, "La alarma ya está activa");
                            }
                        } else if (action == user.getAction('alarmDes')) {
                            if(alarm.isActive()) {
                                var key = pass.generatePass();
                                self.askPass(fromId, key);
                                user.editUser(username, {aux: key});
                                user.setCurrentState(username, 1, action);
                            } else {
                                bot.sendMessage(fromId, "La alarma ya está desactiva");
                            }
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
                                case user.getAction('addUserTemp'):
                                    bot.sendMessage(fromId, 'Introduzca el alias del usuario sin @.' +
                                        '\nPuedes encontrar tu alias en Ajustes.');
                                    user.setCurrentState(username, 2, admin.getAction('addUser'));
                                    break;
                                case user.getAction('getTemp'):
                                    var temp = weather.getTemp().toFixed(2);
                                    bot.sendMessage(fromId, 'La temperatura en casa es de ' +
                                        temp + 'ºC');
                                    break;
                                case user.getAction('hallLightOn'):
                                    domotic.writePin('hallLight', true, function () {
                                        bot.sendMessage(fromId, 'Luz del salón encendida');
                                    });
                                    break;
                                case user.getAction('hallLightOff'):
                                    domotic.writePin('hallLight', false, function () {
                                        bot.sendMessage(fromId, 'Luz del salón apagada');
                                    });
                                    break;
                                default:
                                    break;
                            }
                        } else {
                            bot.sendMessage(fromId, "No eres un usuario autorizado" +
                                "\nIntroduce /password para loguearte");
                        }
                    } else {
                        if(user.getCurrentState(username).action == admin.getAction('showReg')) {
                            var doc = 'files/reg/' + action + '.csv';
                            bot.sendDocument(fromId, doc);
                        } else {
                            bot.sendMessage(fromId, "/" + action + " no es una acción válida." +
                                "\nIntroduzca /help para ver las acciones válidas.");
                        }
                    }
                } else {
                    var currentState = user.getCurrentState(username);
                    switch (currentState.action) {
                        case user.getAction('start'):
                            switch (currentState.state) {
                                case 1:
                                    password = strArray[0];
                                    if (pass.checkPass(password)) {
                                        password = pass.setAdminPasswd(password,
                                            user.getUserProperties(username, {aux: null}).aux);
                                        sayPass(fromId, password);
                                        setTimeout(function () {
                                            var key = pass.generatePass();
                                            askPass(fromId, key);
                                            user.editUser(username,{aux: key});
                                        },100);
                                        user.setCurrentState(username, 2, user.getAction('start'));
                                        pass.regUser(username);
                                    } else {
                                        bot.sendMessage(fromId, "La contraseña no es válida." +
                                            "\nLa contraseña debe ser un PIN de cuatro números." +
                                            "\nPor ejemplo: 1234");
                                        askPass(fromId, user.getUserProperties(username, {aux: null}).aux);
                                    }
                                    break;
                                case 2:
                                    password = strArray[0];
                                    if (pass.checkPass(password)) {
                                        password = pass.setPassword(password,
                                            user.getUserProperties(username, {aux: null}).aux);
                                        sayPass(fromId, password);
                                        setTimeout(function () {
                                            bot.sendMessage(fromId, "Introduza su nombre");
                                        },100);
                                        user.editUser(username, {isAdmin: true});
                                        user.setCurrentState(username, 3, user.getAction('start'));
                                        pass.regUser(username);
                                    } else {
                                        bot.sendMessage(fromId, "La contraseña no es válida." +
                                            "\nLa contraseña debe ser un PIN de cuatro números." +
                                            "\nPor ejemplo: 1234");
                                        askPass(fromId, user.getUserProperties(username, {aux: null}).aux);
                                    }
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
                        case admin.getAction('addAdmin'):
                            switch (currentState.state) {
                                case 1:
                                    var nUser = strArray[0];
                                    if (user.isUser(nUser)) {
                                        user.editUser(nUser, {isAdmin: true});
                                        bot.sendMessage(fromId, 'El usuario @' + nUser + ' ahora es administrador');
                                        bot.sendMessage(user.getUserProperties(nUser, {id: null}).id,
                                            'El usuario @' + username + ' le ha dado ' +
                                            'permisos de administrador');
                                        config.saveUsers();
                                    } else {
                                        bot.sendMessage(fromId, 'No has introducido un usuario correcto.');
                                    }
                                    user.setCurrentState(username, null, null);
                                    break;
                            }
                            break;
                        case admin.getAction('rmAdmin'):
                            switch (currentState.state) {
                                case 1:
                                    var nUser = strArray[0];
                                    if (username == nUser) {
                                        bot.sendMessage(fromId, 'Usted mismo no puede quitarse los permisos' +
                                            'de administrador');
                                    } else if (user.isUser(nUser)) {
                                        user.editUser(nUser, {isAdmin: false});
                                        bot.sendMessage(fromId, 'El usuario @' + nUser + ' ya no es administrador');
                                        bot.sendMessage(user.getUserProperties(nUser, {id: null}).id,
                                            'El usuario @' + username + ' le ha quitado ' +
                                            'los permisos de administrador');
                                        config.saveUsers();
                                    } else {
                                        bot.sendMessage(fromId, 'No has introducido un usuario correcto.');
                                    }
                                    user.setCurrentState(username, null, null);
                                    break;
                            }
                            break;
                        case admin.getAction('addUser'):
                            switch (currentState.state) {
                                case 1:
                                    var nUser = strArray[0];
                                    user.newUser(nUser);
                                    bot.sendMessage(fromId, "Usuario @" + nUser + " añadido");
                                    config.saveUsers();
                                    user.setCurrentState(username, null, null);
                                    break;
                                case 2:
                                    var nUser = strArray[0];
                                    user.newUser(nUser);
                                    user.editUser(nUser, {add: Date.now()});
                                    bot.sendMessage(fromId, "Usuario @" + nUser + " añadido durante " +
                                        user.timeProv + " minutos");
                                    config.saveUsers();
                                    user.setCurrentState(username, null, null);
                                    break;
                                    break;
                            }
                            break;
                        case admin.getAction('changePass'):
                            switch (currentState.state) {
                                case 1:
                                    var password = strArray[0];
                                    if (pass.checkPass(password)) {
                                        password = pass.setPassword(password,
                                            user.getUserProperties(username, {aux: null}).aux);
                                        sayPass(fromId, password);
                                        user.editUser(username, {isAdmin: true});
                                        user.setCurrentState(username, null, null);
                                        pass.regUser(username);
                                    } else {
                                        bot.sendMessage(fromId, "La contraseña no es válida." +
                                            "\nLa contraseña debe ser un PIN de cuatro números." +
                                            "\nPor ejemplo: 1234");
                                        askPass(fromId, user.getUserProperties(username, {aux: null}).aux);
                                    }
                                    break;
                            }
                            break;
                        case user.getAction('admin'):
                            switch (currentState.state) {
                                case 1:
                                    var password = strArray[0];
                                    if(pass.isAdminPassword(password,
                                            user.getUserProperties(username, {aux:null}).aux)) {
                                        bot.sendMessage(fromId, 'Contraseña correcta');
                                        pass.regAdmin(username);
                                    } else {
                                        bot.sendMessage(fromId, 'Contraseña incorrecta')
                                    }
                                    user.setCurrentState(username, null, null);
                                    break;
                            }
                            break;
                        case user.getAction('password'):
                            switch (currentState.state) {
                                case 1:
                                    var password = strArray[0];
                                    if(pass.isPassword(password,
                                            user.getUserProperties(username, {aux:null}).aux)) {
                                        bot.sendMessage(fromId, 'Contraseña correcta');
                                        pass.regUser(username);
                                    } else {
                                        bot.sendMessage(fromId, 'Contraseña incorrecta')
                                    }
                                    user.setCurrentState(username, null, null);
                                    break;
                            }
                            break;
                        case user.getAction('alarmAct'):
                            switch (currentState.state) {
                                case 1:
                                    var password = strArray[0];
                                    if(pass.isPassword(password,
                                            user.getUserProperties(username, {aux:null}).aux)) {
                                        bot.sendMessage(fromId, 'La alarma se ha activado');
                                        alarm.activate();
                                    } else {
                                        bot.sendMessage(fromId, 'Contraseña incorrecta')
                                    }
                                    user.setCurrentState(username, null, null);
                                    break;
                            }
                            break;
                        case user.getAction('alarmDes'):
                            switch (currentState.state) {
                                case 1:
                                    var password = strArray[0];
                                    if(pass.isPassword(password,
                                            user.getUserProperties(username, {aux:null}).aux)) {
                                        bot.sendMessage(fromId, 'La alarma se ha desactivado');
                                        alarm.deactivate();
                                    } else {
                                        bot.sendMessage(fromId, 'Contraseña incorrecta')
                                    }
                                    user.setCurrentState(username, null, null);
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
        function askPass (chatId, key, admin) {
            admin = admin || false;
            var options = {
                reply_markup: {
                    inline_keyboard: [[{
                        text: 'Editar',
                        callback_data: 'password_key'
                    }]]
                }
            };
            var strAdmin = "";
            if (admin) strAdmin = 'de administrador';
            setTimeout(function() {
                bot.sendMessage(chatId, 'Introduzca su contraseña ' + strAdmin + ' sumandole a ' +
                    'cada cifra su dígito correspondiente de la key' +
                    '\nEjemplo:' +
                    '\nContraseña: 1254' +
                    '\nKey: 7 5 8 9' +
                    '\nSolución: 8733');
            }, 200);
            setTimeout(function () {
                bot.sendMessage(chatId, 'Key: ' + key, options);
            },300);
        }
        function sayPass(chatId, pass) {
            var options = {
                reply_markup: {
                    inline_keyboard: [[{
                        text: 'Editar',
                        callback_data: 'password_key'
                    }]]
                }
            };
            bot.sendMessage(chatId, 'Su contraseña es: ' + pass, options);
        }
    },
    talk: function (chatId, msg) {
        bot.sendMessage(chatId, msg);
    },
    wathDog: function (T) {
        var filename = "peepholder.png";
        setInterval(function () {
            if(domotic.photo) {
                photo.takePhoto(filename, function () {
                    var admins = admin.getAdminId();
                    for (var adm in admins) {
                        bot.sendPhoto(admins[adm], filename);
                        domotic.photo = false;
                    }
                })
            }
            if (domotic.alarm) {

            }
        }, T*1000);
    }
};

module.exports = botTelegram;