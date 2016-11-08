var fs = require("fs");
var csv = require("fast-csv");

function readCSV(filename, cb) {
    var stream = fs.createReadStream(filename);

    var arrData = [];

    csv
        .fromStream(stream, {headers : true})
        .on("data", function(data){
            arrData.push(data);
        })
        .on("end", function(){
            cb(arrData);
        });
}

function writeCSV(filename, data) {
    var csvStream = csv.createWriteStream({headers: true});
    var writableStream = fs.createWriteStream(filename);

    writableStream.on("finish", function(){
        // console.log("DONE!");
    });

    csvStream.pipe(writableStream);
    for (var i = 0; i < data.length; i++) {
        csvStream.write(data[i]);
    }
    csvStream.end();
}

exports.writeCSV = writeCSV;
exports.readCSV = readCSV;
