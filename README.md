jValidate
===

jValidate is a lightweight validation plugin for jQuery... or so I'd like it to be.  jValidate was created with the sole purpose of learning how jQuery plugins were created, also for more exposure to javascript in general

Required:
	- jQuery

Usage
===

jValidate is initalized by passing a javascript object of the following nature:

```javascript
var validation = {
	validate: { 				// keys within validate are used for validation
		name: {				// elements with the class 'name' will be checked for validation
			required: true,		// element is required (cannot be empty)
			errors: '#name_error'	// element to show if there are any validation issues in '.name'
		},
		number: {
			required: true,
			rule: /\d*/,		// Regex, if rule.test(input.val()) does not match, error raised 
			errors: '#number_error'
		},
	errors: {				// Settings for when errors occur
		scrollToError: true,		// If true, will scroll to the first '.errors' instance
		show: '#error_messages'		// eleement to show when errors exist
	}
};


var jval = $('#form_selector').jValidate(validation);

...

if(jval.isValid())
{
	// form is valid, do whatever
}
```

TODO
===

* Add more default settings
* Need to update doMessages when message is not found in parent element
* Add listeners to group preconditions
