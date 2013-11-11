/*
Author: jama
Date: 11/8/2013
Verison: 1.0
Description:    I'd pretty much advise no one to actually use this plugin, I made it simply to get
                some exposure to making plugins in jquery.  If you really want to, feel free to go ahead.
*/

(function ($) {
    $.fn.jValidate = function (options) {
        var that = this;                    // Want to be able to accessing the calling element
        var emailRegex = /^.+@.+\..+/;      // super simple regex to just check if anything@anything.anything
        var settings = {                                // Default settings
            validate : {                                       // Defaults for validation
                required        : true,                             // If true, field is required to have input                                   
                email           : false,                            // if true, will validate if email address
                rule            : false,                            // if not false, will use as regex to validate against, consider adding extra information to rules
                ruleMessage     : "Invalid characters in input",    // Rule messages are often very specific to the validation being applied, and may need a more specific message than found in errors.messages
                minLength       : -1,                               // if >0, a min length validaiton will be applied
                maxLength       : -1,                               // if >0, a max length validation will be applied
                precondition    : function () { return true;},      // Function, if certain prerequisites must be met before a field is considered for validation
                errors          : null,                             // Element to show if any class has errors(Specific to class)
                messageElement  : null                              // Message element to look for, will look first in direct parent.find(element), if not found, will look for $(element), if not find, will log error message
            },
            errors :  {                                     // Defaults for when errors occur
                scrollToError   : false,                            // If true, will scroll to the first error that occurs on the page 
                errorContainer  : null,                             // If not null will use the element show refers to show overall validation messages
                name: 'errors',                                     // Class applies to inputs when validation errors are presnet
                messages: {                                         // Default messages when validaiton issues occur
                    required    : "This input is required",                     // Default message when required error is present
                    email       : "Not a valid email address",                  // Default message when email error is present... you get the gist
                    minLength   : "Input must be at least {0}",            
                    maxLength   : "Input must be less than {0}",
                    replaceChar : "{0}"                                         // Replace char will be replaced by relevant information in error message, eg {0} in minLength is replaced with the length of the input

                }
            },
            groups: null                                    // No groups by default, these are expensive to use! Use with caution
        };
        // Apply defauls to options.errors, options.groups
        options.errors = $.extend({}, settings.errors, options.errors);
        options.groups = $.extend({}, settings.groups, options.groups);

        // Setup an easy to access rep character
        var rep = options.errors.messages.replaceChar;
        // Wiring up blur events to check if input is
        for (key in options.validate) {
            if (options.validate.hasOwnProperty(key)) {
                (function (key) {
                    $(that).on('blur', '.' + key, function () { validate(key, $(this)); });
                })(key);
            }
        }
        // Wire up group functions
        for (key in options.groups) {
            if (options.groups.hasOwnProperty(key)) {
                (function (key, selector) {
                    var groupclasses =
                        $.map(options.validate, function (value, valkey) {
                            return selector + ' .' + valkey;
                        }).join(", ");
                    // Maybe we should extract anonymous function?
                    $(that).on('blur', groupclasses, function () {
                        // We don't have the precondition for ensuring validation
                        if ('preconditionCheck' in options.groups[key] && !options.groups[key].preconditionCheck()) {
                            $(selector + " ." + options.errors.name).removeClass(options.errors.name);
                            $(options.groups[key].errors).hide();
                        }else {
                            if ($(selector + " ." + options.errors.name).length == 0) {
                                $(selector + " ." + options.errors.name).removeClass(options.errors.name);
                                $(options.groups[key].errors).hide();
                            } else {
                                $(selector + " ." + options.errors.name).addClass(options.errors.name);
                                $(options.groups[key].errors).show();
                            }
                        }
                    });
                })(key, options.groups[key].container);
            }
        }

        function validate(key, thar) {
            var value = thar.val();
            var errorsMessages = [];
            params = $.extend({}, settings.validate, options.validate[key]);
            var doMessages = function (data) {
                if (params.messageElement !== null) {
                    // We check to see if the message element exists in the same parent that the input is in
                    if (thar.parent().find(params.messageElement).length > 0) {
                        thar.parent().find(params.messageElement).html(data);
                    }
                    else {
                        // We didn't find the message element in the same parent, search globally (Ideally, this shouldn't happen)
                        if ($(params.messageElement).length > 0) {
                            $(params.messageElement).html(data);
                        }
                            // Shit hit the fan, we can't find the element :(
                        else {
                            console.log("We can't find the element: " + params.messageElement + " check configuration file");
                        }
                    }
                }
            }
            // Only check rules if precondition is met
            if (params.precondition()) {
                if ((params.required && !value)) {
                    errorsMessages.push(options.errors.messages.required);
                }
                if (params.email && !emailRegex.test(value)) {
                    errorsMessages.push(options.errors.messages.email);
                }
                if (value.toString().length < params.minLength) {
                    errorsMessages.push(options.errors.messages.minLength.replace(rep, params.minLength));
                }
                if (params.maxLength > 0 && value.toString().length > params.maxLength) {
                    errorsMessages.push(options.errors.messages.maxLength.replace(rep, params.maxLength));
                }
                if (!!params.rule && !params.rule.test(value)) {
                    errorsMessages.push(params.ruleMessage);
                }
            }
            // We have errors! Add corresponding error messages
            if (errorsMessages.length != 0) {
                thar.addClass(options.errors.name);
                $(params.errors).show();
                if (options.errors.errorContainer !== null) {
                    $(options.errors.errorContainer).show();
                }
                doMessages(errorsMessages.join(", "));
            }
            // We have no errors! Remove any existing error messages for this validation element
            else {
                thar.removeClass(options.errors.name);
                doMessages("");
                // if: None of the elements in this key have errors, remove key-wide error statement (options.{class}.errors element)
                if (params.errors !== null && $('.' + key + '.' + options.errors.name).length == 0) {
                    $(params.errors).hide();
                }
                // if: No errors exist globally, hide global error message
                if (options.errors.errorContainer !== null && $('.' + options.errors.name).length == 0) {
                    $(options.errors.errorContainer).hide();
                }
            }
            return errorsMessages.length == 0;
        }
        
        var fancystuff = {
            'isValid': function () {
                var isValid = true;
                var errorsParams = $.extend(true, settings.errors, options.errors);
                $('.' + options.errors.name).removeClass(options.errors.name);
                // Loop through all the fields needing to be validated
                for (var key in options.validate) {
                    if (options.validate.hasOwnProperty(key) && !validate(key, $('.' + key))) {
                        isValid = false;
                    }
                }
                if (!isValid) {
                    if (errorsParams.scrollToError) {
                        $('html, body').animate({
                            scrollTop: $("."+ options.errors.name+ ":first").offset().top - 50
                        }, 500);
                    }
                }
                return isValid;
            }
        }
        // Return fancystuff so we can call .isValid() on the var we assign to jValidate
        return fancystuff;
    }
}(jQuery));
