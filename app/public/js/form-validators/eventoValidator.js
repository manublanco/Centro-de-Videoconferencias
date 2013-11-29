//-
//- Copyright (C) Manuel J. Blanco Vecino
//- 
//- Desarrollo de un centro de videoconferencias utilizando WebRTC
//- Project site: https://github.com/manublanco/Centro-de-Videoconferencias
//- 
//- Proyecto fin de carrera. Universidade da Coruña
//-

function EventoValidator(){

// build array maps of the form inputs & control groups //

	this.formFields = [$('#titulo-tf'), $('#descripcion-tf'), $('#fecha-tf'), $('#hora-tf'), $('invitado-tf')];
	this.controlGroups = [$('#titulo-cg'), $('#descripcion-cg'), $('#fecha-cg'), $('#invitado-cg')];
	
// bind the form-error modal window to this controller to display any errors //
	
	this.alert = $('.modal-form-errors');
	this.alert.modal({ show : false, keyboard : true, backdrop : true});
	
	this.validateTitulo = function(s)
	{
		return s.length >= 3;
	}

	this.validateDescripcion = function(s)
	{
		return s.length >= 10;
	}
	


	
	this.showErrors = function(a)
	{
		$('.modal-form-errors .modal-body p').text('Por favor, solucione los siguientes problemas:');
		var ul = $('.modal-form-errors .modal-body ul');
			ul.empty();
		for (var i=0; i < a.length; i++) ul.append('<li>'+a[i]+'</li>');
		this.alert.modal('show');
	}

}



EventoValidator.prototype.validateForm = function()
{
	var e = [];
	for (var i=0; i < this.controlGroups.length; i++) this.controlGroups[i].removeClass('error');
	if (this.validateTitulo(this.formFields[0].val()) == false) {
		this.controlGroups[0].addClass('error'); e.push('Por favor,introduzca un titulo');
	}
	
	if (this.validateDescripcion(this.formFields[2].val()) == false) {
		this.controlGroups[2].addClass('error');
		e.push('Ponga una descripción del evento');
	}

	if (e.length) this.showErrors(e);
	return e.length === 0;
}

var array_invitados = [];

function anhadirInvitado()
   {
     var x = document.getElementById("box");
     array_invitados.push(document.getElementById("invitado-tf").value);
     x.innerHTML = array_invitados.join('<br/>'); 

     console.log(array_invitados);
     return array_invitados;

   }	

