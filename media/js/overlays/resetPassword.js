$(document).ready(function () {
    "use strict";
    var $resetOverlay = $('[data-mpf-overlay="resetPassword"]'),
        $resetForm = $('form[name="resetPassword"]', $resetOverlay),
        $username = $('[name="reset_username"]', $resetForm),
        $password = $('[name="reset_password"]', $resetForm),
        $pwdConfirm = $('[name="reset_pwdConfirm"]', $resetForm),
        $submit1 = $('[type="submit"][name="step1"]', $resetForm),
        $submit2 = $('[type="submit"][name="step2"]', $resetForm),
        $fieldset1 = $('fieldset[data-step="1"]', $resetForm),
        $fieldset2 = $('fieldset[data-step="2"]', $resetForm);

    $username.validate('required username');

    $submit1.click(function () {
        $resetForm.submit();
    });

    $submit2.click(function () {
        $resetForm.submit();
    });

    $resetForm.on('submit', function () {
        $resetForm.validate(function (isValid, invalidFields) {
            if (!isValid) {
                $resetForm.addErrors(invalidFields);
                return;
            }

            $resetForm.prop('action', mpf.restUrl+'user/'+ $username.val() +'/resetpassword');
            $resetForm.ajaxSubmit(function (errors, response) {
                if (errors) {
                    $resetForm.addErrors(errors);
                    return;
                }

                $fieldset1.css('display', 'none');
                $('.spinnerWrapper', $resetForm).remove();
                if ($fieldset2.is(':visible')) {
                    $fieldset2.append('<div class="success"><p>'+mpf.text('overlays/resetPassword', 'success')+'</p></div>');
                    return;
                }

                $fieldset2.css('display', 'block');
                $submit2.show();
                $password.focus();
                $password.validate('required passwordStrength password', 'keyup');
                $pwdConfirm.validate('required passwordConfirm');
            });
        });

        return false;
    });

    $resetOverlay.bind('openned', function () {
        $resetForm.resetForm();
        $fieldset2.hide();
        $submit2.hide();

        $password.unvalidate('required passwordStrength password', 'keyup');
        $pwdConfirm.unvalidate('required passwordConfirm');

        $fieldset1.show(function () {
            $username.focus();
        });
        $submit1.show();
    });

});