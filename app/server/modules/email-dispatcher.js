//-
//- Copyright (C) Manuel J. Blanco Vecino
//- 
//- Desarrollo de un centro de videoconferencias utilizando WebRTC
//- Project site: https://github.com/manublanco/Centro-de-Videoconferencias
//- 
//- Proyecto fin de carrera. Universidade da Coruña
//-

var ES = require('./email-settings-mine');
var EM = {};
module.exports = EM;

EM.server = require("emailjs/email").server.connect({

	host		: ES.host,
	user		: ES.user,
	password    : ES.password,
	ssl			: true

});

EM.dispatchResetPasswordLink = function(account, callback)
{
	EM.server.send({
		from         : ES.sender,
		to           : account.email,
		subject      : 'Recuperacion de Contraseña',
		text         : 'Algo fue mal... :(',
		attachment   : EM.composeEmail(account)
	}, callback );
};

EM.composeEmail = function(o)
{
	var link = 'http://localhost:3001/reset-password?e='+o.email+'&p='+o.pass;
	var html = "<html><body>";
		html += "Hola "+o.name+",<br><br>";
		html += "Tu nombre de usuario es :: <b>"+o.user+"</b><br><br>";
		html += "<a href='"+link+"'>Pincha aqui para actualizar tu contraseña </a><br><br>";
		html += "Gracias.<br>";
		html += "</body></html>";
	return  [{data:html, alternative:true}];
};

EM.enviarInvitacion = function(events, callback)
{
	EM.server.send({
		from         : ES.sender,
		to           : events.invitados.toString(),
		subject      : 'Invitacion a Evento',
		text         : 'Algo fue mal... :(',
		attachment   : EM.emailInvitacion(events)
	}, callback );
};

EM.emailInvitacion = function(o)
{
	var link = 'http://localhost:3001/sala_evento?roomId='+o.sala;
	var html = "<html><body>";
		html += "Hola ,<br><br>";
		html += "Has sido invitado al siguiente evento :: <b>"+o.titulo+"</b><br><br>";
		html += "Creado por :: <b>"+o.gestor+"</b><br><br>";
		html += "La descripción del evento es la siguiente: <br><br>"+o.descripcion+"<br><br><br>";
		html += "El evento comenzará el <b>"+o.fecha+"</b> a la hora <b>"+o.hora+ "<br>";
		html += "<a href='"+link+"'>Pincha aqui para acceder al evento </a><br><br>";
		html += "Gracias.<br>";
		html += "</body></html>";
	return  [{data:html, alternative:true}];
};

EM.enviarConfirmacionEventoCreado = function(events,email, callback)
{
	EM.server.send({
		from         : ES.sender,
		to           : email,
		subject      : 'Su evento ha sido creado correctamente',
		text         : 'Algo fue mal... :(',
		attachment   : EM.emailConfirmacionEventoCreado(events)
	}, callback );
};

EM.emailConfirmacionEventoCreado = function(o)
{
	var link = 'http://localhost:3001/sala_evento_gestor?roomId='+o.sala;
	var html = "<html><body>";
		html += "Hola ,<br><br>";
		html += "Ha creado al siguiente evento :: <b>"+o.titulo+"</b><br><br>";
		html += "La descripción del evento es la siguiente: <br><br>"+o.descripcion+"<br><br><br>";
		html += "El evento comenzará el <b>"+o.fecha+"</b> a la hora <b>"+o.hora+ "<br>";
		html += "<a href='"+link+"'>Pincha aqui para acceder a la pagina de gestion del evento </a><br><br>";
		html += "Gracias.<br>";
		html += "</body></html>";
	return  [{data:html, alternative:true}];
};

EM.enviarModificacionEvento = function(events,email, callback)
{
	EM.server.send({
		from         : ES.sender,
		to           : email,
		subject      : 'Su evento ha sido modificado correctamente',
		text         : 'Algo fue mal... :(',
		attachment   : EM.emailConfirmacionEventoModificado(events)
	}, callback );
};

EM.emailConfirmacionEventoModificado = function(o)
{
	var link = 'http://localhost:3001/sala_evento_gestor?roomId='+o.sala;
	var html = "<html><body>";
		html += "Hola ,<br><br>";
		html += "Ha modificado correctamente el siguiente evento :: <b>"+o.titulo+"</b><br><br>";
		html += "La descripción del evento es la siguiente: <br><br>"+o.descripcion+"<br><br><br>";
		html += "El evento comenzará el <b>"+o.fecha+"</b> a la hora <b>"+o.hora+ "<br>";
		html += "<a href='"+link+"'>Pincha aqui para acceder a la pagina de gestion del evento </a><br><br>";
		html += "Gracias.<br>";
		html += "</body></html>";
	return  [{data:html, alternative:true}];
};