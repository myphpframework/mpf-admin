$(document).ready(function () {
    var $loginForm = $('form[name="login"]');

    $('#new').click(function () {
        $('.newUser').slideUp();

        if (this.checked) {
            $('.newUser').slideDown();
        }
    });

    $('#new:checked').each(function (index, element) {
       $('.newUser').slideDown();
    });

    $('#email').validate('required email');
    $('#password').validate('required password');
    $('#passwordConfirm').validate('required passwordConfirm');
    $loginForm.submit(function () {
        $('[data-error-img]').remove();

        $loginForm.prop('action', '/mpf-admin/rest/user/'+$('#email').val()+'/login');
        if ($('#new:checked').length > 1) {
            $loginForm.prop('action', '/mpf-admin/rest/user/');
            $loginForm.prop('method', 'post');
        }

        $loginForm.validate(function (isValid, invalidFields) {
            if (!isValid) {
                $loginForm.addFormErrors(invalidFields);
                return;
            }

            mpf.ajaxForm($loginForm, function (error, response) {
                console.log(response);
            })
        });

        return false;
    });
});
