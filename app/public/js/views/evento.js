//-
//- Copyright (C) Manuel J. Blanco Vecino
//- 
//- Desarrollo de un centro de videoconferencias utilizando WebRTC
//- Project site: https://github.com/manublanco/Centro-de-Videoconferencias
//- 
//- Proyecto fin de carrera. Universidade da Coruña
//-

$(document).ready(function(){

	var hc = new eventoController();
	var av = new EventoValidator();


	
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
			if (status == 'success') hc.onCreateSuccess();
		},
		error : function(e){
			//if (e.responseText == 'email-taken'){
			  //  av.showInvalidEmail();
			//}	else if (e.responseText == 'username-taken'){
			  //  av.showInvalidUserName();
			//}
		}
	});

	var date = new Date();

	var day = date.getDate();
	var month = date.getMonth() + 1;
	var year = date.getFullYear();

	if (month < 10) month = "0" + month;
	if (day < 10) day = "0" + day;

	var today = year + "-" + month + "-" + day;       
	document.getElementById("fecha-tf").value = today;
	document.getElementById("fecha-tf").min = today;

     

// customize the account settings form //
	
	$('#evento-form h1').text('Crear un Evento');
	$('#evento-form #sub1').text('Formulario para la creación de un evento.');
	$('#user-tf').attr('disabled', 'desactivado');
	$('#evento-form-btn1').html('Cancelar');
	$('#evento-form-btn2').html('Crear Evento');



})