//-
//- Copyright (C) Manuel J. Blanco Vecino
//- 
//- Desarrollo de un centro de videoconferencias utilizando WebRTC
//- Project site: https://github.com/manublanco/Centro-de-Videoconferencias
//- 
//- Proyecto fin de carrera. Universidade da Coruña
//-

$(document).ready(function(){

	var hc = new modificarEventoController();
	var av = new modificarEventoValidator();


	
	$('#evento-form').ajaxForm({
		beforeSubmit : function(formData, jqForm, options){
			if (av.validateForm() == false){
				return false;
			} 	else{
			// push the disabled username field onto the form data array //
				formData.push({name:'user', value:$('#user-tf').val()})

				return true;
			}
		},
		success	: function(responseText, status, xhr, $form){
			if (status == 'success') hc.onUpdateSuccess();
		},
		error : function(e){
		}
	});


     

// customize the account settings form //
	
	$('#evento-form h1').text('Modificar Evento');
	window.onload=guardar_invitados_previos();
	$('#evento-form #sub1').text('Formulario para la modificación de un evento.');
	$('#user-tf').attr('disabled', 'desactivado');
	$('#evento-form-btn1').html('Cancelar');
	$('#evento-form-btn2').html('Actualizar');



})