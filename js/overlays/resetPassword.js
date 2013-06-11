$(document).ready(function () {
    "use strict";
    var $resetOverlay = $('[data-mpf-overlay="resetPassword"]'),
        $resetForm = $('form[name="resetPassword"]', $resetOverlay),
        $username = $('[name="reset_username"]', $resetForm),
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

                $fieldset1.slideUp(function () {
                    $fieldset2.slideDown();
                });
            });
        });

        return false;
    });

    $resetOverlay.bind('open', function () {
        $resetForm.resetForm();
        $fieldset2.hide();
        $submit2.hide();

        $fieldset1.show();
        $submit1.show();
    });
});