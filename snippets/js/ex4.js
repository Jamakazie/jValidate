var ex4 = {
	validate: {
		'ex-4-precon': {
			required: true,
			messageElement: '.message',
			precondition: function(){ return !$('#precon-example').is(':checked');}
		}
	}
};

var jVal4 = $('#form-4').jValidate(ex4);
