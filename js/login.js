$(document).ready(function () {
    "use strict";
    var $loginForm = $('form[name="login"]');

    $('#new').click(function () {
        $('.newUser').slideUp();

        if (this.checked) {
            $('.newUser').slideDown();
            $('#passwordConfirm').validate('required passwordConfirm');
        } else {
            $('#passwordConfirm').unvalidate();
        }
    });

    $('#new:checked').each(function (index, element) {
       $('.newUser').slideDown();
    });

    $('#email').validate('required email');
    $('#password').validate('required password');
    $loginForm.submit(function () {
        $('[data-error-img]').remove();

        $loginForm.prop('action', '/mpf-admin/rest/user/'+$('#email').val()+'/login');
        if ($('#new:checked').length == 1) {
            $loginForm.prop('action', '/mpf-admin/rest/user/');
            $loginForm.prop('method', 'post');
        }

        $loginForm.validate(function (isValid, invalidFields) {
            if (!isValid) {
                $loginForm.addFormErrors(invalidFields);
                return;
            }

            mpf.ajaxForm($loginForm, function (errors, response) {
                if (errors) {
                    $loginForm.addFormErrors(errors);
                    return;
                }

                document.location.href = "/mpf-admin/";
            });
        });

        return false;
    });
});
