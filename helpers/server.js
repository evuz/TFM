var http = require("http");

var catchIP = false;
var pIP = {};
var server = {
    init: function (port) {
        function onRequest(request, response) {
            var ip = request.headers['x-forwarded-for'] ||
                request.connection.remoteAddress;
            ip = ip.split(':');
            ip = ip[ip.length - 1];
            if(catchIP == 1) {
                pIP.ip = ip;
                catchIP = 2;
            }
            console.log("Petición Recibida por: " + ip);
            response.writeHead(200, {"Content-Type": "text/html"});
            response.write("Hola Mundo");
            response.end();
        }

        http.createServer(onRequest).listen(port);
        return "Servidor Iniciado.";
    },
    setCatchIP: function (value, p) {
        catchIP = value;
        pIP = p;
    },
    getCatchIP: function () {
        return {catchIP: catchIP, pIP: pIP};
    }
};
module.exports = server;
