var http = require('http');
var fs = require('fs');

const PORT=8005; 

function handleRequest(request, response){
    response.setHeader('Access-Control-Allow-Origin', '*');
	response.setHeader('Access-Control-Request-Method', '*');
	response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
	response.setHeader('Access-Control-Allow-Headers', '*');
    
    if (request.method === 'POST' && request.url === '/saveGameData') {
        var data = '';
        request.on('data', function(chunk) {
            data += chunk;
        });
        request.on('end', function() {
            saveGameData(data);
        });
    }
    response.end('It Works!! Path Hit: ' + request.url + ' ' + request.method);
}

function saveGameData(data) {
    fs.writeFile("playerData/save.json", data, function(err) {
        if(err) {
            return console.log(err);
        }

        console.log("Game data saved to playerData/save.json");
    }); 
}

var server = http.createServer(handleRequest);

server.listen(PORT, function(){
    console.log("Server listening on: http://localhost:%s", PORT);
});