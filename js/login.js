$(document).ready(function () {
    "use strict";
    var $loginForm = $('form[name="login"]');

    $('#new').click(function () {
        $('.newUser').slideUp();

        if (this.checked) {
            $('.existingUser').slideUp(function () {
                $('.newUser').slideDown();
            });
            $('#passwordConfirm').validate('required passwordConfirm');
            $('#password').validate('required passwordStrength password', 'keyup');
        } else {
            $('.newUser').slideUp(function () {
                $('.existingUser').slideDown();
            });
            $('#passwordConfirm').unvalidate();
            $('#password').unvalidate();
            $('#password').validate('required password');
        }
    });

    $('#new:checked').each(function (index, element) {
       $('.newUser').slideDown();
       $('#passwordConfirm').validate('required passwordConfirm');
       $('#password').validate('required passwordStrength password', 'keyup');
    });

    $('#username').focus();
    $('#username').validate('required username');
    $('#password').validate('required password');
    $loginForm.submit(function () {
        $('[data-form-error-img]').remove();

        $loginForm.prop('action', mpf.restUrl+'user/'+$('#username').val()+'/login');
        if ($('#new:checked').length === 1) {
            $loginForm.prop('action', mpf.restUrl+'user/');
            $loginForm.prop('method', 'post');
        }

        $loginForm.validate(function (isValid, invalidFields) {
            if (!isValid) {
                $loginForm.addErrors(invalidFields);
                return;
            }

            $loginForm.ajaxSubmit(function (errors, response) {
                if (errors) {
                    $loginForm.addErrors(errors);
                    return;
                }

                document.location.href = "/mpf-admin/";
            });
        });

        return false;
    });
});