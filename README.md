gh pages for jValidate
===

Can be found at: http://jamakazie.github.io/jValidate/

ex1=

html

```html
<form method="post" role="form" class="form-horizontal" id="validate">
	<div class="form-group">
		<label class="control-label col-sm-2">Required Example</label>
		<div class="col-sm-10">
			<input type="text" id="email" placeholder="Required" name="required" class="form-control required ">
			<div class="message"></div>
		</div>
	</div>
	<div class="form-group">
		<label class="control-label col-sm-2">Email Example</label>
		<div class="col-sm-10">
			<input type="text" placeholder="Email" name="email" class="form-control email ">
			<div class="message"></div>
		</div>
	</div>
	<div class="form-group">
		<label class="control-label col-sm-2">Min Length(5)</label>
		<div class="col-sm-10">
			<input type="text" placeholder="Min Length" name="minlength" value="" class="form-control minlength ">
			<div class="message"></div>
		</div>
	</div>
	<div class="form-group">
		<label class="control-label col-sm-2">Max Length(5)</label>
		<div class="col-sm-10">
			<input type="text" placeholder="Max Length" name="maxlength" value="" class="form-control maxlength ">
			<div class="message"></div>
		</div>
	</div>
</form>
```

js

```javascript
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

var jval = $('#validate').jValidate(ex1);
```
