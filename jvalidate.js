/*
Author: jama
Date: 11/8/2013
Verison: 1.1
Description:    jQuery plugin to assist in many common validation tasks
*/

(function ($) {
    $.fn.jValidate = function(options) {
        var that = this;                // Want to be able to accessing the calling element
        var emailRegex = /^.+@.+\..+/;  // super simple regex to just check if anything@anything.anything
        var defaults = {    // Default settings
            validate    : {     // Defaults for validation
                required        : false,                            // If true, field is required to have input                                   
                email           : false,                            // if true, will validate if email address
                rule            : false,                            // if not false, will use as regex to validate against, consider adding extra information to rules
                ruleMessage     : "Invalid characters in input",    // Rule messages are often very specific to the validation being applied, and may need a more specific message than found in errors.messages
                minLength       : -1,                               // if >0, a min length validaiton will be applied
                maxLength       : -1,                               // if >0, a max length validation will be applied
                precondition    : function() { return true; },      // Function, if certain prerequisites must be met before a field is considered for validation
                globalElement   : null,                             // Element to show if any class has errors(Specific to class)
                messageElement  : null,                             // Message element to look for, will look first in direct parent.find(element), if not found, will look for $(element), if not find, will log error message
                jUnique         : false,                            // If this element's input must be unique, specify class amongst which it must be unique against
                notEqualTo      : null                              // value must not be equal to parameter to be valid
            },
            errors  :    {      // Defaults for when errors occur
                scrollToError   : false,                            // If true, will scroll to the first error that occurs on the page 
                errorContainer  : null,                             // If not null will use the element show refers to show overall validation messages
                name            : 'errors',                         // Class applies to inputs when validation errors are presnet
                messages        : { // Default messages when validaiton issues occur
                    required        : "This input is required",                     // Default message when required error is present
                    email           : "Not a valid email address",                  // Default message when email error is present... you get the gist
                    minLength       : "Input must be at least {0}",                 // Min Length
                    maxLength       : "Input must be less than {0}",                // Max Length
                    replaceChar     : "{0}"                                         // Replace char will be replaced by relevant information in error message, eg {0} in minLength is replaced with the length of the input
                }
            },
            groups  : null      // No groups by default
        };
        
        // Apply defauls to options.errors, options.groups
        options.errors = $.extend({}, defaults.errors, options.errors);
        options.groups = $.extend({}, defaults.groups, options.groups);

        // Setup an easy to access rep character
        var rep = options.errors.messages.replaceChar;

        // Wiring up change events to check if input is valid
        for (key in options.validate) {
            if (options.validate.hasOwnProperty(key)) {
                (function(key) {
                    $(that).on('change', '.' + key, function() { validate(key, $(this)); });
                })(key);
            }
        }
        // Wire up group functions
        for (key in options.groups) {
            if (options.groups.hasOwnProperty(key)) {
                (function(key, selector) {
                    var groupclasses =
                        $.map(options.validate, function(value, valkey) {
                            return selector + ' .' + valkey;
                        }).join(", ");
                    // Maybe we should extract anonymous function?
                    $(that).on('change', groupclasses, function() {
                        // We don't have the precondition for ensuring validation
                        if ('preconditionCheck' in options.groups[key] && !options.groups[key].preconditionCheck()) {
                            $(selector + " ." + options.errors.name).removeClass(options.errors.name);
                            $(options.groups[key].errors).hide();
                        } else {
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
            params = $.extend({}, defaults.validate, options.validate[key]);
            var doMessages = function(data) {
                if (params.messageElement !== null) {
                    // We check to see if the message element exists in the same parent that the input is in
                    if (thar.parent().find(params.messageElement).length > 0) {
                        thar.parent().find(params.messageElement).html(data);
                    } else {
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
            };
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
                if (!!params.jUnique) {
                    // check if input is unique amongst class
                    var uniquevalues = [];
                    $(params.jUnique).each(function() {
                        var elemValue = $(this).val();
                        if (uniquevalues.indexOf(elemValue) != -1) {
                            errorsMessages.push("pewpewpew It doesn't actually have an error message lol :D"); // maybe we should fix that
                        }
                        uniquevalues.push(elemValue);
                    });
                }
                if (params.notEqualTo !== null && value === params.notEqualTo) {
                    // todo: finish this
                    errorsMessages.push('Cannot use: ' + params.notEqualTo);

                }
            }
            // We have errors! Add corresponding error messages
            if (errorsMessages.length != 0) {
                thar.addClass(options.errors.name);
                $(params.globalElement).show();
                if (options.errors.errorContainer !== null) {
                    $(options.errors.errorContainer).show();
                }
                if (params.messageElement !== null) {
                    doMessages(errorsMessages.join(", "));
                }
            }
                // We have no errors! Remove any existing error messages for this validation element
            else {
                thar.removeClass(options.errors.name);
                // Resets error messages
                doMessages("");
                // if: None of the elements in this key have errors, remove key-wide error statement (options.{class}.errors element)
                if (params.globalElement !== null && $('.' + key + '.' + options.errors.name).length == 0) {
                    $(params.globalElement).hide();
                }
                // if: No errors exist globally, hide super-global error message
                if (options.errors.errorContainer !== null && $('.' + options.errors.name).length == 0) {
                    $(options.errors.errorContainer).hide();
                }
            }
            return errorsMessages.length == 0;
        }

        var fancystuff = {
            'isValid': function() {
                var isValid = true;
                var errorsParams = $.extend(true, defaults.errors, options.errors);
                // Loop through all the fields needing to be validated
                for (var key in options.validate) {
                    if (options.validate.hasOwnProperty(key)) {
                        $('.' + key).each(function() {
                            if (!validate(key, $(this))) {
                                isValid = false;
                            }
                        });
                    }
                }
                if (!isValid) {
                    if (errorsParams.scrollToError) {
                        $('html, body').animate({
                            scrollTop: $("." + options.errors.name + ":first").offset().top - 50
                        }, 500);
                    }
                }
                return isValid;
            }
        }
        // Return fancystuff so we can call .isValid() on the var we assign to jValidate
        return fancystuff;
    };
}(jQuery));

