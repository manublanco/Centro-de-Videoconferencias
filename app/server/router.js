//-
//- Copyright (C) Manuel J. Blanco Vecino
//- 
//- Desarrollo de un centro de videoconferencias utilizando WebRTC
//- Project site: https://github.com/manublanco/Centro-de-Videoconferencias
//- 
//- Proyecto fin de carrera. Universidade da Coruña
//-

var CT = require('./modules/country-list');
var AM = require('./modules/account-manager');
var EM = require('./modules/email-dispatcher');
var N = require('./../../nuve');
var EV = require('./../public/js/form-validators/eventoValidator');




module.exports = function(app) {



// main login page //

	app.get('/', function(req, res){
	// check if the user's credentials are saved in a cookie //
		if (req.cookies.user === undefined || req.cookies.pass === undefined){
			res.render('login', { title: 'Hello - Please Login To Your Account' });
		}	else{
	// attempt automatic login //
			AM.autoLogin(req.cookies.user, req.cookies.pass, function(o){
				if (o !== null){
					req.session.user = o;
					res.redirect('/home');
				}	else{
					res.render('login', { title: 'Hello - Please Login To Your Account' });
				}
			});
		}
	});
	
	app.post('/', function(req, res){
		AM.manualLogin(req.param('user'), req.param('pass'), function(e, o){
			if (!o){
				res.send(e, 400);
			}	else{
				req.session.user = o;
				if (req.param('remember-me') == 'true'){
					res.cookie('user', o.user, { maxAge: 900000 });
					res.cookie('pass', o.pass, { maxAge: 900000 });
				}
				res.send(o, 200);
			}
		});
	});
	
// logged-in user homepage //
	
	app.get('/home', function(req, res) {
		if (req.session.user === null){
	// if user is not logged-in redirect back to login page //
		res.redirect('/');
		}else{
			res.render('home', {
				title : 'Control Panel',
				countries : CT,
				udata : req.session.user
			});
		}
	});
	
	app.post('/home', function(req, res){
		if (req.param('user') !== undefined) {
			AM.updateAccount({
				user        : req.param('user'),
				name		: req.param('name'),
				email       : req.param('email'),
				country     : req.param('country'),
				pass        : req.param('pass')
			}, function(e, o){
				if (e){
					res.send('error-updating-account', 400);
				}	else{
					req.session.user = o;
			// update the user's login cookies if they exists //
					if (req.cookies.user !== undefined && req.cookies.pass !== undefined){
						res.cookie('user', o.user, { maxAge: 900000 });
						res.cookie('pass', o.pass, { maxAge: 900000 });	
					}
					res.send('ok', 200);
				}
			});
		}	else if (req.param('logout') == 'true'){
			res.clearCookie('user');
			res.clearCookie('pass');
			req.session.destroy(function(e){ res.send('ok', 200); });
		}
	});
	
//datos usuario //

app.get('/datos-usuario', function(req, res) {
	if (req.session.user === null){
	// if user is not logged-in redirect back to login page //
	res.redirect('/');
	}else{
			res.render('datos-usuario', {
				title : 'Control Panel',
				countries : CT,
				udata : req.session.user
			});
		}
	});
	
	app.post('/datos-usuario', function(req, res){
		if (req.param('user') !== undefined) {
			AM.updateAccount({
				user        : req.param('user'),
				name        : req.param('name'),
				email       : req.param('email'),
				country     : req.param('country'),
				pass        : req.param('pass')
			}, function(e, o){
				if (e){
					res.send('error-updating-account', 400);
				}	else{
					req.session.user = o;
			// update the user's login cookies if they exists //
					if (req.cookies.user !== undefined && req.cookies.pass !== undefined){
						res.cookie('user', o.user, { maxAge: 900000 });
						res.cookie('pass', o.pass, { maxAge: 900000 });	
					}
					res.send('ok', 200);
				}
			});
		}	else if (req.param('logout') == 'true'){
			res.clearCookie('user');
			res.clearCookie('pass');
			req.session.destroy(function(e){ res.send('ok', 200); });
		}
	});
	

//crear Evento

	app.get('/crear-evento', function(req, res) {
		if (req.session.user === null){
	// if user is not logged-in redirect back to login page //
		res.redirect('/');
		}else{
			res.render('crear-evento', {
				title : 'Crear Evento',
				countries : CT,
				udata : req.session.user
			});
		}
	});

	
	
	app.post('/crear-evento', function(req, res){
		if (req.param('user') !== undefined) {
			var invitados_array = req.param('array_invitados').split(",");
		
		N.API.createRoom('id_sala', function (roomID) {
				id_sala = roomID._id;
				console.log('Created room ', id_sala);
			AM.addNewEvent({
				titulo          : req.param('titulo'),
				gestor			: req.param('user'),
				descripcion     : req.param('descripcion'),
				fecha           : req.param('fecha'),
				hora            : req.param('hora'),
				sala            : id_sala,
				invitados		: invitados_array
			}, function(e, o){
				if (e){
					res.send('error-creando-evento', 400);
				}	else{
					AM.getEmailByUser(req.param('user'),function(a){
						email = a.email;
						AM.getEventByTitulo(req.param('titulo'), function(o){

						EM.enviarConfirmacionEventoCreado(o,email,function(e,m){
						// this callback takes a moment to return //
						// should add an ajax loader to give user feedback //
						if (!e) {
							res.send('ok', 200);
						}	else{
							res.send('email-server-error', 400);
							for (var k in e) console.log('error : ', k, e[k]);
						}
					});
						EM.enviarInvitacion(o,function (e,m){	

						// this callback takes a moment to return //
						// should add an ajax loader to give user feedback //
						if (!e) {
							res.send('ok', 200);
						}	else{
							res.send('email-server-error', 400);
							for (var k in e) console.log('error : ', k, e[k]);
						}
					});


					// update the user's login cookies if they exists //
					//if (req.cookies.user != undefined && req.cookies.pass != undefined){
					//	res.cookie('user', req.session.user, { maxAge: 900000 });
					//	res.cookie('pass', req.session.pass, { maxAge: 900000 });	
					//}
					res.send('ok', 200);
							});
						});
					}	

			});
		});
	}
			else if (req.param('logout') == 'true'){
			res.clearCookie('user');
			res.clearCookie('pass');
			req.session.destroy(function(e){ res.send('ok', 200); });
		}
	});
	
//Modificar Evento


	app.get('/modificar_evento', function(req, res) {
		if (req.session.user === null){
	// if user is not logged-in redirect back to login page //
			res.redirect('/');
		}else{
			var sala = req.query.roomId;

			AM.getEventBySala(sala, function(a){
				evento=a;

				res.render('modificar_evento', {
				title : 'Modificar evento',
				countries : CT,
				edata : evento
				});
			});	
		}
	});

	
	
	app.post('/modificar_evento', function(req, res){
		if (req.param('user') !== undefined) {
			
			var invitados_array = req.param('array_invitados').split(",");

			var sala = String(req.query.roomId);
			AM.updateEvent(sala,{
				titulo          : req.param('titulo'),
				gestor			: req.param('user'),
				descripcion     : req.param('descripcion'),
				fecha           : req.param('fecha'),
				hora            : req.param('hora'),
				invitados		: invitados_array
			}, function(e, o){
				if (e){
					res.send('error-modificando-evento', 400);
				}	else{
					AM.getEmailByUser(o.gestor,function(a){
						var email = a.email;
						AM.getEventByTitulo(req.param('titulo'), function(o){

						EM.enviarModificacionEvento(o,email,function(e,m){
						// this callback takes a moment to return //
						// should add an ajax loader to give user feedback //
						if (!e) {
							res.send('ok', 200);
						}	else{
							res.send('email-server-error', 400);
							for (var k in e) console.log('error : ', k, e[k]);
						}
					});
						EM.enviarInvitacion(o,function (e,m){	
						// this callback takes a moment to return //
						// should add an ajax loader to give user feedback //
						if (!e) {
							res.send('ok', 200);
						}	else{
							res.send('email-server-error', 400);
							for (var k in e) console.log('error : ', k, e[k]);
						}
					});


					// update the user's login cookies if they exists //
					//if (req.cookies.user != undefined && req.cookies.pass != undefined){
					//	res.cookie('user', req.session.user, { maxAge: 900000 });
					//	res.cookie('pass', req.session.pass, { maxAge: 900000 });	
					//}
					res.send('ok', 200);
							});
						});
					}	

			});
	}
			else if (req.param('logout') == 'true'){
			res.clearCookie('user');
			res.clearCookie('pass');
			req.session.destroy(function(e){ res.send('ok', 200); });
		}
	});


	app.post('/deleteEvent', function(req, res){
		if (req.session.user.user !== undefined) {
         N.API.deleteRoom(req.body.sala, function(result) {
			AM.deleteEvent(req.body.sala, function(e, obj){
				if (!e){
					res.send('ok', 200);

				}	else{
					res.send('record not found', 400);
				}
			});
		});
     }else if (req.param('logout') == 'true'){
					res.clearCookie('user');
					res.clearCookie('pass');
					req.session.destroy(function(e){ res.send('ok', 200); });
			}
	});
		


//Sala evento

	
	app.get('/sala_evento', function(req, res) {
		if (req.session.user === null){
	// if user is not logged-in redirect back to login page //
			res.redirect('/');
		}else{
			var sala = req.query.roomId;
			AM.getEventBySala(sala,function(a){
				evento = a;
				res.render('sala_evento', {
				title : 'Control Panel',
				udata : req.session.user,
				edata : evento
			});
		});
	}
	});
	
	app.post('/sala_evento', function(req, res){
		if (req.param('user') !== undefined) {
			AM.updateAccount({
				user        : req.param('user'),
				name        : req.param('name'),
				email       : req.param('email'),
				country     : req.param('country'),
				pass		: req.param('pass')
			}, function(e, o){
				if (e){
					res.send('error-updating-account', 400);
				}	else{
					req.session.user = o;
			// update the user's login cookies if they exists //
					if (req.cookies.user !== undefined && req.cookies.pass !== undefined){
						res.cookie('user', o.user, { maxAge: 900000 });
						res.cookie('pass', o.pass, { maxAge: 900000 });	
					}
					res.send('ok', 200);
				}
			});
		}	else if (req.param('logout') == 'true'){
			res.clearCookie('user');
			res.clearCookie('pass');
			req.session.destroy(function(e){ res.send('ok', 200); });
		}
	});

	
	app.get('/sala_evento_gestor', function(req, res) {

		if (req.session.user === null){
			res.redirect('/');

		} 
		else{ 

		var gestor = req.session.user.user;
		var sala = req.query.roomId;



		AM.getEventByGestorAndSala(gestor,sala,function(a){
				var x = a;
			if (typeof x !== undefined){
				if (x !== null){
					if (req.session.user.user == a.gestor){
						res.render('sala_evento_gestor', {
							title : 'Control Panel',
							udata : req.session.user,
							edata : x
						});	
					}
				}

		else {
		res.redirect('/');
		}
	}
});  
	}
});







	
	app.post('/sala_evento_gestor', function(req, res){
		if (req.param('user') !== undefined) {
			AM.updateAccount({
				user        : req.param('user'),
				name        : req.param('name'),
				email       : req.param('email'),
				country     : req.param('country'),
				pass		: req.param('pass')
			}, function(e, o){
				if (e){
					res.send('error-updating-account', 400);
				}	else{
					req.session.user = o;
			// update the user's login cookies if they exists //
					if (req.cookies.user !== undefined && req.cookies.pass !== undefined){
						res.cookie('user', o.user, { maxAge: 900000 });
						res.cookie('pass', o.pass, { maxAge: 900000 });	
					}
					res.send('ok', 200);
				}
			});
		}	else if (req.param('logout') == 'true'){
			res.clearCookie('user');
			res.clearCookie('pass');
			req.session.destroy(function(e){ res.send('ok', 200); });
		}
	});

// creating new accounts //
	
	app.get('/signup', function(req, res) {
		res.render('signup', {  title: 'Signup', countries : CT });
	});
	
	app.post('/signup', function(req, res){
		AM.addNewAccount({
			name    : req.param('name'),
			email   : req.param('email'),
			user    : req.param('user'),
			pass	: req.param('pass'),
			country : req.param('country')
		}, function(e){
			if (e){
				res.send(e, 400);
			}	else{
				res.send('ok', 200);
			}
		});
	});

	
	app.get('/eventos_creados', function(req, res) {
		if (req.session.user === null){
	// if user is not logged-in redirect back to login page //
			res.redirect('/');
		}else{

			var gestor = req.session.user;
			var correo = gestor.email;
			AM.getEventByGestor(gestor.user,function(o){
				var eventosCreados = o;


			AM.getEventByEmail(correo,function(a){
				var events= a;
				res.render('eventos_creados', {
				title : 'Eventos Creados',
				udata : req.session.user,
				eventos_invitado: events,
				eventos_creados: eventosCreados

			});
		});
		});
	}
	});

	app.post('/eventos_creados', function(req, res){
		if (req.param('user') !== undefined) {
			AM.updateAccount({
				user        : req.param('user'),
				name		: req.param('name'),
				email       : req.param('email'),
				country     : req.param('country'),
				pass        : req.param('pass')
			}, function(e, o){
				if (e){
					res.send('error-updating-account', 400);
				}	else{
					req.session.user = o;
			// update the user's login cookies if they exists //
					if (req.cookies.user !== undefined && req.cookies.pass !== undefined){
						res.cookie('user', o.user, { maxAge: 900000 });
						res.cookie('pass', o.pass, { maxAge: 900000 });	
					}
					res.send('ok', 200);
				}
			});
		}	else if (req.param('logout') == 'true'){
			res.clearCookie('user');
			res.clearCookie('pass');
			req.session.destroy(function(e){ res.send('ok', 200); });
		}
	});



	app.get('/eventos_invitado', function(req, res) {
		if (req.session.user === null){
	// if user is not logged-in redirect back to login page //
			res.redirect('/');
		}else{

			var gestor = req.session.user;
			var correo = gestor.email;
			correo2=' '+correo;
			AM.getEventByGestor(gestor.name,function(o){
				var eventosCreados = o;

			
			AM.getEventByEmail(correo2,function(a){
				var events= a;
				res.render('eventos_invitado', {
				title : 'Invitaciones a Eventos',
				udata : req.session.user,
				eventos_invitado: events,
				eventos_creados: eventosCreados

			});
		});
		});
	}
	});

		app.post('/eventos_invitado', function(req, res){
		if (req.param('user') !== undefined) {
			AM.updateAccount({
				user        : req.param('user'),
				name		: req.param('name'),
				email       : req.param('email'),
				country     : req.param('country'),
				pass        : req.param('pass')
			}, function(e, o){
				if (e){
					res.send('error-updating-account', 400);
				}	else{
					req.session.user = o;
			// update the user's login cookies if they exists //
					if (req.cookies.user !== undefined && req.cookies.pass !== undefined){
						res.cookie('user', o.user, { maxAge: 900000 });
						res.cookie('pass', o.pass, { maxAge: 900000 });	
					}
					res.send('ok', 200);
				}
			});
		}	else if (req.param('logout') == 'true'){
			res.clearCookie('user');
			res.clearCookie('pass');
			req.session.destroy(function(e){ res.send('ok', 200); });
		}
	});




// password reset //

	app.post('/lost-password', function(req, res){
	// look up the user's account via their email //
		AM.getAccountByEmail(req.param('email'), function(o){
			if (o){
				res.send('ok', 200);
				EM.dispatchResetPasswordLink(o, function(e, m){
				// this callback takes a moment to return //
				// should add an ajax loader to give user feedback //
					if (!e) {
					//	res.send('ok', 200);
					}	else{
						res.send('email-server-error', 400);
						for (var k in e) console.log('error : ', k, e[k]);
					}
				});
			}	else{
				res.send('email-not-found', 400);
			}
		});
	});

	app.get('/reset-password', function(req, res) {
		var email = req.query.e;
		var passH = req.query.p;
		AM.validateResetLink(email, passH, function(e){
			if (e != 'ok'){
				res.redirect('/');
			} else{
	// save the user's email in a session instead of sending to the client //
				req.session.reset = { email:email, passHash:passH };
				res.render('reset', { title : 'Reset Password' });
			}
		});
	});
	
	app.post('/reset-password', function(req, res) {
		var nPass = req.param('pass');
	// retrieve the user's email from the session to lookup their account and reset password //
		var email = req.session.reset.email;
	// destory the session immediately after retrieving the stored email //
		req.session.destroy();
		AM.updatePassword(email, nPass, function(e, o){
			if (o){
				res.send('ok', 200);
			}	else{
				res.send('unable to update password', 400);
			}
		});
	});
	
// view & delete accounts //
	
	app.get('/print', function(req, res) {
		AM.getAllRecords( function(e, accounts){
			res.render('print', { title : 'Account List', accts : accounts });
		});
	});
	
	app.post('/delete', function(req, res){
		AM.deleteAccount(req.body.id, function(e, obj){
			if (!e){
				res.clearCookie('user');
				res.clearCookie('pass');
				req.session.destroy(function(e){ res.send('ok', 200); });
			}	else{
				res.send('record not found', 400);
			}
		});
	});



	
	app.get('/reset', function(req, res) {
		AM.delAllRecords(function(){
			res.redirect('/print');	
		});
	});
	
	app.get('*', function(req, res) { res.render('404', { title: 'Page Not Found'}); });

};