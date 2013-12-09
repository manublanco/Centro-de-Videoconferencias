//-
//- Copyright (C) Manuel J. Blanco Vecino
//- 
//- Desarrollo de un centro de videoconferencias utilizando WebRTC
//- Project site: https://github.com/manublanco/Centro-de-Videoconferencias
//- 
//- Proyecto fin de carrera. Universidade da Coruña
//-

var serverUrl = "/";

var localStream, room, interval,recording;
var DEMO = {};

var connectedUsers=[];

var user = typeof(udata) != 'undefined' ? udata : { };


function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function startRecording (){
  if (room!=undefined){
    if (!recording){
      room.startRecording(localStream);
      recording = true;
    }else{
      room.stopRecording(localStream);
      recording = false;
    }
  }
}


window.onload = function () {

try{

    clearInterval(interval);
    var usuario = $('#user-connected-tf').val();
    var my_name = usuario;
    var messText = document.getElementById('chat_message');
    var chat_body = document.getElementById('chat_body');
    var screen = getParameterByName("screen");
	
    localStream = Erizo.Stream({audio: true, video: true, data: true, screen: screen, attributes:{name: my_name}});

}catch (error) {

}

    


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


var cederPalabra = function (name){

    messText.value='code001 '+name ;
    DEMO.send_chat_message();



};







var checkUsers = function() {
    getUsers(roomId, function(users) {
        displayUsers(users);                
    });
};



//CHAT

      messText.onkeyup = function(e) {
          e = e || event;
          if (e.keyCode === 13) {
              DEMO.send_chat_message();
          }
          return true;
        };


    var add_text_to_chat = function(text, style) {
        var p = document.createElement('p');
        p.className = 'chat_' + style;
        p.innerHTML = text;
        chat_body.appendChild(p);
        chat_body.scrollTop = chat_body.scrollHeight;
    };

    DEMO.connect_to_chat = function() {
    add_text_to_chat('Conexion a la sala con exito', 'italic');
    };

    DEMO.add_chat_participant = function(name) {
        add_text_to_chat('Nuevo participante: ' + name, 'italic');
    };

     DEMO.remove_chat_participant = function(name) {
        add_text_to_chat('Ha salido de la sala: ' + name, 'italic');
    };

    DEMO.send_chat_message = function() {
        var parse = messText.value.split(" ");


        if ((parse[0] !== 'code001')&&(parse[1] !== null)){
        if(messText.value.match (/\S/)) {
            if (localStream) {
                localStream.sendData({msg: messText.value, name: my_name});
            }
            add_text_to_chat(my_name + ': ', 'name');
            add_text_to_chat(messText.value, '');
        }
        messText.value = '';
        }else if (parse[1] == my_name)
        {
              if (localStream) {
                localStream.sendData({msg: messText.value});
                console.log('mensaje',messText.value);

            }

             document.getElementById('palabra').style.color = "green";
             document.getElementById('palabra').innerHTML = '<h4 style="color:green">&bull; TIENE LA PALABRA</p>';
            }else{
                 if (localStream) {
                localStream.sendData({msg: messText.value});
                console.log('mensaje',messText.value);
            }
            document.getElementById('palabra').style.color = "red";
            document.getElementById('palabra').innerHTML= '<h4 style="color:red">&bull; NO TIENE LA PALABRA</h4>';

            }   
            messText.value='';
        };
    

    DEMO.chat_message_received = function(evt) {
        var msg = evt.msg;
        var parse_receive=msg.msg.split(" ");


        if ((parse_receive[0] !== 'code001')&&(parse_receive[1] !== null)){
        add_text_to_chat(msg.name + ': ', 'name');
        add_text_to_chat(msg.msg, '');
        }else if (parse_receive[1] == my_name){
            document.getElementById('palabra').style.color = "green";
            document.getElementById('palabra').innerHTML = '<h4>&bull; TIENE LA PALABRA</h4>';
        } else{
            document.getElementById('palabra').style.color = "red";
            document.getElementById('palabra').innerHTML= '<h4>&bull; NO TIENE LA PALABRA</h4>';

        }
    };

    var connect_user = function () {
        $('#connection_panel').modal('hide');
        my_name = document.getElementById('username_txt').value;
        DEMO.init_demo(my_name);
    };


var displayUsers = function(userList) {

    users = JSON.parse(userList);
    document.getElementById("usuariosConectados").innerHTML = "";
    var test=document.getElementById('usuariosConectados');

    for (var i=0; i<users.length; i++){
        console.log('User ', i, ':', users[i].name, 'with role: ', users[i].role);
        

        var input = document.createElement('input');
        input.type = 'button';
        input.className='btn btn-primary btn-block';
        input.value = users[i].name;
        input.addEventListener('click', function(){cederPalabra(this.value);}, false);
        usuariosConectados.appendChild(input);
    }

};


  
//Capta roomId de la url

    if(location.search.substr(1)){

        Variables = location.search.substr(1).split ('&');

        for (i = 0; i < Variables.length; i++) {
            Separ = Variables[i].split('=');
            eval ('var '+Separ[0]+'="'+Separ[1]+'"');
        }

     }







        var nombreUsuario = $('#user-connected-tf').val();
        console.log('nombre de usuario:',nombreUsuario);

        createToken(roomId, nombreUsuario, "presenter", function (response) {
            var token = response;
            console.log('token created ', token);
            L.Logger.setLogLevel(L.Logger.DEBUG);
            L.Logger.debug("Connected!");
            room = Erizo.Room({token: token});


         localStream.addEventListener("access-accepted", function () {
              
              var subscribeToStreams = function (streams) {
                for (var index in streams) {
                  var stream = streams[index];
                  if (localStream.getID() !== stream.getID()) {
                    room.subscribe(stream);
                  }
                }
              };



                room.addEventListener("room-connected", function (roomEvent) {
                    // Publish my stream
                    DEMO.connect_to_chat();
                    room.publish(localStream);

                    // Subscribe to other streams
                    subscribeToStreams(roomEvent.streams);
                });



                room.addEventListener("stream-subscribed", function(streamEvent) {
                    var stream = streamEvent.stream;

                    add_div_to_grid("test" + stream.getID());
                    stream.show("test" + stream.getID());

                    stream.addEventListener("stream-data", DEMO.chat_message_received);
                    DEMO.add_chat_participant(stream.getAttributes().name);

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
                  remove_div_from_grid(stream.elementID, "video_grid");
                  DEMO.remove_chat_participant(stream.getAttributes().name);

                }
              });

                room.connect();

                add_div_to_grid("localVideo");
                localStream.show("localVideo");


            });
            localStream.init();
        });  

            interval=setInterval(checkUsers,5000);
            //checkUsers();

};

//VIDEO_GRID

var add_div_to_grid = function(divId) {

    $('#video_grid').css('border', 'none');

    var grid = document.getElementById('video_grid');
    var newDiv = document.createElement('div');
    newDiv.setAttribute("id", divId + '_container');
    newDiv.className = newDiv.className + " grid_element_border";

    var newDiv2 = document.createElement('div');
    newDiv2.setAttribute("id", divId);
    newDiv2.className = newDiv2.className + " grid_element";
    newDiv.appendChild(newDiv2);

    grid.appendChild(newDiv);   
    resizeGrid('video_grid');
};

var remove_div_from_grid = function(divId) {

    var grid = document.getElementById('video_grid');
    grid.removeChild(document.getElementById(divId + '_container'));
    resizeGrid('video_grid');
};

var resizeGrid = function() {

    var grid = document.getElementById('video_grid');
    var nChilds = grid.childElementCount;

    var c = Math.floor((nChilds-1)/3);
    var r = (nChilds-1) % 3;

    if (nChilds === 1) {
        grid.childNodes[0].setAttribute("style","width: 100%; height: 100%;");
    } else {

        var height = 100/(c+1);
        
        for(var i = 1; i <= nChilds; i++) {

            var row = Math.floor((i-1) / 3);
            var width = 100/3;

            if (r === 0) {  // las dos ultimas filas tienen dos videos

                if (row > c - 2) { 
                    width = 50;
                }
                grid.childNodes[i-1].setAttribute("style", "width: " + width + "%; height: " + height + "%;");

            } else if (r === 1) {  // la ultima fila tiene un video
                if (row === c) { 
                    width = 50;
                }
                grid.childNodes[i-1].setAttribute("style", "width: " + width + "%; height: " + height + "%;");

            } else {
                grid.childNodes[i-1].setAttribute("style", "width: " + width + "%; height: " + height + "%;");
            }
        }
    }
} ;


