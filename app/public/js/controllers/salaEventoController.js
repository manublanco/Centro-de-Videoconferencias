//-
//- Copyright (C) Manuel J. Blanco Vecino
//- 
//- Desarrollo de un centro de videoconferencias utilizando WebRTC
//- Project site: https://github.com/manublanco/Centro-de-Videoconferencias
//- 
//- Proyecto fin de carrera. Universidade da Coruña
//-

function salaEventoController()
{

// bind event listeners to button clicks //
	var that = this;

// handle user logout //
	$('#btn-logout').click(function(){ that.attemptLogout(); });



	this.attemptLogout = function()
	{
		var that = this;
		$.ajax({
			url: "/sala_evento",
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


