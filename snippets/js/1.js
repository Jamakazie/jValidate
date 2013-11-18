var ex1 = {
	validate : {
		required: {
			required: true,
			messageElement: '.message',
		},
		email: {
			required: true,
			email: true,
			messageElement: '.message',
		},
		minlength: {
			required: true,
			minLength: 5,
			messageElement: '.message',
		},
		maxlength: {
			required: true,
			maxLength: 5,
			messageElement: '.message',
		},
	}
};

var jval = $('#form-1').jValidate(ex1);
