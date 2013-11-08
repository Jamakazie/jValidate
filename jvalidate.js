/*
Author: jama
Date: 11/8/2013
Verison: .1b
Description:    I'd pretty much advise no one to actually use this plugin, I made it simply to get some exposure to making
                plugins in jquery.  If you really want to, feel free to go ahead.

*/

(function ($) {
    $.fn.jValidate = function (options) {
        console.log(options);
        var that = this;

        var settings = {
            validate : {
                required: true,
                minlength: false,
                rule: /.*/,
                precondition: function () { return true;},
                errors: null,
                message: false,
                messageElement: null
            },
            errors :  {
                scrollToError: false,
                //show: '#validation-messages',
                name: 'errors'
            },
        }

        console.log(settings);
        for (key in options.validate) {
            if (!options.validate.hasOwnProperty(key)) {
                continue;
            }
            (function (key) {
                params = $.extend({}, settings.validate, options.validate[key]);
                $(that).on('blur', '.' + key, function () {
                    var value = $(this).val();
                    if (params.precondition()) {
                        if ((params.required && !value) || value.replace(params.rule, '') !== '') {
                            $(this).addClass('errors');
                            if (!params.message) {
                                $(this).parents().find(params.messageElement).html(params.message).addClass('errors');
                            }
                        }
                        else {
                            $(this).removeClass('errors');
                            if ($('.' + key + '.errors').length == 0) {
                                $(options.validate[key].errors).hide();
                            }
                        }
                    } else {
                        $(this).removeClass('errors');
                        if ($('.' + key + '.errors').length == 0) {
                            $(options.validate[key].errors).hide();
                        }
                    }
                });
            })(key);
        }

        var fancystuff = {
            'isValid': function () {
                var isValid = true;
                var hideElements = [];
                var showElements = [];
                var errorsParams = $.extend(true, settings.errors, options.errors);
                if (errorsParams.show !== null) {
                    hideElements.push(errorsParams.show);
                }
                $('.errors').removeClass('errors');
                // Loop through all the fields needing to be validated
                for (var key in options.validate) {
                    if (options.validate.hasOwnProperty(key)) {
                        // Apply default params (validateDefault)
                        var params = $.extend({}, settings.validate, options.validate[key]);
                        // Push element to hide array
                        hideElements.push(params.errors);
                        var field = '.' + key;
                        that.find(field).each(function () {
                            var value = $(this).val();
                            if (params.precondition()) {
                                if ((params.required && !value) || value.replace(params.rule, '') !== '') {
                                    isValid = false;
                                    $(this).addClass('errors');
                                    if (showElements.indexOf(params.errors) == -1) {
                                        showElements.push(params.errors);
                                    }
                                    if (!params.message) {
                                        $(this).parents().find(params.messageElement).html(params.message).addClass('errors');
                                    }

                                }
                            }
                        });
                    }
                }
                $(hideElements.join()).hide();
                if (!isValid) {
                    $(showElements.join()).show();
                    if (errorsParams.show !== null) {
                        $(errorsParams.show).show();
                    }
                    if (errorsParams.scrollToError) {
                        $('html, body').animate({
                            scrollTop: $(".errors:first").offset().top - 50
                        }, 500);
                    }
                }
                return isValid;
            }
        }
        return fancystuff;
    }
}(jQuery));

