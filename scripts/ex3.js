var ex3 = {
	validate: {
		'ex-3-rule': {
			rule: /^.*(troglodyte).*$/,
			required: true,
		        ruleMessage: "Must contain the word troglodyte",
		        messageElement: '.message',
	       }
       }
}
var jval3 = $('#form-3').jValidate(ex3);
