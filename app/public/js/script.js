var serverUrl = "/";
var localStream, room, roomId, interval, rooms;

var user = typeof(udata) != 'undefined' ? udata : { };



//Devuelve el id de las salas disponibles
var getRooms = function (callback){

    var req = new  XMLHttpRequest();
            //parsedResponse;
    var url = serverUrl + 'getRooms/';

    req.onreadystatechange = function () {
        if (req.readyState === 4 ){
            //parsedResponse=JSON.parse(req.responseText);
            callback(req.responseText);
         }
        };

    req.open('POST',url,true);

    console.log("Sending to " + url);
    req.send();
}


//Muestra las cuatro salas publicas disponibles
 var displayRooms = function(roomList) {
    
    rooms = JSON.parse(roomList);
    for (var i = 0; i < rooms.length; i++) {
      var room = rooms[i];
        //console.log(rooms[0]._id);

            roomId1 = rooms[0]._id;
            roomId2 = rooms[1]._id;
            roomId3 = rooms[2]._id;
            roomId4 = rooms[3]._id;
            
        }
    };   


function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}




window.onload = function () {

try{

    var screen = getParameterByName("screen");
	localStream = Erizo.Stream({audio: true, video: true, data: true, screen: screen});
//     localStream = Erizo.Stream({audio: true, video: true, data: true});

}catch (error) {

        document.getElementById('rooms').setAttribute("class","hide");
}

    var room1 = document.getElementById('room1');
    var room2 = document.getElementById('room2');
    var room3 = document.getElementById('room3');
    var room4 = document.getElementById('room4');


    var createToken = function(roomId,userName, role, callback) {

        var req = new XMLHttpRequest();
        var url = serverUrl + 'createToken/' + roomId;
        var body = {username: userName, role: role};

        req.onreadystatechange = function () {
            if (req.readyState === 4) {
                callback(req.responseText);
            }
        };

        req.open('POST', url, true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.send(JSON.stringify(body));
    };



    var getUsers = function(roomId,callback){

        var req = new XMLHttpRequest();
        var url = serverUrl + 'getUsers/' + roomId;

        req.onreadystatechange = function () {
            if (req.readyState === 4){
                callback(req.responseText);
            }
        };

        req.open('POST',url,true);

        console.log("Sending to " + url);
        req.send();
    };

var displayUsers = function(userList) {

        users = JSON.parse(userList);
        var usuariosOnline = document.getElementById("usuarios-conectados");

        for (var i = 0; i < users.length; i++) {
            console.log('User ', i, ':', users[i].name, 'with role: ', users[i].role);

            usuariosOnline.childNodes[i].innerText = users[i].name;
        }
};
               


getRooms (displayRooms);


/*
var writeUsers = function(id, users) {
        var number;
        if(users == '?') {
            number = users; 
        } else {
            number = JSON.parse(users).length;
        }

        room.childNodes[1].innerText = "Room " + id + " - (" + number + " users)";
    };

    var checkUsers = function() {
        getUsers(roomId1, function(users) {
            writeUsers(1, users);
            getUsers(roomId2, function(users) {
                writeUsers(2,users);
                getUsers(roomId3, function(users) {
                    writeUsers(3,users);
                    getUsers(roomId4, function(users) {
                        writeUsers(4, users);
                    });    
                });
            });
        });
    };

    interval = setInterval(checkUsers, 10000);

    checkUsers();
*/


    var checkUsers = function() {
        getUsers(roomId1, function(users) {
            displayUsers(users);
            getUsers(roomId2, function(users) {
                displayUsers(users);
                getUsers(roomId3, function(users) {
                    displayUsers(users);
                    getUsers(roomId4, function(users) {
                        displayUsers(users);
                    });    
                });
            });
        });
    };






    room1.onclick = function(evt) {
        initialize(roomId1);
    };

    room2.onclick = function(evt) {
        initialize(roomId2);
    };

    room3.onclick = function(evt) {
        initialize(roomId3);
    };

    room4.onclick = function(evt) {
        initialize(roomId4);
    };

   
   

    var initialize = function(roomId) {


        //clearInterval(interval);
        var roomcontainer = document.getElementById("roomcontainer");
        roomcontainer.setAttribute("class", "hide");
        var vidcontainer = document.getElementById("vidcontainer");
        vidcontainer.setAttribute("class", "");


        var usuario = $('#user-connected-tf').val();
        console.log('nombre de usuario:',usuario);

        createToken(roomId, usuario, "presenter", function (response) {
            var token = response;
            console.log('token created ', token);
            L.Logger.setLogLevel(L.Logger.DEBUG);
            L.Logger.debug("Connected!");
            room = Erizo.Room({token: token});




            localStream.addEventListener("access-accepted", function () {
                
                var subscribeToStreams = function (streams) {
                    if (!localStream.showing) {
                        localStream.show();
                    }
                    var index, stream;
                    for (index in streams) {
                        if (streams.hasOwnProperty(index)) {
                            stream = streams[index];
                            if (localStream !== undefined && localStream.getID() !== stream.getID()) {
                                room.subscribe(stream);
                            } else {
                                console.log("My own stream");
                            }
                        }
                    }
                };

                room.addEventListener("room-connected", function (roomEvent) {
                    // Publish my stream
                    room.publish(localStream);

                    // Subscribe to other streams
                    subscribeToStreams(roomEvent.streams);
                });


                
                
                room.addEventListener("stream-subscribed", function(streamEvent) {
                var stream = streamEvent.stream;
                var div = document.createElement('div');
                div.setAttribute("style", "width: 320px; height: 240px; background-color: black");
                div.setAttribute("id", "test" + stream.getID());

                document.body.appendChild(div);
                stream.show("test" + stream.getID());

            });


                room.addEventListener("stream-added", function (streamEvent) {
                    // Subscribe to added streams
                    var streams = [];
                    streams.push(streamEvent.stream);
                    subscribeToStreams(streams);
                });

                room.addEventListener("stream-removed", function (streamEvent) {
                    // Remove stream from DOM
                    var stream = streamEvent.stream;
                    if (stream.elementID !== undefined) {
                        console.log("Removing " + stream.elementID);
                        var element = document.getElementById(stream.elementID);
                        element.parentNode.removeChild(element);
                    }
                });

                room.connect();



                localStream.show("myVideo");


            });
            localStream.init();
        });  
            //var connected = getUsers(roomId,displayUsers);
            interval=setInterval(checkUsers,10000);
            getUsers(roomId,displayUsers);
    }

};


