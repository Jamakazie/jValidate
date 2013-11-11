/*
Author: jama
Date: 11/8/2013
Verison: .4b
Description:    I'd pretty much advise no one to actually use this plugin, I made it simply to get
                some exposure to making plugins in jquery.  If you really want to, feel free to go ahead.
*/

(function ($) {
    $.fn.jValidate = function (options) {
        var that = this;
        var emailRegex = /^.+@.+\..+/;   // super simple regex to just check if anything@anything.anything
        var settings = {                                // Default settings
            validate : {                                       // Defaults for validation
                required        : true,                             // If true, field is required to have input                                   
                email           : false,                            // if true, will validate if email address
                rule            : false,                            // if not false, will override all other rules and be used for validation
                minLength       : -1,                               // if >0, a min length validaiton will be applied
                maxLength       : -1,                               // if >0, a max length validation will be applied
                precondition    : function () { return true;},      // Function, if certain prerequisites must be met before a field is considered for validation
                errors          : null,                             // Element to show if any class has errors
                messageElement  : '#showmessage' //testing null                              // Message element to look for, will look first in direct parent.find(element), if not found, will look for $(element), if not find, will log error message
            },
            errors :  {                                     // Defaults for when errors occur
                scrollToError   : false,                            // If true, will scroll to the first error that occurs on the page 
                errorContainer  : null,                             // If not null will use the element show refers to show overall validation messages
                name: 'errors',                                     // Class applies to inputs when validation errors are presnet
                messages: {                                         // Default messages when validaiton issues occur
                    required    : "This input is required",                     // Default message when required error is present
                    email       : "Not a valid email address",                  // Default message when email error is present... you get the gist
                    rule        : "Invalid characters in input",                // If you're using a rule, seriously consider adding a better message
                    minLength   : "Input must be at least {0}",            
                    maxLength   : "Input must be less than {0}",
                    replaceChar : "{0}"

                }
            },
            groups: null                                    // No groups by default, these are expensive to use! Use with caution
        };
        // Apply defauls to options.errors, options.groups
        options.errors = $.extend({}, settings.errors, options.errors);
        options.groups = $.extend({}, settings.groups, options.groups);
        var rep = options.errors.messages.replaceChar;
        var validationclasses = [];
        function validate(key, thar) {
            //console.log(thar);
            var value = thar.val();
            var errorsMessages = [];
            params = $.extend({}, settings.validate, options.validate[key]);
            console.log(params);
            console.log("value: " + value);
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
                    errorsMessages.push(options.errors.messages.maxLength.replace(rep, params.maxlength));
                }
                if (!!params.rule && !params.rule.test(value)) {
                    errorsMessages.push(options.errors.messages.rule);
                }
            }
            //console.log(errorsMessages);
            //console.log(options.errors.errorContainer);
            // We have errors! Add Corresponding error messages
            if (errorsMessages.length != 0) {
                //console.log("we're in");
                thar.addClass(options.errors.name);
                $(params.errors).show();
                if (options.errors.errorContainer !== null) {
                    $(options.errors.errorContainer).show();
                }
                if (params.messageElement !== null) {
                    if (thar.parent().find(params.messageElement).length > 0) {
                        thar.parent().find(params.messageElement).html(errorsMessages.join(", "));
                    }
                    else {
                        if ($(params.messageElement).length > 0) {
                            $(params.messageElement).html(errorsMessages.join(", "));
                        }
                        else {
                            console.log("We can't find the element: " + params.messageElement + " check configuration file");
                        }
                    }
                }
            }
            // We have no errors! Remove any existing error messages for this validation element
            else {
                console.log('loc1');
                thar.removeClass(options.errors.name);
                // if: None of the elements in this key have errors, remove key-wide error statement
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
        
        for (key in options.validate) {
            if (options.validate.hasOwnProperty(key)) {
                // Wiring up events to check if input is valid on blur
                (function (key) {
                    $(that).on('blur', '.' + key, function () { validate(key, $(this)); });
                })(key);
            }
        }
        console.log(options);
        for (key in options.groups) {
            if (options.groups.hasOwnProperty(key)) {
                // Wire up group functions
                (function (key, selector) {
                    console.log("wiring up: " + selector);
                    var groupclasses =
                        $.map(options.validate, function (value, valkey) {
                            return selector + ' .' + valkey;
                        }).join(", ");
                    $(that).on('blur', groupclasses, function () {
                        // We don't have the precondition for ensuring validation
                        if ('preconditionCheck' in options.groups[key] && !options.groups[key].preconditionCheck()) {
                            console.log('in precond');
                            $(selector + " ." + options.errors.name).removeClass(options.errors.name);
                            $(options.groups[key].errors).hide();
                        }else {
                            if ($(selector + " ." + options.errors.name).length == 0) {
                                console.log('loc2');
                                $(selector + " ." + options.errors.name).removeClass(options.errors.name);
                                $(options.groups[key].errors).hide();
                            } else {
                                $(selector + " ." + options.errors.name).addClass(options.errors.name);
                                $(options.groups[key].errors).show();
                            }
                        }
                    });
                    console.log(groupclasses);
                })(key, options.groups[key].container);
            }
        }

        
        var fancystuff = {
            'isValid': function () {
                var isValid = true;
                var errorsParams = $.extend(true, settings.errors, options.errors);
                console.log('loc3');
                $('.' + options.errors.name).removeClass(options.errors.name);
                // Loop through all the fields needing to be validated
                for (var key in options.validate) {
                    if (!validate(key, $('.' + key))) {
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
        return fancystuff;
    }
}(jQuery));
