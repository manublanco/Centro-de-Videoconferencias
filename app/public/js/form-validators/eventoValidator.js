//-
//- Copyright (C) Manuel J. Blanco Vecino
//- 
//- Desarrollo de un centro de videoconferencias utilizando WebRTC
//- Project site: https://github.com/manublanco/Centro-de-Videoconferencias
//- 
//- Proyecto fin de carrera. Universidade da Coruña
//-
 

var array_invitados = [];


function EventoValidator(){

// build array maps of the form inputs & control groups //

	this.formFields = [$('#titulo-tf'), $('#descripcion-tf'), $('invitado-tf'), $('#fecha-tf'), $('#hora-tf')];
	this.controlGroups = [$('#titulo-cg'), $('#descripcion-cg'),$('#invitado-cg'), $('#fecha-cg')];
	
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

	this.validateInvitados = function(s)
	{
		return s.length >= 3;
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
		this.controlGroups[0].addClass('error'); e.push('Por favor,introduzca un titulo de al menos 3 caracteres');
		console.log('foooooor',this.formFields);
		console.log('foooooor',this.controlGroups);


	}
	
	if (this.validateDescripcion(this.formFields[1].val()) == false) {
		this.controlGroups[1].addClass('error');
		e.push('Ponga una descripción del evento de al menos 10 caracteres');
	}
/*
	if (this.validateInvitados(this.formFields[2].val()) == false) {
		this.controlGroups[2].addClass('error');
		e.push('Tiene que invitar al menos a una persona');
	}*/



	if (e.length) this.showErrors(e);
	return e.length === 0;
}


function anhadirInvitado()
   {


     var x = document.getElementById("box");
     var space = " ";
     var valor = document.getElementById("invitado-tf").value;
     var res = space.concat(valor);
     console.log (res);
     array_invitados.push(res);
     x.innerHTML = array_invitados.join('<br/>'); 

     console.log(window.array_invitados);

     document.getElementById("array-tf").value = array_invitados;

 

   }	






