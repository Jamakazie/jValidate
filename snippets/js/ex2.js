var ex2 = {
	validate : {
		'ex-2-name' : {
			required: true,
			messageElement: '.message',
			minLength: 5,
		},
		'ex-2-score' : {
			rule: /^\d+$/,
			messageElement: '.message',
			ruleMessage : 'Input must be a positive integer'
		},
		'ex-2-hp' : {
			rule: /^\d+$/,
			messageElement: '.message',
			ruleMessage: 'Input must be a positive integer'
		},
		'ex-2-mp' : {
			rule: /^\d+$/,
			messageElement: '.message',
			ruleMessage: 'Input must be a positive integer'
		},
	},
	groups : {
		'group-1': {
			container : '#ex-2-group-1',
			errors: '#group-1',
		},
		'group-2': {
			container: '#ex-2-group-2',
			errors: '#group-2',
		}
	}
};

var jval2 = $('#form-2').jValidate(ex2);
