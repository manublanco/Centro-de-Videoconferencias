//-
//- Copyright (C) Manuel J. Blanco Vecino
//- 
//- Desarrollo de un centro de videoconferencias utilizando WebRTC
//- Project site: https://github.com/manublanco/Centro-de-Videoconferencias
//- 
//- Proyecto fin de carrera. Universidade da Coruña
//-

function LoginController()
{

// bind event listeners to button clicks //
	
	$('#login-form #forgot-password').click(function(){ $('#get-credentials').modal('show');});
	
// automatically toggle focus between the email modal window and the login form //

    $('#get-credentials').on('shown', function(){ $('#email-tf').focus(); });
	$('#get-credentials').on('hidden', function(){ $('#user-tf').focus(); });

}