//-
//- Copyright (C) Manuel J. Blanco Vecino
//- 
//- Desarrollo de un centro de videoconferencias utilizando WebRTC
//- Project site: https://github.com/manublanco/Centro-de-Videoconferencias
//- 
//- Proyecto fin de carrera. Universidade da Coruña
//-

$(document).ready(function(){

	var hc = new eventosCreadosController();
	//var av = new AccountValidator();
	
	$('#account-form').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			if (av.validateForm() === false){
				return false;
			}else{
			// push the disabled username field onto the form data array //
				formData.push({name:'user', value:$('#user-tf').val()});
				return true;
			}
		},
		success	: function(responseText, status, xhr, $form){
			if (status == 'success') hc.onUpdateSuccess();
		},
		error : function(e){
			
		}
	});
	$('#name-tf').focus();
	//$('#github-banner').css('top', '41px');

// customize the account settings form //
	
	$('#account-form h1').text('Detalles de la cuenta');
	$('#account-form #sub1').text('Aqui estan los datos actuales de su cuenta.');
	$('#user-tf').attr('disabled', 'desactivado');
	$('#account-form-btn1').html('Borrado');
	$('#account-form-btn1').addClass('btn-danger');
	$('#account-form-btn2').html('Actualizar');

// setup the confirm window that displays when the user chooses to delete their account //

	$('.modal-confirm').modal({ show : false, keyboard : true, backdrop : true });
	$('.modal-confirm .modal-header h3').text('Borrar Cuenta');
	$('.modal-confirm .modal-body p').html('¿ Esta seguro de que quiere borrar su cuenta?');
	$('.modal-confirm .cancel').html('Cancelar');
	$('.modal-confirm .submit').html('Borrar');
	$('.modal-confirm .submit').addClass('btn-danger');

});