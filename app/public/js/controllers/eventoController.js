//-
//- Copyright (C) Manuel J. Blanco Vecino
//- 
//- Desarrollo de un centro de videoconferencias utilizando WebRTC
//- Project site: https://github.com/manublanco/Centro-de-Videoconferencias
//- 
//- Proyecto fin de carrera. Universidade da Coruña
//-



function eventoController()
{

// bind event listeners to button clicks //
	var that = this;

// handle user logout //
	$('#btn-logout').click(function(){ that.attemptLogout(); });

// cancelar creacion evento //
	$('#evento-form-btn1').click(function(){ window.location.href = '/';});

//submit crear evento
$('.modal-confirm .submit').click(function(){ that.createEvent(); });
//$('.modal-alert #ok').click(function(){ setTimeout(function(){window.location.href = '/';}, 300)});



	this.createEvent = function()
	{
		$('.modal-confirm').modal('hide');
		var that = this;
		$.ajax({
			url: '/crear-evento',
			type: 'POST',
			data: { id: $('#userId').val()},
			success: function(data){
	 			that.showLockedAlert('Evento Creado.<br>Redirigiendo a la pagina principal.');
			},


			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	}


	this.attemptLogout = function()
	{
		var that = this;
		$.ajax({
			url: "/crear-evento",
			type: "POST",
			data: {logout : true},
			success: function(data){
	 			that.showLockedAlert('Ahora esta desconectado.<br>Redirigiendo a la pagina principal.');
			},
			error: function(jqXHR){
				console.log(jqXHR.responseText+' :: '+jqXHR.statusText);
			}
		});
	}

	this.showLockedAlert = function(msg){
		$('.modal-alert').modal({ show : false, keyboard : false, backdrop : 'static' });
		$('.modal-alert .modal-header h3').text('Correcto!');
		$('.modal-alert .modal-body p').html(msg);
		$('.modal-alert').modal('show');
		$('.modal-alert button').click(function(){window.location.href = '/';})
		setTimeout(function(){window.location.href = '/';}, 3000);
	}
}


eventoController.prototype.onCreateSuccess = function()
{
	$('.modal-alert').modal({ show : false, keyboard : true, backdrop : true });
	$('.modal-alert .modal-header h3').text('Correcto!');
	$('.modal-alert .modal-body p').html('Su evento ha sido creado.');
	$('.modal-alert').modal('show');
	$('.modal-alert button').off('click');
}

