//-
//- Copyright (C) Manuel J. Blanco Vecino
//- 
//- Desarrollo de un centro de videoconferencias utilizando WebRTC
//- Project site: https://github.com/manublanco/Centro-de-Videoconferencias
//- 
//- Proyecto fin de carrera. Universidade da Coruña
//-


var express = require('express');
var http = require('http');
var net = require('net');
var N = require('./nuve');
var fs = require("fs");
var https = require("https");
var config = require('./../../licode_config');



var options = {
    key: fs.readFileSync('cert/key.pem').toString(),
    cert: fs.readFileSync('cert/cert.pem').toString()
};


var app = express();

app.use(express.bodyParser());

app.configure(function(){
	app.set('port', 8080);
	app.set('views', __dirname + '/app/server/views');
	app.set('view engine', 'jade');
	app.locals.pretty = true;
//	app.use(express.favicon());
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({ secret: 'super-duper-secret-secret' }));
	app.use(express.methodOverride());
	app.use(require('stylus').middleware({ src: __dirname + '/app/public' }));
	app.use(express.static(__dirname + '/app/public'));
    app.use(express.logger());


});

app.configure('development', function(){
		app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

});

require('./app/server/router')(app);


app.use(function (req, res, next) {
    "use strict";
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE');
    res.header('Access-Control-Allow-Headers', 'origin, content-type');
    if (req.method == 'OPTIONS') {
        res.send(200);
    }
    else {
        next();
    }
});

//Inicializa el servicio licode
N.API.init(config.nuve.superserviceID, config.nuve.superserviceKey, 'http://localhost:3000/');

var myRoom, myRoom2, myRoom3, myRoom4;

//Borra todas las salas
function deleteAllRooms() {
    N.API.getRooms(function (roomList) {
                   "use strict";
                   var rooms = JSON.parse(roomList);
                   console.log(rooms.length);

                   if (rooms.length > 0) {
                   N.API.deleteRoom(rooms[0]._id, function(result) {
                                    console.log("Room " + rooms[0].name + " deleted");
                                    // Recursive call
                                    deleteAllRooms();
                                    });
                   } else {
                   return;
                   }
                   });
};



//Si no hay ninguna sala crea 4, en caso contrario muestra las 4 existentes.
function createRooms(){
    N.API.getRooms(function (roomlist) {
    "use strict";
    var rooms = JSON.parse(roomlist);
    console.log(rooms.length);
    if (rooms.length === 0) {
        N.API.createRoom('myRoom', function (roomID) {
            myRoom = roomID._id;
            console.log('Created room ', myRoom);
        });
        N.API.createRoom('myRoom2', function (roomID) {
            myRoom2 = roomID._id;
            console.log('Created room ', myRoom2);
        });
        N.API.createRoom('myRoom3', function (roomID) {
            myRoom3 = roomID._id;
            console.log('Created room ', myRoom3);
        });
        N.API.createRoom('myRoom4', function (roomID) {
            myRoom4 = roomID._id;
            console.log('Created room ', myRoom4);
        });

    } else {
        myRoom  = rooms[0]._id;
        myRoom2 = rooms[1]._id;
        myRoom3 = rooms[2]._id;
        myRoom4 = rooms[3]._id;

        console.log('Using room ', myRoom);
        console.log('Using room ', myRoom2);
        console.log('Using room ', myRoom3);
        console.log('Using room ', myRoom4);
        }
    });
}


//Utilizar deleteAllRooms() para borrar todas las salas. Luego ejecutar createRooms();

//deleteAllRooms();
createRooms();


//Crear una sala, se utilizara cuando creemos salas en eventos privados





//Crea el token, se le pasa como parametro el identicador de la sala
app.post('/createToken/:roomId', function (req, res) {
    "use strict";
    var room  = req.params.roomId,
        username = req.body.username,
        role = req.body.role;
    N.API.createToken(room, username, role, function (token) {
        //console.log(token);
        res.send(token);
    });
});



//Devuelve una lista con todas las salas
app.post('/getRooms/', function (req, res) {
    "use strict";
    N.API.getRooms(function (rooms) {
        res.send(rooms);
        //console.log('enviado: ' + rooms);
    });
});

//Devuelve una lista con los usuarios de una sala, se le pasa la sala como parametro.
app.post('/getUsers/:roomId', function (req, res) {
    "use strict";
    var room = req.params.roomId;
    N.API.getUsers(room, function (users) {
    
        res.send(users);
      
    });
});

app.listen(3001);

var server = https.createServer(options, app);
server.listen(3004);
