
$(document).ready(function(){
	
	var lv = new LoginValidator();
	var lc = new LoginController();

// main login form //

	$('#login-form').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			if (lv.validateForm() == false){
				return false;
			} 	else{
			// append 'remember-me' option to formData to write local cookie //
				formData.push({name:'remember-me', value:$("input:checkbox:checked").length == 1})
				return true;
			}
		},
		success	: function(responseText, status, xhr, $form){
			if (status == 'success') window.location.href = '/home';
		},
		error : function(e){
            lv.showLoginError('Fallo al ingresar', 'Por favor, comprueba que tu usario y/o contraseña sean validos');
		}
	}); 
	$('#user-tf').focus();
	
// login retrieval form via email //
	
	var ev = new EmailValidator();
	
	$('#get-credentials-form').ajaxForm({
		url: '/lost-password',
		beforeSubmit : function(formData, jqForm, options){
			if (ev.validateEmail($('#email-tf').val())){
				ev.hideEmailAlert();
				return true;
			}	else{
				ev.showEmailAlert("<b> Error!</b> Ppr favor ingrese una direccion de correo valida");
				return false;
			}
		},
		success	: function(responseText, status, xhr, $form){
			ev.showEmailSuccess("Compruebe su correo para saber como recuperar su contraseña.");
		},
		error : function(){
			ev.showEmailAlert("Lo sentimos, se ha encontrado un problema. Por favor, intentelo mas tarde.");
		}
	});
	
})