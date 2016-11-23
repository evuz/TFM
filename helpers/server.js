var http = require("http");

function iniciar(port) {
    function onRequest(request, response) {
        var ip = request.headers['x-forwarded-for'] ||
            request.connection.remoteAddress;
        ip = ip.split(':');
        ip = ip[ip.length - 1];
        console.log("Petición Recibida por: " + ip);
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write("Hola Mundo");
        response.end();
    }

    http.createServer(onRequest).listen(port);
    return "Servidor Iniciado.";
}
exports.iniciar = iniciar;
