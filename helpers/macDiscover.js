/**
 * Created by José Luis on 23/6/16.
 */

var arp = {
    getAllMAC: function(shorAdress,callback){
        if(!shorAdress) shorAdress = "192.168.101.";
        var result = [],iteracion = 0;
        for (var i=0;i<255;i++){
            var address = shorAdress + i;
            (function(address){
                arp.getMAC(address, function(mac) {
                    iteracion++;
                    if (mac) {
                        result.push(mac);
                    }
                    if(iteracion == 254){
                        callback(result);
                    }
                });
            })(address);
        }
    },
    getMAC: function (ipaddress, cb) {
        if (process.platform.indexOf('linux') == 0) {
            this.readMACLinux(ipaddress, cb);
        }
        else if (process.platform.indexOf('win') == 0) {
            this.readMACWindows(ipaddress, cb);
        }
        else if (process.platform.indexOf('darwin') == 0) {
            this.readMACMac(ipaddress, cb);
        }
    },
    readMACMac: function(ipaddress, callback) {
        const spawn = require('child_process').spawn;

        var util = require('util');
        //#- Hago ping para llenar las tablas ARP con los datos que necesito
        var ping = spawn("ping", ["-c", "1", ipaddress ]);
        ping.on('close', function (codigo) {
            var arp = spawn("arp", ["-n", ipaddress] );
            var buffer = '';
            var error = '';
            arp.stdout.on('data', function (data) {
                buffer += data;
            });
            arp.stderr.on('data', function (data) {
                error += data;
            });

            arp.on('close', function (codigo) {
                if (codigo !== 0 && error !== '') {
                    console.log("Error al ejecutar arp -n " + ipaddress + " Código del error:" + codigo + " Error:" + error);
                    callback(false);
                }else {
                    var parts = buffer.split(' ');
                    if (parts[3] !== 'no') {
                        var mac = "";
                        if(parts[3] != "(incomplete)") {
                            var arrMac = parts[3].split(':');
                            for (var m in arrMac){
                                if(arrMac[m].length < 2){
                                    arrMac[m] = "0" + arrMac[m];
                                }
                                mac = mac + arrMac[m] + ":";
                            }
                            mac = mac.slice(0,mac.length-1);
                            console.log("direccion IP: " + ipaddress);

                            callback(mac);
                        }else{
                            callback(false);
                        }
                    } else {
                        console.log("No he encontrado la direccion IP: " + ipaddress + " Revise su configuracion");
                        callback(false);
                    }
                }
            });
        });
    },
    readMACLinux: function(ipaddress, callback) {
        //#- Hago ping para llenar las tablas ARP con los datos que necesito
        const spawn = require('child_process').spawn;
        var ping = spawn("ping", [ "-c", "1", ipaddress ]);
        ping.on('close', function (code) {
            var arp = spawn("arp", [ "-n", ipaddress ]);
            var buffer = '';
            var errstream = '';
            arp.stdout.on('data', function (data) {
                buffer += data;
            });
            arp.stderr.on('data', function (data) {
                errstream += data;
            });

            arp.on('close', function (code) {
                if (code !== 0) {
                    console.log("Error al ejecutar arp -n " + ipaddress + " Código del error:" + codigo + " Error:" + error);
                    callback(false);
                }else {
                    var table = buffer.split('\n');
                    if (table.length >= 2) {
                        var parts = table[1].split(' ').filter(String);
                        if(parts[2] && parts[2].length > 9){
                            callback(parts[2]);
                        }else{
                            callback(false);
                        }
                    } else {
                        console.log("No he encontrado la direccion IP: " + ipaddress + " Revise su configuracion");
                        callback(false);
                    }
                }
            });
        });
    },
    readMACWindows: function(ipaddress, callback) {
        //#- Hago ping para llenar las tablas ARP con los datos que necesito
        const spawn = require('child_process').spawn;

        var ping = spawn("ping", ["-n", "1", ipaddress ]);
        ping.on('close', function (code) {
            var arp = spawn("arp", ["-a", ipaddress] );
            var buffer = '';
            var errstream = '';
            var lineIndex;
            arp.stdout.on('data', function (data) {
                buffer += data;
            });
            arp.stderr.on('data', function (data) {
                errstream += data;
            });

            arp.on('close', function (code) {
                if (code !== 0) {
                    console.log("Error running arp " + code + " " + errstream);
                    cb(true, code);
                    return;
                }else {
                    var table = buffer.split('\r\n');
                    var encontrado;
                    for (lineIndex = 3; lineIndex < table.length; lineIndex++) {
                        var parts = table[lineIndex].split(' ').filter(String);
                        if (parts[0] === ipaddress) {
                            var mac = parts[1].replace(/-/g, ':');
                            encontrado = true;
                            callback(mac);
                        }else{
                            callback(false);
                        }
                    }
                    if(!encontrado) callback("No he encontrado la direccion IP: " + ipaddress + " Revise su configuracion");
                }
            });
        });
    }
};

module.exports = arp;