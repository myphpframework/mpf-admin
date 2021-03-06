"use strict";

var mpf = mpf || $({});
mpf.forms = {};

mpf.countries = ["AF","AL","DZ","AS","AD","AO","AI","AQ","AG","AR","AM","AW","AU","AT","AZ","BS","BH","BD","BB","BY","BE","BZ","BJ","BM","BT","BO","BA","BW","BV","BR","IO","BN","BG","BF","BI","KH","CM","CA","CV","KY","CF","TD","CL","CN","CX","CC","CO","KM","CG","CK","CR","CI","HR","CU","CY","CZ","DK","DJ","DM","DO","TP","EC","EG","SV","GQ","ER","EE","ET","FK","FO","FJ","FI","FR","FX","GF","PF","TF","GA","GM","GE","DE","GH","GI","GR","GL","GD","GP","GU","GT","GN","GW","GY","HT","HM","HN","HK","HU","IS","IN","ID","IR","IQ","IE","IL","IT","JM","JP","JO","KZ","KE","KI","KP","KR","KW","KG","LA","LV","LB","LS","LR","LY","LI","LT","LU","MO","MK","MG","MW","MY","MV","ML","MT","MH","MQ","MR","MU","YT","MX","FM","MD","MC","MN","MS","MA","MZ","MM","NA","NR","NP","NL","AN","NC","NZ","NI","NE","NG","NU","NF","MP","NO","OM","PK","PW","PA","PG","PY","PE","PH","PN","PL","PT","PR","QA","RE","RO","RU","RW","KN","LC","VC","WS","SM","ST","SA","SN","SC","SL","SG","SK","SI","SB","SO","ZA","GS","ES","LK","SH","PM","SD","SR","SJ","SZ","SE","CH","SY","TW","TJ","TZ","TH","TG","TK","TO","TT","TN","TR","TM","TC","TV","UG","UA","AE","GB","US","UM","UY","UZ","VU","VA","VE","VN","VG","VI","WF","EH","YE","YU","ZR","ZM","ZW","ME","RS"];
mpf.states = {
    CA: ["AB","BC","PE","MB","NB","NS","NV","ON","QC","SK","NL","NT","YK"],
    US: ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC"]
},

mpf.validations = {
    creditcard: function (element) {
        var value = $(element).val().replace(/[^0-9]+/, '').substr(0, 16);

        if (element.value !== value) {
            element.value = value;
        }

        var cardDigits = element.value.split('');
        if (cardDigits.length >= 13 && cardDigits.length <= 16) {
            var total = 0;
            cardDigits.reverse().forEach(function (digit, index) {
                if ((index % 2) !== 0) {
                    var timestwo = (parseInt(digit, 10) * 2);
                    if (timestwo > 9) {
                        timestwo.toString().split('').forEach(function (digit) {
                            total += parseInt(digit, 10);
                        });
                    } else {
                        total += timestwo;
                    }
                } else {
                    total += parseInt(digit, 10);
                }
            });

            if ((total % 10) === 0) {
                return true;
            }
        }
        return false;
    },
    country: function (element) {
        var $element = $(element),
            $form = $element.closest('form'),
            state = $('[name=state]', $form).val(),
            country = $('[name=country]', $form).val();

        if (countries.indexOf(country) === -1) {
            return false;
        }

        if (!states.hasOwnProperty(country) || (states.hasOwnProperty(country) && states[country].indexOf(state) === -1)) {
            $('[name=state]', $element.closest('form')).val('0');
        }

        // set default states accordingly
        if (country === 'CA' && $('[name=state]', $element.closest('form')).val() === '0') {
            $('[name=state]', $element.closest('form')).val('QC');
        }

        return true;
    },
    state: function (element) {
        var $element = $(element),
            country = $('[name=country]', $element.closest('form')).val(),
            state = $(element).val();

        // state is optionnal except for US & CA
        if (state === 0 && country !== 'US' && country !== 'CA') {
            return true;
        }

        if (states.hasOwnProperty(country) && states[country].indexOf(state) !== -1) {
            return true;
        }

        return false;
    },
    phone: function (element) {
        var value = $(element).val().replace(/[^0-9+\.x]+/, '');
        if (element.value !== value) {
            element.value = value;
            return false;
        }

        if (element.value.length < 10 && element.value !== "") {
            return false;
        }
        return true;
    },
    email: function (element) {
        if ($(element).val().match(/.{1}@.{2}/)) {
            if (($(element).val().split("@").length - 1) > 1) {
                return false;
            }
            return true;
        }
        return false;
    },
    password: function (element) {
        var value = $(element).val();
        if (value.length < 8 && value.length !== 0) {
            return false;
        }
        return true;
    },
    passwordStrength: function (element) {
        var $element = $(element), value = $element.val(), strength = 0, uppercaseLetters = 0, numbers = 0, specialChars = 0, words = 0;
        if (value.length >= 8) {
            strength = 30;
        }

        if (value.match(/[A-Z]{1,}/)) {
            strength += 15;
            uppercaseLetters = value.replace(/[^A-Z]/, '').length;
        }

        if (value.match(/[0-9]{1,}/)) {
            strength += 15;
            numbers = value.replace(/[^0-9]/, '').length;
        }

        if (value.match(/[!|@|#|$|%|^|&|*|?|_|~]{1,}/)) {
            strength += 20;
            specialChars = value.replace(/[^0-9]/, '').length;
        }

        if (value.match(/ /)) {
            words = value.split(/ /).length;
        }

        if (specialChars > 1 && numbers > 1 && uppercaseLetters > 1) {
            strength += 20;
        }

        if (words > 2) {
            strength += 30;
        }

        // remove all the classes that starts with mpfStrength
        $('[data-mpf-password-strength-meter="'+element.name+'"]').removeClass(function (index, css) {
            return (css.match(/\bmpfStrength\S+/g) || []).join(' ');
        });

        if (strength < 50) {
            $('[data-mpf-password-strength-meter="'+element.name+'"]').addClass('mpfStrengthLow');
        } else if (strength >= 50 && strength <= 80) {
            $('[data-mpf-password-strength-meter="'+element.name+'"]').addClass('mpfStrengthMedium');
        } else if (strength > 80) {
            $('[data-mpf-password-strength-meter="'+element.name+'"]').addClass('mpfStrengthHigh');
        }

        strength = ($element.width() * (strength/100)) + 5;
        $('[data-mpf-password-strength-meter="'+element.name+'"]').css('width', strength +'px');
        return true;
    },
    passwordConfirm: function (element) {
        // find the password field
        var formName = $(element).closest('form').attr('name'), passwordField = null;
        mpf.forms[ formName ].forEach(function (field) {
            if (field.element.getAttribute('type') === 'password'
              && field.element.getAttribute('name') !== element.getAttribute('name')) {
                passwordField = field;
            }
        });

        // verify if the it matchs the password
        if (passwordField && $(passwordField.element).val() === $(element).val()) {
            return true;
        }

        return false;
    },
    numeric: function (element) {
        var value = $(element).val().replace(/[^0-9]+/, '');
        if (element.value !== value) {
            element.value = value;
            return false;
        }
        return true;
    },
    name: function (element) {
        var value = $(element).val().replace(/[^a-zA-Z0-9áãåàâäçéëèêíïìîñóõòôöùûúüýÿßæðøÁÃÅÀÂÄÇÉËÈÊÍÏÌÎÓÕÒÔÖÙÛÚÜÝ?., \-\']/, '');
        if (element.value !== value || value.length > 25) {
            element.value = value;
            return false;
        }
        return true;
    },
    username: function (element) {
        var value = $(element).val().replace(/[^a-zA-Z0-9 \-\'_]/, '');
        if (element.value !== value) {
            element.value = value;
            return false;
        }
        return true;
    },
    domain: function (element) {
        var $element = $(element), value = $element.val();
        if (value.match(/http:\/\//)) {
            value = value.replace(/http:\/\//, '');
            $element.val(value);
        }
        
        if (value.match(/https:\/\//)) {
            value = value.replace(/https:\/\//, '');
            $element.val(value);
        }

        if (value != value.replace(/[^a-zA-Z0-9\-_\.]/, '')) {
            return false;
        }

        if (!value.match(/([a-zA-Z0-9\-_]+\.)?[a-zA-Z0-9\-_]+\.[a-zA-Z]{2,5}/)) {
            return false;
        }
        return true;
    },
    noAccents: function (element) {
        if ($(element).val().match(/[áãåàâäçéëèêíïìîñóõòôöùûúüýÿßæðø]/)) {
            return false;
        }
        return true;
    },
    alphanumeric: function (element) {
        var value = $(element).val().replace(/[^a-zA-Z0-9áãåàâäçéëèêíïìîñóõòôöùûúüýÿßæðø]+/, '');
        if (element.value !== value) {
            element.value = value;
            return false;
        }
        return true;
    },
    required: function (element) {
        if (element.getAttribute('type') === 'checkbox') {
            // if its a checkbox we need to verify other box to see if atleast one is checked
            var isChecked = false;
            $('[name="'+element.getAttribute('name')+'"]', $(element).closest('form')).each(function (index, element) {
                if (element.checked) {
                    isChecked = true;
                    return;
                }
            });
            return isChecked;
        }

        if (element.getAttribute('type') === 'radio') {
            var val = $('[name="'+element.getAttribute('name')+'"]:checked', $(element).closest('form'));
            if (val.length === 0) {
                return false;
            }
            return true;
        }

        if (element.getAttribute('data-value') && $(element).val() === element.getAttribute('data-value')) {
            return false;
        }

        return ($(element).val() === '' ? false : true);
    }
};

$.fn.unvalidate = function removeValidate() {
    return this.stop().each(function() {
        var formName = $(this).closest('form').attr('name');
        formName = (typeof formName === 'undefined' ? 'default' : formName);
        if (!mpf.forms.hasOwnProperty(formName)) {
            return;
        }

        // find the element and remove it from the checks
        for (var i=0; i < mpf.forms[formName].length; i++) {
            if (mpf.forms[formName][i].element === this) {
                mpf.forms[formName].splice(i, 1);
                return;
            }
        }
    });
};

$.fn.validate = function validate() {
    var args = Array.prototype.slice.call(arguments),
        callback = null,
        eventString = '',
        checkString = '';

    if (typeof args[args.length-1] === 'function') {
        callback = args.pop();
    }
    checkString = (args.length <= 2 ? args[0] : '');
    eventString = (args.length >= 1 ? args[1] : '');

    return this.stop().each(function(){
        var checks = (checkString ? checkString.split(' ') : []),
            element = this,
            formName = $(element).closest('form').attr('name');

        if (['form','input','select','textarea'].indexOf(element.tagName.toLowerCase()) === -1) {
            console.error('The function .validate may only be used on folowing elements: form,input,select,textarea');
            return;
        }

        formName = (formName === undefined ? 'default' : formName);
        if (!mpf.forms.hasOwnProperty(formName)) {
            mpf.forms[formName] = [];
        }

        // if we call validate on a form element we validate all fields that have events on them
        if ('form' === element.tagName.toLowerCase()) {
            var isAllValid = true, invalidFields = [];

            // for all events that were bound we verify them
            for (var i=0; i < mpf.forms[formName].length; i++) {
                var isFieldValid = true, invalidChecks = [], event = mpf.forms[formName][i];
                if (event.checks.indexOf('required') !== -1 && !mpf.validations.required(event.element)) {
                    invalidChecks.push('required');
                    isFieldValid = false;
                    isAllValid = false;
                } else {
                    // verify all the checks for this element
                    for (var j=0; j < event.checks.length; j++) {
                        var check = event.checks[j];
                        if (check !== 'required' && mpf.validations.hasOwnProperty(check)) {
                            var isValid = mpf.validations[check](event.element);
                            isFieldValid &= isValid;
                            isAllValid &= isValid;

                            // we keep track of the checks that failed for this element
                            if (!isFieldValid) {
                                invalidChecks.push(check);
                            }
                        }
                    }
                }

                // for the form even there is a second argument that gives the list of element that failed the checks
                if (!isFieldValid) {
                    invalidFields.push({
                        element: event.element,
                        failedChecks: invalidChecks
                    });
                }
            }

            if (callback !== null) {
                callback.call(element, isAllValid, invalidFields);
            }
            return;
        }

        // verify if the check is not already added before adding it again
        var alreadyBound = false;
        for (var i=0; i < mpf.forms[formName].length; i++) {
            if (mpf.forms[formName][i].element === element) {
                alreadyBound = true;
            }
        }

        if (!alreadyBound) {
            mpf.forms[formName].push({
                eventString: eventString,
                checks: checks,
                element: element
            });
        }

        if (checks.length > 0) {
            for (var i=0; i < checks.length; i++) {
                $(element).trigger('addCheck', checks[i]);
            }

            $(element).bind(eventString, function (event) {
                var isValid = true;
                for (var i=0; i < checks.length; i++) {
                    var check = checks[i];
                    if (mpf.validations.hasOwnProperty(check)) {
                        isValid &= mpf.validations[check](element);
                    }
                }

                if (callback !== null) {
                    callback.call(element, isValid);
                }
            });
        }
    });
};

$.fn.addErrors = function addErrors(invalidFields) {
    return this.stop().each(function() {
        var $form = $(this), $errors = $('<ul class="error">');
        $('ul.error', $form).remove();
        $('[data-form-error-img]', $form).remove();
        $('.error', $form).removeClass('error');

        if (['form'].indexOf($form.prop("tagName").toLowerCase()) === -1) {
            console.error('The function .addErrors may only be used on form elements');
            return;
        }

        $('fieldset:visible', $form).prepend($errors);
        invalidFields.forEach(function (field) {
            var $element = $(field.element),
                $label = $('label[for="'+$element.attr('name')+'"]');

            // Custom error ?
            if (field.hasOwnProperty('msg')) {
                var errorMsg = field.msg;
                if (field.hasOwnProperty('code')) {
                    errorMsg = field.code +': '+ field.msg;
                }

                $errors.append('<li>'+ errorMsg +'</li>');
                if (field.hasOwnProperty('element')) {
                    $element.trigger('error', field.msg.replace(/"/g, '&quot;'));
                } else {
                    $form.trigger('error', field.msg.replace(/"/g, '&quot;'));
                }
            } else {
                field.failedChecks.forEach(function (check) {
                    var errorMsg = mpf.text('mpf_validations', check, {'@field@': $label.text()});
                    $errors.append('<li>'+ errorMsg +'</li>');
                    $element.trigger('error', errorMsg.replace(/"/g, '&quot;'));
                });
            }

            $label.addClass('error');
            $element.addClass('error');
        });
    });
};

$.fn.resetForm = function resetForm() {
    return this.stop().each(function() {
        var $form = $(this);
        if (['form'].indexOf($form.prop("tagName").toLowerCase()) === -1) {
            console.error('The function .resetForm may only be used on form elements');
            return;
        }

        $('input:not([type="submit"]),select,textarea', $form).val('');
        $('.spinnerWrapper', $form).remove();
        $('ul.error', $form).remove();
        $('.error', $form).removeClass('error');
        $('[data-form-error-img]', $form).remove();
    });
};

$.fn.ajaxSubmit = function ajaxSubmit(callback) {
    return this.stop().each(function() {
        var data = [], $form = $(this);

        if (['form'].indexOf($form.prop("tagName").toLowerCase()) === -1) {
            console.error('The function .ajaxSubmit may only be used on form elements');
            return;
        }

        $('[type="radio"]:checked', $form).each(function (index, element) {
            var $element = $(element);
            data.push($element.attr('name') +'='+ encodeURIComponent($element.val()));
        });

        $('[type="checkbox"]:checked', $form).each(function (index, element) {
            var $element = $(element);
            data.push($element.attr('name') +'[]='+ encodeURIComponent($element.val()));
        });

        $('[type="hidden"],[type="text"],[type="password"],textarea,select', $form).each(function (index, element) {
            var $element = $(element);
            data.push($element.attr('name') +'='+ encodeURIComponent($element.val()));
        });

        $('fieldset:visible', $form).prepend('<div class="spinnerWrapper">&nbsp;</div>');
        $('.spinnerWrapper', $form).spin();
        $('[type="submit"]', $form).hide();
        $('ul.error', $form).remove();
        return mpf.ajax($form.attr('action').replace('.html', ''), data.join('&'), $form.attr('method'), function (errors, response) {
            if (errors) {
                var $spinner = $('.spinnerWrapper', $form);
                $('[type="submit"]', $form).show();
                $spinner.spin(false);
                $spinner.fadeOut(function () {
                    $(this).remove();
                });
            }

            callback(errors, response);
        });
    });
};
