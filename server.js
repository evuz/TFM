var http = require("http");

function iniciar(port) {
    function onRequest(request, response) {
        console.log("Petición Recibida.");
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write("Hola Mundo");
        response.end();
    }

    http.createServer(onRequest).listen(port);
    return "Servidor Iniciado.";
}
exports.iniciar = iniciar;
